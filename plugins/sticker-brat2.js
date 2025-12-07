import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const axios = require('axios');

let handler = async (m, { conn, text, usedPrefix, command }) => {
    //Fixieada por ZzawX
    
    try {
        await m.react('🕒');

        if (!text) {
            await m.react('❔');
            return conn.reply(m.chat, 
                '> `❌ TEXTO FALTANTE`\n\n' +
                '> `📝 Debes escribir texto después del comando`\n\n' +
                '> `💡 Ejemplo:` *' + usedPrefix + command + ' texto aquí*', 
                m
            );
        }

        const username = m.pushName || m.sender.split('@')[0] || "Usuario";
        
        // API principal para sticker animado
        const primaryApiUrl = `https://apizell.web.id/tools/bratanimate?q=${encodeURIComponent(text)}`;
        
        // API secundaria como fallback
        const fallbackApiUrl = `https://api.siputzx.my.id/api/m/bratvideo?text=${encodeURIComponent(text)}`;

        try {
            // Intentar con API principal primero
            const response = await axios({
                method: 'GET',
                url: primaryApiUrl,
                responseType: 'arraybuffer',
                timeout: 15000,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                }
            });

            if (!response.data || response.data.length < 100) {
                throw new Error('API principal devolvió datos inválidos');
            }

            await m.react('✅️');
            
            // Crear sticker con metadata
            const stickerBuffer = Buffer.from(response.data);
            
            // Enviar sticker directamente (sin conversión complicada)
            await conn.sendMessage(m.chat, {
                sticker: stickerBuffer,
                contextInfo: {
                    externalAdReply: {
                        title: `𝗦𝗼𝗹𝗶𝗰𝗶𝘁𝗮𝗱𝗼 𝗽𝗼𝗿: ${username}`,
                        body: `𝗖𝗿𝗲𝗮𝗱𝗼𝗿: 𝗟𝗲𝗼𝗗𝗲𝘃`,
                        thumbnail: await (await conn.getFile('https://files.catbox.moe/yxcu1g.png')).data
                    }
                }
            }, { quoted: m });

        } catch (primaryError) {
            console.log('API principal falló, intentando con secundaria...');
            
            try {
                // Intentar con API secundaria
                const fallbackResponse = await axios({
                    method: 'GET',
                    url: fallbackApiUrl,
                    responseType: 'arraybuffer',
                    timeout: 15000,
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                    }
                });

                if (!fallbackResponse.data || fallbackResponse.data.length < 100) {
                    throw new Error('API secundaria devolvió datos inválidos');
                }

                await m.react('✅️');
                
                const stickerBuffer = Buffer.from(fallbackResponse.data);
                
                await conn.sendMessage(m.chat, {
                    sticker: stickerBuffer,
                    contextInfo: {
                        externalAdReply: {
                            title: `𝗦𝗼𝗹𝗶𝗰𝗶𝘁𝗮𝗱𝗼 𝗽𝗼𝗿: ${username}`,
                            body: `𝗖𝗿𝗲𝗮𝗱𝗼𝗿: 𝗟𝗲𝗼𝗗𝗲𝘃`,
                            thumbnail: await (await conn.getFile('https://files.catbox.moe/yxcu1g.png')).data
                        }
                    }
                }, { quoted: m });

            } catch (fallbackError) {
                throw new Error(`Ambas APIs fallaron`);
            }
        }

    } catch (error) {
        console.error('Error en comando brat2:', error);
        
        await m.react('❌');
        
        let errorMessage = '> `❌ ERROR ENCONTRADO`\n\n';
        
        if (error.message.includes('Ambas APIs fallaron')) {
            errorMessage += '> `📝 Todos los servicios están temporalmente no disponibles. Intenta más tarde.`';
        } else if (error.code === 'ECONNABORTED') {
            errorMessage += '> `⏰ Tiempo de espera agotado. Intenta de nuevo.`';
        } else if (error.response) {
            errorMessage += '> `📝 Error en la API: ' + error.response.status + '`';
        } else if (error.request) {
            errorMessage += '> `📝 No se pudo conectar con el servicio.`';
        } else {
            errorMessage += '> `📝 ' + error.message + '`';
        }

        await conn.reply(m.chat, errorMessage, m);
    }
};

handler.help = ['brat2'];
handler.tags = ['sticker'];
handler.command = ['brat2'];
handler.group = true;

export default handler;