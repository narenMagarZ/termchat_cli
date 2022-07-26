
import { WebSocketServer } from "ws";


const server = new WebSocketServer({
    port:4444,
    host:'127.0.0.1'
})
server.on('connection',(socket)=>{
    socket.on('message',(msg)=>{
        console.log(msg)
        // setTimeout(() => {
            socket.send('i got your msg')
        // }, 2000);
    })
})