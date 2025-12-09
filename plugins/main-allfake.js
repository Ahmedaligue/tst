import fs from 'fs'
import fetch from 'node-fetch'
import axios from 'axios'
import moment from 'moment-timezone'

var handler = m => m
handler.all = async function (m) { 
global.canalIdM = [
  "120363405848897016@newsletter",
  "120363405848897016@newsletter"
]

global.canalNombreM = [
  "꒰ ❤️ SENKU BOT ❤️ ꒱", 
  "🧫 SENKU BOT 🧪"
]

global.channelRD = await getRandomChannel()

global.d = new Date(new Date + 3600000)
global.locale = 'es'
global.dia = d.toLocaleDateString(locale, {weekday: 'long'})
global.fecha = d.toLocaleDateString('es', {day: 'numeric', month: 'numeric', year: 'numeric'})
global.mes = d.toLocaleDateString('es', {month: 'long'})
global.año = d.toLocaleDateString('es', {year: 'numeric'})
global.tiempo = d.toLocaleString('en-US', {hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true})

global.nombre = m.pushName || 'User-MD'
global.packsticker = ``

global.iconos = [
  'https://files.catbox.moe/cmngcg.jpg',  'https://files.catbox.moe/cmngcg.jpg'
]
global.icono = global.iconos[Math.floor(Math.random() * global.iconos.length)]

global.wm = '❤️ SENKU BOT ❤️'
global.wm3 = '🫠 SENKU BOT 🫠'
global.author = '👑 AHMED ALIGUE ❤️'
global.dev = '© AHMED ALIGUE 👑'
global.textbot = 'SENKU BOT ❤️| AHMED ALIGUE 🧑‍💻'
global.etiqueta = '🔬SENKU BOT🧬'
global.gt = '🔬SENKU BOT🧬'
global.me = '🧬SENKU BOT🔬'

global.fkontak = { 
  key: { 
    participants: "0@s.whatsapp.net", 
    remoteJid: "status@broadcast", 
    fromMe: false, 
    id: "Halo" 
  }, 
  message: { 
    contactMessage: { 
      vcard: `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD` 
    }
  }, 
  participant: "0@s.whatsapp.net" 
}

global.rcanal = { 
  contextInfo: { 
    isForwarded: true, 
    forwardedNewsletterMessageInfo: { 
      newsletterJid: channelRD.id, 
      serverMessageId: '', 
      newsletterName: channelRD.name 
    }, 
    externalAdReply: { 
      title: global.botname, 
      body: global.dev, 
      mediaUrl: null, 
      description: null, 
      previewType: "PHOTO", 
      thumbnailUrl: global.icono,
      sourceUrl: '', 
      mediaType: 1, 
      renderLargerThumbnail: false 
    }, 
    mentionedJid: null 
  }
}

global.listo = '*تفضل ❤️🫠*'
global.moneda = 'SENKUCOINS'
global.prefix = ['.', '!', '/', '#', '%']
}

export default handler

function pickRandom(list) {
return list[Math.floor(Math.random() * list.length)]
}

async function getRandomChannel() {
let randomIndex = Math.floor(Math.random() * global.canalIdM.length)
let id = global.canalIdM[randomIndex]
let name = global.canalNombreM[randomIndex]
return { id, name }
}

if (!Array.prototype.getRandom) {
Array.prototype.getRandom = function() {
return this[Math.floor(Math.random() * this.length)]
}
}