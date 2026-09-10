#!/usr/bin/env node
import { access, cp, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const nextDir = path.join(projectDir, '.next');
const standaloneDir = path.join(nextDir, 'standalone', path.basename(projectDir));

await access(path.join(standaloneDir, 'server.js'));
await mkdir(path.join(standaloneDir, '.next'), { recursive: true });
await cp(path.join(nextDir, 'static'), path.join(standaloneDir, '.next', 'static'), {
  recursive: true,
  force: true,
});

try {
  await access(path.join(projectDir, 'public'));
  await cp(path.join(projectDir, 'public'), path.join(standaloneDir, 'public'), {
    recursive: true,
    force: true,
  });
} catch {
  // This project currently has no public directory.
}

console.log(`[standalone] copied static assets to ${path.relative(projectDir, standaloneDir)}`);
