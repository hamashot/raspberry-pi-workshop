const net = require('net')
const host = '192.168.1.47' // raspberry piのipアドレス
const port = '12345'

const client = new net.Socket()

client.connect(port, host, () => {
  console.log('client-> connected to server.')
  client.write('client-> Hello, Server! I am client.')
})

process.stdin.resume()

process.stdin.on('data', (data) => {
  client.write(data)
})

client.on('data', (data) => {
  console.log(`${data}`)
})

client.on('close', () => {
  console.log('client-> connection is closed.')
})
