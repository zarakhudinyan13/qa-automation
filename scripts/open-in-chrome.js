const { spawn } = require('child_process');
const path = require('path');

const relative = process.argv[2] || 'lessons/exam.html';
const file = path.resolve(relative);

function launch(command, args) {
  const child = spawn(command, args, { detached: true, stdio: 'ignore' });
  child.on('error', (error) => {
    console.error(`Could not open Google Chrome: ${error.message}`);
    process.exit(1);
  });
  child.unref();
}

if (process.platform === 'darwin') {
  launch('open', ['-a', 'Google Chrome', file]);
} else if (process.platform === 'win32') {
  launch('cmd', ['/c', 'start', '', 'chrome', file]);
} else {
  launch('google-chrome', [file]);
}
