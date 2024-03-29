const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const https = require('https');

const token = process.env.BOT_TOKEN;
const bot = new TelegramBot(token, {polling: true});
const webAppUrl = process.env.APP_URL;
const notifChatId = process.env.NOTIFICATIONS_CHAT_ID;

const app = express();
const urlTg = `https://api.telegram.org/bot${token}/sendMessage`;

const agent = new https.Agent({
  rejectUnauthorized: false  // Отключение проверки сертификата SSL
});

app.use(express.json());
app.use(cors());

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;
  if (text == '/start')
  {
    await bot.sendMessage(chatId, 'Нажмите на кнопку Каталог товаров и выберите товары, которые вам нужны', );    
  }
});

app.post('/make-order', async (req, res) => {  
  console.log(req.body);
  const { last_name, first_name, phone_number, queryId, order , products} = req.body;
  console.log(queryId);
  console.log('products', products);
  let commonTotal = 0;
  
  const message_products = products.map((product) => {
    let totalOne = product.attributes.price * product.quantity;
    commonTotal += totalOne;
    return `${product.attributes.title}, стоимость (1 шт): ${product.attributes.price} тнг., количество: ${product.quantity}. Общая стоимость: ${totalOne}`;
  }).join('\n');
  const title = 'Вы успешно совершили заказ в нашем магазине. Наш менеджер в ближайшее время свяжется с вами\n\nНомер вашего заказа: '+order;
  const text = '';
  
  try {
    const message_text = title+'\n\nВы приобретаете:\n'+message_products+'\n\nОбщая стоимость: '+commonTotal+' тнг\n\n'+text;
      await bot.answerWebAppQuery(queryId, {
          type: 'article',
          id: queryId,
          title: 'Успешная покупка',
          input_message_content: {
              message_text: message_text
          }
      });
      
      const customer_data = 'Данные покупателя: \nФамилия: <b>'+last_name+'</b>\nИмя: <b>'+first_name+'</b>\nТелефон: <b>'+phone_number+'</b>';
      const notificationText = 'Внимание! Новый заказ <b>'+order+'</b>:\n\n'+message_products+'\n\nОбщая стоимость: '+commonTotal+' тнг\n\n'+customer_data;
      console.log("notificationText", notificationText);
      const params = { chat_id: notifChatId, text: notificationText, parse_mode: 'HTML'};  
      console.log(params);      
      axios.post(urlTg, null, { params, httpsAgent: agent })
      .then((response) => {
        console.log('Сообщение успешно отправлено!');
      })
      .catch((error) => {
        console.error('Произошла ошибка при отправке сообщения:', error);
      });

      return res.status(200).json({});
  } catch (e) {
    console.error(e);
    return res.status(500).json({})
  }
})

const PORT = process.env.APP_PORT;

app.listen(PORT, () => console.log('server started on PORT ' + PORT))