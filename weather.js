let telegrambot = require("node-telegram-bot-api");
const { reply_markupWeather, statusAllWeather } = require("./dates");
const { weatherApp, yourCityUser } = require("./models/watherModel");
require('dotenv').config()
let token = process.env.BOT_TOKEN;
let bot = new telegrambot(token, { polling: true });
let translate = require("@vitalets/google-translate-api");
const { arrayStatusAir } = require("./data/statusAir");
const { textCommandYourCity, textCommandStart } = require("./data/messages");
require("../weatherApp/configs/db");
let urlData = {
  url: "https://api.openweathermap.org/data/2.5/weather?q=",
  key: process.env.KEY_URL_API,
};
module.exports = {
  urlData,
  bot,
};
require("./data/warning");
require("./data/statusAir");
bot.on("message", async (message) => {
  console.log(message);
  let id = message.from.id;
  if (!message.text) return;

  bot.sendChatAction(id, "typing");
  if (message.text == "/start") {
    return bot.sendMessage(
      id, textCommandStart(message)
    );
  }

  if (message.text == "/yourcity") {
    bot.sendMessage(id, textCommandYourCity);
    return;
  }

  let re = /✅/g;

  if (message.text && message.text.match(re)) {
    let rejexVal = message.text.replace(/✅/g, "");
    fetch(`${urlData.url}${rejexVal}${urlData.key}`).then(async (res) => {
      if (res.status == 200) {
        let text = `کاربر ${message.from.first_name} از این لحظه به بعد اطلاعات آب و هوایی شهر "${rejexVal}" بصورت روزانه به شما نمایش داده خواهد شد.`;

        let dataFindUserID = await yourCityUser.findOne({ userId: id });
        if (!dataFindUserID) {
          bot.sendMessage(id, text);
          yourCityUser.create({
            userId: id,
            fristName: message.from.first_name,
            userName: message.from.username,
            cityName: rejexVal,
          });
        } else if (dataFindUserID) {
          let text = `کاربر  ${message.from.first_name} شما از قبل شهر ${dataFindUserID.cityName} را بعنوان شهر پیشفرض خود قرار داده اید`;
          bot.sendMessage(id, text, {
            reply_markup: {
              inline_keyboard: [
                [{ text: "تغییر شهر", callback_data: "changeCity" }],
              ],
            },
          });
          return;
        }
      } else {
        bot.sendMessage(
          id,
          `شهر ${rejexVal} اشتباه می باشد لطفا نام درست را وارد نمایید`
        );
      }
    });

    return;
  }

  let msg = message.text?.toLocaleLowerCase();

  let weatherData = await fetch(`${urlData.url}${msg}${urlData.key}`)
    .then((res) => res.json())
    .then(async (data) => {
      if (!data.name) {
        return false;
      }
      await weatherApp.deleteOne({ userId: id });
      let findDatas = await weatherApp.findOne({
        cityName: data.name,
        userId: id,
      });

      if (!findDatas) {
        await weatherApp.create({
          cityName: data.name,
          countryName: data.sys.country,
          statusAir: data.weather[0].description,
          temp: Math.floor(data.main.temp - 273.15) + "°c",
          minTemp: `${Math.floor(
            data.main.temp_max - 273.15
          )} °c / ${Math.floor(data.main.temp_min - 273.15)} °c`,
          humidity: data.main.humidity,
          pressure: data.main.pressure,
          speed: data.wind.speed,
          deg: data.wind.deg,
          clouds: data.clouds.all,
          statusAirMain: data.weather[0].main.toLocaleLowerCase(),
          userId: id,
        });
      }
      return data;
    });
  if (!weatherData) {
    return bot.sendMessage(id, "نام شهر وارد شده اشتباه می باشد");
  }

  bot.sendMessage(id, "وضعیت مورد نظر را انتخاب کنید:", reply_markupWeather);
});

bot.on("callback_query", async (ctx) => {
  bot.answerCallbackQuery(ctx.id);
  bot.sendChatAction(ctx.from.id, "typing");
  let data = ctx.data;
  let id = ctx.from.id;

  if (ctx.data == "changeCity") {
    bot.deleteMessage(id, ctx.message.message_id);
    bot.sendMessage(ctx.from.id, "شهر خود را وارد نمایید");
    await yourCityUser.deleteOne({ userId: id });
    return;
  }
  let findWeatherData = await weatherApp.findOne({ userId: id });
  let statusAirTranslate = null;
  let cityNameTranslate = null;
  try {
    statusAirTranslate = (
      await translate.translate(findWeatherData.statusAir, { to: "fa" })
    ).text;
    cityNameTranslate = (
      await translate.translate(findWeatherData.cityName, { to: "fa" })
    ).text;
  } catch (e) {
    statusAirTranslate = findWeatherData.statusAir;
    cityNameTranslate = findWeatherData.cityName;
  }
  if (findWeatherData) {
    if (data == "city") {
      bot.sendMessage(id, `نام شهر انتخاب شده: ${cityNameTranslate}`);
    } else if (data == "country") {
      bot.sendMessage(
        id,
        `کشور انتخاب شده توسط شما: ${findWeatherData.countryName}`
      );
    } else if (data == "statusAir") {
      bot.sendMessage(id, `وضعیت هوا:\n${statusAirTranslate}`);
    } else if (data == "temp") {
      bot.sendMessage(id, `دما:\n ${findWeatherData.temp}`);
    } else if (data == "minTemp") {
      bot.sendMessage(id, `حداقل دما:\n${findWeatherData.minTemp}`);
    } else if (data == "humidity") {
      bot.sendMessage(id, `رطوبت هوا: ${findWeatherData.humidity}`);
    } else if (data == "pressure") {
      bot.sendMessage(id, `فشار هوا: ${findWeatherData.pressure}`);
    } else if (data == "speed") {
      bot.sendMessage(id, `سرعت باد: ${findWeatherData.speed}`);
    } else if (data == "deg") {
      bot.sendMessage(id, `درجه هوا: ${findWeatherData.deg}`);
    } else if (data == "clouds") {
      bot.sendMessage(id, `تعداد ابر ها: ${findWeatherData.clouds}`);
    } else if (data == "totalStatus") {
      bot.sendMessage(
        id,
        statusAllWeather(cityNameTranslate, findWeatherData, statusAirTranslate)
      );
    }
  }
  if (data == "inActiveWarning") {
    bot.deleteMessage(id, ctx.message.message_id);
    await yourCityUser.deleteOne({ userId: id });
    let text =
      "هشدار روزانه غیرفعال شد جهت فعال سازی مجدد دستور /yourcity را ارسال نمایید";
    bot.sendMessage(id, text);
  }
  if (data == "travel") {
    let airMain = findWeatherData.statusAirMain;

    arrayStatusAir.forEach((item) => {
      if (item[0].split(" ")[0] == airMain) {
        let validateData = item[0].replace(airMain, "").trim()
        bot.sendMessage(id , validateData)
      }
    });

  }
});
