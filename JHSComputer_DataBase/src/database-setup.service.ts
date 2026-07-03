import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import fs from 'node:fs/promises';
import path from 'node:path';
import mysql, { Connection, ConnectionOptions } from 'mysql2/promise';

type SetupMode = 'apply' | 'reset' | 'bootstrap-server';
type DatabaseTargetName = 'dev' | 'stage' | 'prod';

interface DatabaseTarget {
  name: DatabaseTargetName;
  database: string;
  username: string;
  password: string;
}

@Injectable()
export class DatabaseSetupService {
  private readonly logger = new Logger(DatabaseSetupService.name);

  constructor(private readonly config: ConfigService) {}

  async run(args: string[]) {
    const mode = this.resolveMode(args);
    const targetName = this.resolveTargetName(args);
    const sqlDir = path.resolve(process.cwd(), 'mysql/init');

    this.logger.log(`Mode: ${mode}`);
    this.logger.log(`SQL directory: ${sqlDir}`);

    const root = await this.createConnection({ database: undefined, root: true });

    try {
      if (mode === 'bootstrap-server') {
        await this.bootstrapServerDatabases(root, sqlDir);
        return;
      }

      const target = this.resolveTarget(targetName);

      if (mode === 'reset') {
        this.assertResetAllowed(target);
        this.logger.warn(`Dropping database if exists: ${target.database}`);
        await root.query(`DROP DATABASE IF EXISTS ${this.quoteIdentifier(target.database)}`);
      }

      await this.ensureDatabaseAndUser(root, target);
      await this.applySchemaAndSeeds(target, sqlDir);
    } finally {
      await root.end();
    }
  }

  private async bootstrapServerDatabases(root: Connection, sqlDir: string) {
    const targets: DatabaseTargetName[] = ['dev', 'stage', 'prod'];

    for (const targetName of targets) {
      const target = this.resolveTarget(targetName);
      this.logger.log(`Bootstrapping ${target.name}: ${target.database}`);
      await this.ensureDatabaseAndUser(root, target);
      await this.applySchemaAndSeeds(target, sqlDir);
    }
  }

  private async applySchemaAndSeeds(target: DatabaseTarget, sqlDir: string) {
    const appDb = await this.createConnection({
      database: target.database,
      root: false,
      username: target.username,
      password: target.password,
    });
    const orderedFiles = [
      '01_schema.sql',
      '02_indexes.sql',
      '03_seed_master.sql',
      '04_seed_games.sql',
      '05_benchmark_schema.sql',
      '06_cart_schema.sql',
      '07_recommendation_posts.sql',
    ];

    try {
      for (const fileName of orderedFiles) {
        await this.executeSqlFile(appDb, path.join(sqlDir, fileName));
      }
    } finally {
      await appDb.end();
    }
  }

  private resolveMode(args: string[]): SetupMode {
    if (args.includes('--bootstrap-server')) return 'bootstrap-server';
    if (args.includes('--reset')) return 'reset';
    return 'apply';
  }

  private resolveTargetName(args: string[]): DatabaseTargetName {
    const inlineTarget = args.find((arg) => arg.startsWith('--target='));
    const target = inlineTarget?.split('=')[1] ?? this.get('DB_TARGET', 'dev');

    if (target === 'dev' || target === 'stage' || target === 'prod') {
      return target;
    }

    throw new Error(`Unsupported DB target: ${target}. Use dev, stage, or prod.`);
  }

  private resolveTarget(name: DatabaseTargetName): DatabaseTarget {
    const upper = name.toUpperCase();
    const defaultDatabase = `jhs_computer_${name}`;
    const defaultUsername = `jhs_${name}`;

    return {
      name,
      database: this.get(`DB_${upper}_DATABASE`, name === 'dev' ? this.get('DB_DATABASE', defaultDatabase) : defaultDatabase),
      username: this.get(`DB_${upper}_USERNAME`, name === 'dev' ? this.get('DB_USERNAME', defaultUsername) : defaultUsername),
      password: this.get(`DB_${upper}_PASSWORD`, name === 'dev' ? this.get('DB_PASSWORD', `jhs_${name}_password`) : `jhs_${name}_password`),
    };
  }

  private assertResetAllowed(target: DatabaseTarget) {
    const env = this.get('DB_ENV', 'development');

    if (target.name !== 'dev' || !target.database.endsWith('_dev') || env === 'production') {
      throw new Error(
        `Refusing to reset ${target.database}. Reset is allowed only for the dev target with a *_dev database outside production.`,
      );
    }
  }

  private async ensureDatabaseAndUser(connection: Connection, target: DatabaseTarget) {
    this.assertSafeIdentifier(target.database, 'database');
    this.assertSafeIdentifier(target.username, 'username');

    const database = this.quoteIdentifier(target.database);
    const username = this.quoteString(target.username);
    const password = this.quoteString(target.password);

    await connection.query(`CREATE DATABASE IF NOT EXISTS ${database} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    await connection.query(`CREATE USER IF NOT EXISTS ${username}@'%' IDENTIFIED BY ${password}`);
    await connection.query(`ALTER USER ${username}@'%' IDENTIFIED BY ${password}`);
    await connection.query(`GRANT ALL PRIVILEGES ON ${database}.* TO ${username}@'%'`);
    await connection.query('FLUSH PRIVILEGES');
  }

  private async createConnection(options: {
    database?: string;
    root: boolean;
    username?: string;
    password?: string;
  }): Promise<Connection> {
    const connectionOptions: ConnectionOptions = {
      host: this.get('DB_HOST', 'localhost'),
      port: Number(this.get('DB_PORT', '3306')),
      user: options.root ? this.get('DB_ROOT_USERNAME', 'root') : (options.username ?? this.get('DB_USERNAME', 'jhs_dev')),
      password: options.root
        ? this.get('DB_ROOT_PASSWORD', 'root_password')
        : (options.password ?? this.get('DB_PASSWORD', 'jhs_dev_password')),
      database: options.database,
      multipleStatements: true,
      charset: 'utf8mb4',
      timezone: '+09:00',
    };

    return mysql.createConnection(connectionOptions);
  }

  private assertSafeIdentifier(value: string, label: string) {
    if (!/^[A-Za-z0-9_]+$/.test(value)) {
      throw new Error(`Unsafe ${label} identifier: ${value}`);
    }
  }

  private quoteIdentifier(value: string): string {
    this.assertSafeIdentifier(value, 'identifier');
    return `\`${value}\``;
  }

  private quoteString(value: string): string {
    return `'${value.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
  }

  private async executeSqlFile(connection: Connection, filePath: string) {
    const sql = await fs.readFile(filePath, 'utf8');
    const trimmed = sql.trim();

    if (!trimmed) {
      this.logger.warn(`Skipped empty SQL file: ${path.basename(filePath)}`);
      return;
    }

    this.logger.log(`Applying ${path.basename(filePath)}`);
    await connection.query(trimmed);
  }

  private get(key: string, fallback: string): string {
    return this.config.get<string>(key) ?? fallback;
  }
}
