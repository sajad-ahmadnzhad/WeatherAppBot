function showDate() {
  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  let now = new Date();

  let day = days[now.getDay()];
  let month = months[now.getMonth()];
  let year = now.getFullYear();
  let date = now.getDate();

  return `${day} ${date} ${month} ${year}`;
}

let reply_markupWeather = {
  reply_markup: {
    inline_keyboard: [
      [
        { text: "شهر", callback_data: "city" },
        { text: "کشور", callback_data: "country" },
        { text: "وضعیت هوا", callback_data: "statusAir" },
      ],
      [
        { text: "دما", callback_data: "temp" },
        { text: "حداقل دما", callback_data: "minTemp" },
        { text: "رطوبت هوا", callback_data: "humidity" },
      ],
      [
        { text: "فشار هوا", callback_data: "pressure" },
        { text: "سرعت باد", callback_data: "speed" },
        { text: "درجه هوا", callback_data: "deg" },
      ],
      [
        { text: "دریافت کل وضعیت", callback_data: "totalStatus" },
        { text: "تعداد ابر ها", callback_data: "clouds" },
      ],
      [
        {text: 'می توان به این شهر سفر کرد؟' , callback_data: 'travel'}
      ]
    ],
  },
};

let statusAllWeather = (cityNameTranslate , findWeatherData , statusAirTranslate) => {
   return`
  امروز(میلادی): ${showDate()}\n
  شهر: ${cityNameTranslate}\n
  کشور: ${findWeatherData.countryName}\n
  وضعیت هوا: ${statusAirTranslate}\n
  دما: ${findWeatherData.temp}\n
  رطوبت هوا: ${findWeatherData.humidity}\n
  فشار هوا: ${findWeatherData.pressure}\n
  سرعت باد: ${findWeatherData.speed}\n
  درجه هوا: ${findWeatherData.deg}\n
  تعداد ابر ها: ${findWeatherData.clouds}\n
  ${findWeatherData.minTemp} :حداقل دما
  `
}

module.exports = {showDate , reply_markupWeather , statusAllWeather};
