import fs from 'fs'
import acrcloud from 'acrcloud'

let handler = async (m, { usedPrefix, command, conn, text }) => {
    // Configuración del token
    let acr = new acrcloud({
        host: 'identify-eu-west-1.acrcloud.com',
        access_key: 'c33c767d683f78bd17d4bd4991955d81',
        access_secret: 'bvgaIAEtADBTbLwiPGYlxupWqkNGIjT7J9Ag2vIu'
    })

    // Verificar si hay un mensaje citado
    if (!m.quoted) {
        m.reply(`> ⚠️ Responde a un *audio o video* con el comando *${command}*`)
        try {
            await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
        } catch (e) {
            console.log('Error al enviar reacción:', e)
        }
        return
    }

    let q = m.quoted
    let mime = q.mimetype || ''
    
    if (/audio|video/.test(mime)) {
        try {
            // Mostrar mensaje de espera
            m.reply('🔍 *Buscando información de la canción...*')
            
            // Descargar el archivo
            let media = await q.download()
            let ext = mime.split('/')[1]
            let filename = `./tmp/${Date.now()}_${m.sender}.${ext}`
            
            // Guardar temporalmente
            fs.writeFileSync(filename, media)
            
            // Identificar la canción
            let res = await acr.identify(fs.readFileSync(filename))
            
            let { code, msg } = res.status
            if (code !== 0) {
                fs.unlinkSync(filename)
                m.reply('> ❌ No se encontró ninguna canción. Intenta con otro audio.')
                await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
                return
            }

            let { title, artists, album, genres, release_date } = res.metadata.music[0]

            let txt = `*🎵 IDENTIFICADOR DE MÚSICA 🎵*

🎶 *Título:* ${title}
👨‍🎤 *Artista(s):* ${artists ? artists.map(v => v.name).join(', ') : 'Desconocido'}
💿 *Álbum:* ${album?.name || 'Desconocido'}
🎼 *Género:* ${genres ? genres.map(v => v.name).join(', ') : 'Desconocido'}
📅 *Fecha de lanzamiento:* ${release_date || 'Desconocido'}

🎧 *Identificado con éxito!*`.trim()

            // Limpiar archivo temporal
            fs.unlinkSync(filename)
            
            // Enviar resultado
            m.reply(txt)
            
            // Agregar reacción de emoji
            try {
                await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
            } catch (e) {
                console.log('Error al enviar reacción:', e)
            }

        } catch (error) {
            console.error('Error en whatmusic:', error)
            m.reply('> ❌ Error al procesar el audio/video. Intenta de nuevo.')
            try {
                await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
            } catch (e) {
                console.log('Error al enviar reacción:', e)
            }
        }
    } else {
        m.reply(`> ⚠️ Responde a un *audio o video* con el comando *${command}*`)
        try {
            await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
        } catch (e) {
            console.log('Error al enviar reacción:', e)
        }
    }
}

handler.help = ['whatmusic']
handler.tags = ['tools']
handler.command = /^(whatmusic|shazam|music)$/i

export default handler