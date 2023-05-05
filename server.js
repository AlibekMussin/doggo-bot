const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
// Введите свой токен, полученный от BotFather
const token = '***';

// Создаем экземпляр бота
const bot = new TelegramBot(token, {polling: true});

// Слушаем команду /start
bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, "Выберите ваш город:", {
      reply_markup: {
        keyboard: [
          ['Астана', 'Алматы'],          
          ['Отмена'],
        ],
        resize_keyboard: true,
        one_time_keyboard: true,
      }
    }).then(() => {
      // Добавляем обработчик для ответа на выбор категории
      bot.once('message', handleCitySelection);
    });
  
    function handleCitySelection(selectedCity) {
        const category = selectedCity.text;
        switch (category) {
          case 'Астана':            
            bot.sendMessage(msg.chat.id, "Выберите Категорию:", {
              reply_markup: {
                keyboard: [
                  ['Груминг салоны', 'Адресники', 'Врачи', 'Кинологи'],
                  ['Назад'],
                ],
                resize_keyboard: true,
                one_time_keyboard: true,
              }
            }).then(() => {
              // Добавляем обработчик для ответа на выбор категории
              bot.once('message', handleCategorySelection);
            });
            break;
    
          case 'Алматы':
            
            bot.sendMessage(msg.chat.id, "Выберите Категорию:", {
              reply_markup: {
                keyboard: [
                    ['Груминг салоны', 'Адресники', 'Врачи', 'Кинологи'],
                    ['Назад'],
                ],
                resize_keyboard: true,
                one_time_keyboard: true,
              }
            }).then(() => {
              // Добавляем обработчик для ответа на выбор категории
              bot.once('message', handleCategorySelection);
            });
            break;
          case 'Отмена':
              bot.sendMessage(msg.chat.id, "Вы отменили операцию.");
              break;
          
        }
      }

    function handleCategorySelection(selectedCategory) {
      const category = selectedCategory.text;
      switch (category) {
        case 'Груминг салоны':
          // Категория 1 выбрана, добавляем кнопки для выбора подкатегории
          fs.readFile('groomings.json', 'utf8', (err, data) => {
            if (err) {
              console.error(err);
              bot.sendMessage(msg.chat.id, "Произошла ошибка при чтении данных.");
            } else {
              const jsonData = JSON.parse(data);
              const categoryData = jsonData;
              let message = `Груминг салоны\n`;
              for (const item of categoryData) {
                message += `(${item.city}) | ${item.name}: ${item.address}\nСсылка на 2ГИС: ${item.double_gis}\n\n`;
              }
              bot.sendMessage(msg.chat.id, message);
            }});

          break;
  
        case 'Категория 2':
          // Категория 2 выбрана, добавляем кнопки для выбора подкатегории
          bot.sendMessage(msg.chat.id, "Выберите подкатегорию:", {
            reply_markup: {
              keyboard: [
                ['Подкатегория 2.1', 'Подкатегория 2.2'],
                ['Назад'],
              ],
              resize_keyboard: true,
              one_time_keyboard: true,
            }
          }).then(() => {
            // Добавляем обработчик для ответа на выбор подкатегории
            bot.once('message', handleSubcategorySelection);
          });
          break;
  
        case 'Категория 3':
          // Категория 3 выбрана, отправляем сообщение с информацией
          bot.sendMessage(msg.chat.id, "Вы выбрали Категорию 3");
          break;
  
        case 'Категория 4':
          // Категория 4 выбрана, отправляем сообщение с информацией
          bot.sendMessage(msg.chat.id, "Вы выбрали Категорию 4");
          break;
  
        case 'Отмена':
            bot.sendMessage(msg.chat.id, "Вы отменили операцию.");
            break;
        
      }
    }
});