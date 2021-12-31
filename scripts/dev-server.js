process.env.NODE_ENV = 'development';

const Vite = require('vite');
const ChildProcess = require('child_process');
const path = require('path');
const chalk = require('chalk');
const Chokidar = require('chokidar');

let electronProcess = null;

async function startRenderer() {
  const config = require(path.join(__dirname, '..', 'tsconfig.renderer.json'));

  const server = await Vite.createServer({
    ...config,
    mode: 'development'
  });

  return server.listen();
}

function startElectron(rendererPort) {
  if (electronProcess) {
    // single instance lock
    return;
  }

  const args = [path.join(__dirname, 'main.js'), rendererPort];

  electronProcess = ChildProcess.spawn('electron', args);

  electronProcess.stdout.on('data', (data) => {
    console.log(chalk.blueBright(`[Electron] `) + chalk.white(data.toString()));
  });

  electronProcess.stderr.on('data', (data) => {
    console.log(chalk.redBright(`[Electron] `) + chalk.white(data.toString()));
  });
}

function restartElectron(rendererPort) {
  if (electronProcess) {
    electronProcess.kill();
    electronProcess = null;
  }

  startElectron(rendererPort);
}

async function start() {
  console.log(`${chalk.blueBright('===============================')}`);
  console.log(`${chalk.blueBright('Starting Electron + Vite Dev Server...')}`);
  console.log(`${chalk.blueBright('===============================')}`);

  const devServer = await startRenderer();
  rendererPort = devServer.config.server.port;

  startElectron(rendererPort);

  Chokidar.watch(path.join(__dirname, '..', 'src', 'main')).on('change', () => {
    restartElectron(rendererPort);
  });
}

start();
