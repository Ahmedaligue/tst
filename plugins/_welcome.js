// _welcome.js

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Ruta a la carpeta de assets (donde guardarás las imágenes)
const assetsPath = path.join(__dirname, '../assets')

// Función para asegurarse de que la carpeta de assets exista
const ensureAssetsDir = () => {
    if (!fs.existsSync(assetsPath)) {
        fs.mkdirSync(assetsPath, { recursive: true })
    }
}

// Función para obtener la ruta de la imagen de bienvenida
const getWelcomeImagePath = (chatId) => {
    ensureAssetsDir()
    return path.join(assetsPath, `welcome_${chatId}.jpg`)
}

// Función para obtener la ruta de la imagen de despedida
const getByeImagePath = (chatId) => {
    ensureAssetsDir()
    return path.join(assetsPath, `bye_${chatId}.jpg`)
}

// Función para formatear el número de miembro
const formatMemberNumber = (num) => {
    if (num % 100 >= 11 && num % 100 <= 13) {
        return `${num}th`
    }
    switch (num % 10) {
        case 1: return `${num}st`
        case 2: return `${num}nd`
        case 3: return `${num}rd`
        default: return `${num}th`
    }
}

let handler = async (m, { conn }) => {
    // Verificar si el mensaje es de un nuevo miembro
    if (!m.messageStubType) return
    
    const chatId = m.chat
    const chat = global.db.data.chats[chatId] || {}
    const groupMetadata = await conn.groupMetadata(chatId)
    const groupName = groupMetadata.subject
    const groupDesc = groupMetadata.desc?.toString() || 'Sin descripción'
    const groupMembersCount = groupMetadata.participants.length
    
    // Mensaje de bienvenida
    if (m.messageStubType === 27) { // 27 es el código para "nuevo miembro"
        const user = m.messageStubParameters[0] + '@s.whatsapp.net'
        const userName = conn.getName(user)
        const memberNumber = formatMemberNumber(groupMembersCount)
        
        // Mensaje de bienvenida personalizado o por defecto
        let welcomeMessage = chat.welcomeMessage || 
            `╭─「 ✨ *BIENVENIDO/A* ✨ 」\n` +
            `│\n` +
            `│ 👋 ¡Hola, @${user.split('@')[0]}!\n` +
            `│\n` +
            `│ 📝 *Nombre:* ${userName}\n` +
            `│ 🏷️ *Usuario:* @${user.split('@')[0]}\n` +
            `│ 🔢 *Eres el:* ${memberNumber} miembro\n` +
            `│ 👥 *Total de miembros:* ${groupMembersCount}\n` +
            `│ 📋 *Grupo:* ${groupName}\n` +
            `│ 🆔 *ID del grupo:* ${chatId}\n` +
            `│\n` +
            `│ ${groupDesc}\n` +
            `│\n` +
            `╰─◉`
        
        // Enviar mensaje con mención al usuario
        await conn.sendMessage(chatId, { 
            text: welcomeMessage, 
            mentions: [user] 
        }, { quoted: m })
        
        // Enviar imagen de bienvenida personalizada o por defecto
        const welcomeImagePath = getWelcomeImagePath(chatId)
        if (fs.existsSync(welcomeImagePath)) {
            await conn.sendMessage(chatId, { 
                image: fs.readFileSync(welcomeImagePath), 
                caption: '¡Bienvenido/a al grupo!' 
            }, { quoted: m })
        }
    }
    
    // Mensaje de despedida
    if (m.messageStubType === 28) { // 28 es el código para "miembro abandonó el grupo"
        const user = m.messageStubParameters[0] + '@s.whatsapp.net'
        const userName = conn.getName(user)
        const memberNumber = formatMemberNumber(groupMembersCount)
        
        // Mensaje de despedida personalizado o por defecto
        let byeMessage = chat.byeMessage || 
            `╭─「 👋 *DESPEDIDA* 👋 」\n` +
            `│\n` +
            `│ 👋 @${user.split('@')[0]} ha abandonado el grupo\n` +
            `│\n` +
            `│ 📝 *Nombre:* ${userName}\n` +
            `│ 🏷️ *Usuario:* @${user.split('@')[0]}\n` +
            `│ 🔢 *Era el:* ${memberNumber} miembro\n` +
            `│ 👥 *Ahora hay:* ${groupMembersCount} miembros\n` +
            `│ 📋 *Grupo:* ${groupName}\n` +
            `│ 🆔 *ID del grupo:* ${chatId}\n` +
            `│\n` +
            `╰─◉`
        
        // Enviar mensaje con mención al usuario
        await conn.sendMessage(chatId, { 
            text: byeMessage, 
            mentions: [user] 
        }, { quoted: m })
        
        // Enviar imagen de despedida personalizada o por defecto
        const byeImagePath = getByeImagePath(chatId)
        if (fs.existsSync(byeImagePath)) {
            await conn.sendMessage(chatId, { 
                image: fs.readFileSync(byeImagePath), 
                caption: '¡Hasta pronto!' 
            }, { quoted: m })
        }
    }
}

export default handler
