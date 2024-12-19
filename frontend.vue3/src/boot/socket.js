import { boot } from 'quasar/wrappers'
import io from 'socket.io-client'

export default boot(({ app }) => {
  const socket = io(process.env.VUE_URL_API, {
    transports: ['websocket'],
    upgrade: false
  })

  app.provide('socket', socket)

  socket.on('connect', () => {
    console.log('Socket conectado')
  })

  socket.on('disconnect', () => {
    console.log('Socket desconectado')
  })
}) 