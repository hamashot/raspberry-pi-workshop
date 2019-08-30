const net = require('net')
const host = 'localhost'
const port = 12345

let server = net.createServer((conn) => {
  conn.write('server-> Hello, Client! I am server.')
  conn.on('data', (data) => {
    console.log(`server-> Recieve client data: ${data} from ${conn.remoteAddress}:${conn.remotePort}`)
    conn.write(`server-> Repeat: ${data}`)
  })
  conn.on('close', () => {
    console.log(`server-> client closed connection.`)
  })
}).listen(port)

console.log(`tcp server start. ${host}:${port}`)
