const pack = require('./package.json');
const { spawn } = require('child_process');
const AUTHOR_NAME = 'jimliu'

const executer = spawn('docker', 
    [
        'build', 
        '-t', `${AUTHOR_NAME}/${pack.name}:${pack.version}`, 
        '-t', `${AUTHOR_NAME}/${pack.name}:latest`, 
        '.']);

executer.stdout.on('data', (data) => {
    console.log(`${data}`);
});

executer.stderr.on('data', (data) => {
    console.error(`${data}`);
});

executer.on('close', (code) => {
    console.log(`exited with code ${code}`);
    process.exit(code);
});