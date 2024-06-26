const { spawn } = require('child_process')

const cmd = async (...command) => {
  let p = spawn(command[0], command.slice(1));
  
  return new Promise((resolveFunc) => {
    p.stdout.on('data', (x) => {
      process.stdout.write(x.toString())
    })
    p.stderr.on('data', (x) => {
      process.stderr.write(x.toString())
    })
    p.on('exit', (code) => {
      resolveFunc(code)
    })
  })
}

export {
  cmd
}
