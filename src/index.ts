import makeWASocket, { DisconnectReason, useMultiFileAuthState } from '@whiskeysockets/baileys'
import { Boom } from '@hapi/boom'
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';


const app = express();
const router = express.Router();
const port = 3000;

var sock: any;

connectToWhatsApp()

app.use(bodyParser.json());

app.use(cors())


router.get('/', async (req,res)=>{
    await sock.sendMessage('917034760782@s.whatsapp.net', { text: 'Hi rithu'})
    return res.json({"status":true,"message":"Message send successful"});
})

app.use('/message', router)

app.listen(port, () => {
    console.log(`Timezones by location application is running on port ${port}.`);
});




//functions
async function connectToWhatsApp() {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys')

    sock = makeWASocket({
        auth: state,
        printQRInTerminal: true
    })
    var isMessagesent = false;
    sock.ev.on('creds.update', saveCreds)
    sock.ev.on('connection.update', (update: any) => {
        const { connection, lastDisconnect } = update
        if (connection === 'close') {
            const shouldReconnect = (lastDisconnect.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut
            console.log('connection closed due to ', lastDisconnect.error, ', reconnecting ', shouldReconnect)
            // reconnect if not logged out
            if (shouldReconnect) {
                connectToWhatsApp()
            }
        } else if (connection === 'open') {
            console.log('opened connection')
        }
    })
    // sock.ev.on('messages.upsert', async (m: any) => {
    //     console.log(JSON.stringify(m, undefined, 2))

    //     console.log('replying to', m.messages[0].key.remoteJid)
    //     if (!isMessagesent) {
    //         await sock.sendMessage(m.messages[0].key.remoteJid!, { text: 'Hello there! You said:' + m.messages[0].message.conversation })
    //         isMessagesent = true;
    //     } else {
    //         isMessagesent = false;
    //     }
    // })
}