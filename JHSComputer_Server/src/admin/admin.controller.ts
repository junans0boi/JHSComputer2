import { BadRequestException, Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { spawn } from 'node:child_process';
import path from 'node:path';
import { JwtAuthGuard, Roles, RolesGuard } from '../auth';

const ALLOWED_SCRIPTS = [
  'sync:kjwwang:benchmark-db',
  'crawl:compuzone:samples',
  'sync:compuzone:db',
  'crawl:wanggapc:html',
  'sync:wanggapc:builds-db',
  'generate:jhs-recommendations',
  'sync:catalog',
  'pipeline:samples',
  'pipeline:full',
] as const;

type AgentStatus = 'running' | 'done' | 'error';

interface AgentJob {
  scriptName: string;
  status: AgentStatus;
  startTime: number;
  endTime?: number;
}

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class AdminController {
  private readonly jobs = new Map<string, AgentJob>();

  private get agentDir() {
    return process.env.AGENT_DIR ?? path.resolve(process.cwd(), '../JHSComputer_Agent');
  }

  @Post('agents/run')
  runAgent(@Body('scriptName') scriptName: string) {
    if (!ALLOWED_SCRIPTS.includes(scriptName as (typeof ALLOWED_SCRIPTS)[number])) {
      throw new BadRequestException('허용되지 않은 에이전트입니다.');
    }

    // 중복 실행 방지
    const running = [...this.jobs.values()].find(j => j.scriptName === scriptName && j.status === 'running');
    if (running) {
      return { status: 'already_running', scriptName };
    }

    const jobId = `${scriptName}-${Date.now()}`;
    this.jobs.set(jobId, { scriptName, status: 'running', startTime: Date.now() });

    const isPipeline = scriptName.startsWith('pipeline:');
    const spawnArgs = isPipeline
      ? ['pipeline.mjs', `--mode=${scriptName.split(':')[1]}`]
      : ['run-agent.mjs', scriptName];

    const child = spawn('node', spawnArgs, {
      cwd: this.agentDir,
      stdio: 'ignore',
      detached: true,
    });
    child.unref();

    child.on('close', (code) => {
      const job = this.jobs.get(jobId);
      if (job) {
        job.status = code === 0 ? 'done' : 'error';
        job.endTime = Date.now();
      }
    });

    return { jobId, status: 'running', scriptName };
  }

  @Get('agents/jobs')
  getJobs() {
    const result: Array<{ jobId: string } & AgentJob> = [];
    for (const [jobId, job] of this.jobs.entries()) {
      result.push({ jobId, ...job });
    }
    // 최근 20개만 반환, 최신 순
    return result.sort((a, b) => b.startTime - a.startTime).slice(0, 20);
  }
}
