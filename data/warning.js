const { showDate } = require("../dates");
const { yourCityUser } = require("../models/watherModel");
let { urlData, bot } = require("./../weather");
let translate = require("@vitalets/google-translate-api");
try {
  setInterval(() => {
    yourCityUser.find({}).then((data) => {
      data.forEach((item) => {
        fetch(`${urlData.url}${item.cityName}${urlData.key}`)
          .then((res) => res.json())
          .then(async (data) => {
            let statusAirTranslate = null;
            let cityNameTranslate = null;
            try {
              statusAirTranslate = (
                await translate.translate(data.weather[0].description, {
                  to: "fa",
                })
              ).text;
              cityNameTranslate = (
                await translate.translate(data.name, { to: "fa" })
              ).text;
            } catch (e) {
              statusAirTranslate = data.weather[0].description;
              cityNameTranslate = data.name;
            }
            let dataVal = `
اطلاعات آب و هوایی شهر ${item.cityName} در 24 ساعت گذشته:\n
امروز(میلادی): ${showDate()}\n
شهر: ${cityNameTranslate}\n
کشور: ${data.sys.country}\n
وضعیت هوا: ${statusAirTranslate}\n
دما: ${data.main.temp}\n
رطوبت هوا: ${data.main.humidity}\n
فشار هوا: ${data.main.pressure}\n
سرعت باد: ${data.wind.speed}\n
درجه هوا: ${data.wind.deg}\n
تعداد ابر ها: ${data.clouds.all}\n
حداقل دما: ${data.main.temp_min}
          `;

            bot.sendMessage(item.userId, dataVal, {
              reply_markup: {
                inline_keyboard: [
                  [
                    {
                      text: "غیرفعال کردن هشدار روزانه",
                      callback_data: "inActiveWarning",
                    },
                  ],
                ],
              },
            });
          });
      });
    });
  }, 86400000);
} catch (e) {
  return e;
}
