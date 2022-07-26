import color from 'colors'
import {resolve} from 'node:path'
import fs, { realpath } from 'node:fs'
import request from 'request'
import {WebSocket} from 'ws'
import readline from 'node:readline'
import Event from 'node:events'
import {v4 as uuidv4} from 'uuid'
import {dots} from 'cli-spinners'
import dotenv from 'dotenv'

dotenv.config()
const infoColor = color.cyan.bold
const errorColor = color.red.bold
const warnColor = color.yellow.bold
const successColor = color.green.bold
const log = console.log
async function InitTermChat(){
    
    const termArg = process.argv.slice(2)
    let userUid 
    if(Array.isArray(termArg)){
        if(termArg.length == 1)
            userUid = termArg
        else if(termArg.length > 1) 
            userUid = termArg[0]
        else userUid = uuidv4().split('-')[0]
    } else process.exit(1)
    log(infoColor('conneting to the remote http server'))
    const isAlreadyInUse = await checkIfUserUidAlreadyInUse(userUid)
    if(isAlreadyInUse){
        log(warnColor('uid already in use, try with new uid'))
        process.exit(1)
    } else {
        log(successColor('ok'))
    }
    
    const client = new WebSocket(process.env.WEBSOCKETSERVER as string + `/${userUid}`)
    const ev = new Event()
    log(infoColor('connecting to the ws server...'))
    client.on('upgrade',()=>{
        log(infoColor('transferring to the ws server...'))
    })
    client.onopen = function(){
        log(successColor('connection to the ws server is successful'))
        log(successColor(`you are now joining as ${userUid}`))
        ev.emit('ok')
    }

    client.onerror = function(){
        log(errorColor('connection is refused'))
    }
    client.onclose = function(){
        log(warnColor('connection is closed'))
        process.exit(1)
        
    }
    client.on('message',(msg)=>{
        setTimeout(() => {
            process.stdout.write(msg.toString()+'\n')
            rl.prompt(true)
        }, 2000);
    })
        const rl = readline.createInterface({
            input:process.stdin,
            output:process.stdout,
            terminal:true,
            prompt:`$${userUid}~>> `.yellow
        })
        readline.emitKeypressEvents(process.stdin,rl)
        // console.log(process.stdin.isTTY)
        // process.stdin.setRawMode(true)
        process.stdin.on('keypress',(c,k)=>{
            // console.log(c,k)
            // console.log(rl.line)
        })
        // process.stdin.on('data',(data)=>{
            //     console.log(data.toString('utf-8').slice(1))
            // })
            process.stdin.setEncoding('utf-8')
            process.stdout.setEncoding('utf-8')
            let isCommand = true
            let sendTo = ''
            ev.once('ok',()=>{
                rl.prompt()
                rl.on('line',(line)=>{
                    const cmd = line.trim().toLowerCase()
                    if(isCommand){
                        //  #[A-z]+[A-z0-9]{2}
                        if(cmd === 'send'){
                            const msg = JSON.stringify({'type':'cmd','cmd':'send','name':userUid,'msg':'hi','to':'sudip'})
                            client.send(msg)
                        }
                        else if(cmd == 'ls'){
                            const msg = JSON.stringify({'type':'cmd','cmd':'ls'})
                            client.send(msg)
                        }
                        
                    } else {

                    }
                    rl.prompt()
        })
            })

  
    }

export default InitTermChat

async function checkIfUserUidAlreadyInUse(uid:string):Promise<boolean>{
    const apiEnd = process.env.HTTPSERVER as string + `/?id=${uid}`
    return new Promise((resolve)=>{
        request(apiEnd,(err,_response,body)=>{
            if(err) {
                log(errorColor(err.message))
                // resolve(false)
                process.exit(1)
                
            } else {
                if(body === 'true') resolve(true)
                else resolve(false)
            }
        })
    })
}

function createUserUid(){

}