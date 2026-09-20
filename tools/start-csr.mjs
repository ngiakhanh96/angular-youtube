import { spawn, spawnSync } from 'node:child_process';

const port = 4200;
const isWindows = process.platform === 'win32';

function getWindowsPortListeners() {
  const result = spawnSync('netstat.exe', ['-ano', '-p', 'tcp'], {
    encoding: 'utf8',
    windowsHide: true,
  });

  if (result.status !== 0 || !result.stdout) {
    return [];
  }

  return [
    ...new Set(
      result.stdout
        .split(/\r?\n/)
        .map((line) => line.trim().split(/\s+/))
        .filter(
          (columns) =>
            columns.length >= 5 &&
            columns[0] === 'TCP' &&
            columns[1].endsWith(`:${port}`) &&
            columns[3] === 'LISTENING',
        )
        .map((columns) => Number(columns[4]))
        .filter((processId) => processId > 0 && processId !== process.pid),
    ),
  ];
}

function killWindowsProcessTree(processId) {
  if (!processId || processId === process.pid) {
    return;
  }

  spawnSync(
    'taskkill.exe',
    ['/PID', String(processId), '/T', '/F'],
    {
      stdio: 'ignore',
      windowsHide: true,
    },
  );
}

function killRemainingPortListeners() {
  if (!isWindows) {
    return [];
  }

  const processIds = getWindowsPortListeners();

  for (const processId of processIds) {
    killWindowsProcessTree(processId);
  }

  return processIds;
}

if (process.argv.includes('--stop')) {
  const sleepState = new Int32Array(new SharedArrayBuffer(4));
  const deadline = Date.now() + 7_000;

  while (Date.now() < deadline) {
    killRemainingPortListeners();
    Atomics.wait(sleepState, 0, 0, 200);
  }

  killRemainingPortListeners();
  process.exit(0);
}

killRemainingPortListeners();

const child = isWindows
  ? spawn(
      process.env.ComSpec ?? 'cmd.exe',
      ['/d', '/s', '/c', 'npm run start-csr'],
      {
        stdio: 'inherit',
        windowsHide: true,
      },
    )
  : spawn('npm', ['run', 'start-csr'], {
      detached: true,
      stdio: 'inherit',
    });

let cleaningUp = false;

function cleanup() {
  if (cleaningUp) {
    return;
  }

  cleaningUp = true;

  if (isWindows) {
    killWindowsProcessTree(child.pid);
    killRemainingPortListeners();
  } else if (child.pid) {
    try {
      process.kill(-child.pid, 'SIGTERM');
    } catch {
      // The process group has already stopped.
    }
  }
}

for (const signal of ['SIGINT', 'SIGTERM', 'SIGHUP']) {
  process.once(signal, () => {
    cleanup();
    process.exit(0);
  });
}

child.once('error', (error) => {
  console.error(`[start-csr] ${error.message}`);
  cleanup();
  process.exitCode = 1;
});

child.once('exit', (code) => {
  cleanup();
  process.exitCode = code ?? 1;
});

process.once('exit', cleanup);
