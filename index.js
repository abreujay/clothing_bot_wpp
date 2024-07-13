const express = require('express');
const { create } = require('@open-wa/wa-automate');

const PORT = process.env.PORT || 3000;

let clientInstance;

const app = express();

app.listen(PORT, async () => {
    console.log('Servidor rodando na porta', PORT);

    clientInstance = await create();

    clientInstance.onStateChanged(async state => {
        console.log('Status do cliente:', state);

        if (state === 'CONFLICT' || state === 'UNLAUNCHED') {
            await clientInstance.forceRefocus();
        } else if (state === 'CONNECTED') {
            console.log('Cliente conectado!');
        }
    });

    clientInstance.onMessage(async message => {
        console.log('Mensagem recebida:', message.body);
        const chatId = message.from;
        const command = message.body.toLowerCase().trim();

        switch (command) {
            case 'oi':
            case 'olá':
            case 'bom dia':
            case 'boa tarde':
            case 'boa noite':
                await sendTextMessage(chatId, 'Olá, bom dia! Em que posso ajudar? \n\n' +
                                              '1. Dúvidas\n' +
                                              '2. Peças disponíveis\n' +
                                              '3. Outros');
                break;

            case '1':
            case 'dúvidas':
            case 'duvidas':
                await sendTextMessage(chatId, 'Aguarde um momento, já iremos atender você! Enquanto isso, conte-nos sobre sua dúvida. :)');
                break;

            case '2':
            case 'peças disponíveis':
            case 'peças disponiveis':
                await sendTextMessage(chatId, 'Você pode verificar nosso estoque através do nosso site, clicando no link abaixo:\n' +
                                              'sitexemplo.com');
                break;

            case '3':
            case 'outros':
                await sendTextMessage(chatId, 'Em breve entraremos em contato com você! Enquanto isso, nos fale um pouco sobre sua dúvida ou problema...');
                break;
        }
    });
});

async function sendTextMessage(chatId, message) {
    try {
        await clientInstance.sendText(chatId, message);
        console.log('Resposta enviada:', message);
    } catch (error) {
        console.error('Ocorreu um erro ao enviar a resposta...', error);
    }
}
