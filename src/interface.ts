import readline from 'node:readline'
import EventEmitter from 'node:events'
import { getClient } from './wsclient'
function Interface(uid:string,ev:EventEmitter){
    const log = console.log
    const rl = readline.createInterface({
        input:process.stdin,
        output:process.stdout,
        prompt:`$${uid}~>> `.magenta,
        terminal:true
    })
    process.stdin.setEncoding('utf-8')
    process.stdout.setEncoding('utf-8')
    let isCommand = true
    let sendTo = ''
    // readline.emitKeypressEvents(process.stdin,rl)
    // process.stdin.on('keypress',(c,k)=>{
        // console.log(k.name.slice(1).rainbow)
    // })
    ev.once('ok',()=>{
        rl.prompt()
        rl.on('line',rawCmd=>{
            const cmd = rawCmd.trim()
            if(cmd === 'ls' && isCommand){
                const msg = {
                    'type' : 'cmd',
                    'msg' : cmd,
                    'uid' : uid
                }
                getClient().send(JSON.stringify(msg))
            } else if(/^#[A-z]{1,}[A-z0-9]{2,}$/.test(cmd) && isCommand){
                // here we get into msg mode
                const msg = {
                    'type' : 'cmd',
                    'msg' : '',
                    'uid' : uid
                }
                sendTo = cmd.slice(1)
                getClient().send(JSON.stringify(msg))
                isCommand = false
            } else if(!isCommand && cmd.search('-s') !== -1){
                // switch to the another user
                sendTo = cmd.split('-s')[0].trim() || cmd.split('-s')[1].trim()
                sendTo = sendTo.slice(1)
                const msg = {
                    'type' : 'cmd',
                    'msg' : `switched to user ${sendTo}`,
                    'uid' : uid
                }
                getClient().send(JSON.stringify(msg))
            } else if(!isCommand && cmd.search('-o') !== -1){
                sendTo = ''
                isCommand = true
            } else if(!isCommand){
                const msg = {
                    'type' : 'msg',
                    'msg' : cmd,
                    'to' : sendTo,
                    'uid' : uid
                }
                getClient().send(JSON.stringify(msg))
            }
            rl.prompt()
    })
    })
    return rl
}
export default Interface


        // process.stdin.on('data',(data)=>{
            //     console.log(data.toString('utf-8').slice(1))
            // })

            // // console.log(process.stdin.isTTY)
            // // process.stdin.setRawMode(true)
