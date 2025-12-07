import ws from 'ws';

const handler = async (m, { conn }) => {
  // --- VERIFICACIONES DE SEGURIDAD ---
  // 1. Asegurarse de que la base de datos del chat exista.
  if (!global.db?.data?.chats?.[m.chat]) {
    return conn.reply(m.chat, `> ⚠︎ Error: La configuración de este grupo no está disponible.`, m);
  }
  const chat = global.db.data.chats[m.chat];

  // --- LÓGICA PRINCIPAL (ahora es segura gracias a la inicialización en index.js) ---
  const subBots = [...new Set([
    ...global.conns.filter((conn) => conn?.user && conn?.ws?.socket && conn.ws.socket.readyState !== ws.CLOSED)
      .map((conn) => conn.user.jid)
  ])];

  if (global.conn?.user?.jid && !subBots.includes(global.conn.user.jid)) {
    subBots.push(global.conn.user.jid);
  }

  const mentionedJid = await m.mentionedJid;
  const who = mentionedJid[0] ? mentionedJid[0] : m.quoted ? await m.quoted.sender : false;

  if (!who) return conn.reply(m.chat, `> Por favor, menciona a un Socket para hacerlo Bot principal del grupo.`, m);
  if (!subBots.includes(who)) return conn.reply(m.chat, `> El usuario mencionado no es un Socket de: *${botname}*.`, m);
  if (chat.primaryBot === who) {
    return conn.reply(m.chat, `> ☕️ @${who.split`@`[0]} ya esta como Bot primario en este grupo.`, m, { mentions: [who] });
  }

  try {
    chat.primaryBot = who;
    conn.reply(m.chat, `> ✅️ Se ha establecido a @${who.split`@`[0]} como Bot primario de este grupo.\n> Ahora todos los comandos de este grupo serán ejecutados por @${who.split`@`[0]}.`, m, { mentions: [who] });
  } catch (e) {
    console.error(e); // Muestra el error completo en la consola
    conn.reply(m.chat, `> ⚠︎ Se ha producido un problema.\n> Usa *${usedPrefix}report* para informarlo.\n\n${e.message}`, m);
  }
};

handler.help = ['setprimary'];
handler.tags = ['serbot'];
handler.command = ['setprimary'];
handler.group = true;
handler.admin = true;

export default handler;