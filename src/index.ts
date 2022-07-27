import request from 'request'
import {v4 as uuidv4} from 'uuid'
import WsClient from './wsclient'
import {clog} from './logcolor'

const {infoColor,warnColor,successColor,errorColor} = clog
const log = console.log
async function InitTermChat(){
    const termArg = process.argv.slice(2)
    let uid = '' 
    if(Array.isArray(termArg)){
        if(termArg.length == 1)
            uid = termArg[0]
        else if(termArg.length > 1) 
            uid = termArg[0]
        else uid = uuidv4().split('-')[0]
    } else process.exit(1)
    log(infoColor('connecting to the remote http server...'))
    const isAlreadyInUse = await checkIfUserUidAlreadyInUse(uid)
    if(isAlreadyInUse){
        log(warnColor('uid already in use, try with new uid'))
        process.exit(1)
    }
    WsClient(uid)
    }

export default InitTermChat

async function checkIfUserUidAlreadyInUse(uid:string):Promise<boolean>{
    const HTTPSERVER = 'http://127.0.0.1:4000'
    const apiEnd = HTTPSERVER + `/?id=${uid}`
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

