import { WebSocket } from "ws";
import Event from 'node:events'
import Interface from './interface'
import {ReadLine} from 'node:readline'
import { clog } from "./logcolor";

let client : WebSocket
const WEBSOCKETSERVER = 'ws://127.0.0.1:4000'
function WsClient(uid:string){
    const log = console.log
    client = new WebSocket(WEBSOCKETSERVER + `/${uid}`)
    const ev = new Event()
    let rl : ReadLine
    const {infoColor,successColor,errorColor,warnColor} = clog
    log(infoColor('connecting to the ws server...'))
    client.on('upgrade',()=>{
        log(infoColor('transferring to the ws server...'))
    })
    client.onopen = function(){
        log(successColor('connection to the ws server is successful'))
        log(infoColor(`you are now joining as ${uid}`))
        ev.emit('ok')
    }

    client.onerror = function(){
        log(errorColor('connection is refused'))
    }
    client.onclose = function(){
        log(warnColor('connection is closed'))
        process.exit(1)  
    }
    client.on('message',(rawMsg)=>{
        const msgFromServer = JSON.parse(rawMsg.toString())
        const {msg,type} = msgFromServer
        if(type === 'msg'){
            const {from} = msgFromServer
            process.stdout.write(msg.red + ` (${from})`.yellow + '\n')
        } else {
            process.stdout.write(msg.yellow + '\n')
            
        }
            rl.prompt(true)
    })
    rl = Interface(uid,ev)
    }

export function getClient():WebSocket{
    return client
}
export default WsClient