const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();
const express = require('express');
const cors = require('cors');

const token = process.env.BOT_TOKEN;
const bot = new TelegramBot(token, {polling: true});
const webAppUrl = process.env.APP_URL;

const app = express();

app.use(express.json());
app.use(cors());

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (text == '/start')
  {
    await bot.sendMessage(chatId, 'Нажмите на кнопку Каталог товаров и выберите товары, которые вам нужны', {
      reply_markup:{
        inline_keyboard: [
          [{text: "Каталог товаров", web_app:{url: webAppUrl }}]
        ]
      }
    });    
  }
});

app.post('/make-order', async (req, res) => {  
  console.log(req.body);
  const {queryId, order } = req.body;
  console.log(queryId);
  console.log('products', products);
  
  const message_products = products.map((product) => {
    return `${product.attributes.title}, стоимость: ${product.attributes.price} тнг.`;
  }).join('\n');
  const title = 'Вы успешно совершили заказ в нашем магазине. Наш менеджер в ближайшее время свжяется с вами\n\nНомер вашего заказа: '+order;
  const text = '';
  
  try {
    const message_text = title+'\n\nВы приобретаете:\n'+message_products+'\n\n'+text;
      await bot.answerWebAppQuery(queryId, {
          type: 'article',
          id: queryId,
          title: 'Успешная покупка',
          input_message_content: {
              message_text: message_text
          }
      })
      return res.status(200).json({});
  } catch (e) {
    console.error(e);
    return res.status(500).json({})
  }
})

const PORT = process.env.APP_PORT;

app.listen(PORT, () => console.log('server started on PORT ' + PORT))