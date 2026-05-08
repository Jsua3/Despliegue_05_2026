import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

const rawArgs = process.argv.slice(2);
let configuration = 'production';

for (let index = 0; index < rawArgs.length; index += 1) {
  const arg = rawArgs[index];
  if (arg === '--configuration' && rawArgs[index + 1]) {
    configuration = rawArgs[index + 1];
  }
  if (arg.startsWith('--configuration=')) {
    configuration = arg.split('=')[1] || configuration;
  }
  if (arg === 'production' || arg === 'development') {
    configuration = arg;
  }
}

const localNg = process.platform === 'win32'
  ? join('node_modules', '.bin', 'ng.cmd')
  : join('node_modules', '.bin', 'ng');
const ngCommand = existsSync(localNg) ? localNg : 'ng';
const result = spawnSync(ngCommand, ['build', '--configuration', configuration], {
  stdio: 'inherit',
  shell: process.platform === 'win32'
});

process.exit(result.status ?? 1);
