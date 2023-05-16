const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();
const express = require('express');
const cors = require('cors');

const token = process.env.BOT_TOKEN;
const bot = new TelegramBot(token, {polling: true});
const webAppUrl = process.env.APP_URL;
const app = express();


app.use(express.json());
app.use(cors())
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (text == '/start')
  {
    await bot.sendMessage(chatId, 'Заполните форму ниже', {
      
      reply_markup:{
        keyboard: [
          [{text: "Заполнить форму", web_app:{
            url: webAppUrl + '/form'}}]
        ]
      }
    });

    await bot.sendMessage(chatId, 'Нажмите на кнопку Меню и выберите раздел, который вам нужен', {
      reply_markup:{
        inline_keyboard: [
          [{text: "Меню", web_app:{url: webAppUrl }}]
        ]
      }
    });    
  }

  console.log('1111');
    console.log(msg);

    if (msg?.web_app_data?.data)
    {
      try {
        const data = JSON.parse(msg?.web_app_data?.data);
        console.log(data);
        await bot.sendMessage(chatId, 'Data accepted: ' + data?.country+ ', '+ data?.street+ ', '+ data?.subject);
        setTimeout(async()=>{
          await bot.sendMessage(chatId, 'Инфа в этом чате будет')
        }, 3000);

      }
      catch (e){
        console.log(e);

      }
      
    }
});

app.post('/web-data', async (req, res) =>  {
  const {queryId, products, totalPrice} = req.body;
  try {
    await bot.answerWebAppQuery(queryId, {
      type: 'article',
      id: queryId,
      title: 'Успешная покупка',
      input_message_content:{
        message_text:"Заказ на сумму "+ totalPrice + "тнг успешно создан. Ожидайте звонка менеджера"
      }
    });
    return res.status(200).json({});
    
  } catch (error) {
    await bot.answerWebAppQuery(queryId, {
      type: 'article',
      id: queryId,
      title: 'Не удалось сделать заказ',
      input_message_content:{
        message_text:error
      }
    })
    return res.status(500).json({});
  }
  
});

const PORT = 8009; 
app.listen(PORT, ()=>console.log('server started, bitcheeeees. PORT: ' + PORT));