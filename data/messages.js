let textCommandYourCity = `شهر خود را وارد نمایید
در این قسمت اطلاعات روزانه آب و هوای شهر شما بعد از 24 ساعت اطلاع داده می شود
توجه داشته باشید که بعد از شهر خود از ایموجی ✅ استفاده کنید تا شهر شما ثبت شود
`;

let textCommandStart = (message) => {
return`کاربر ${message.from.first_name} به ربات سامانه آب و هوایی خوش آمدید 
جهت دریافت وضعیت آب و هوا لطفا اسم شهر تان را وارد نمایید
⚠️اگر احیاناٌ شهر مورد نظر شما به فارسی پیدا نشد لطفا اسم آن را به انگلیسی وارد کنید

جهت تنظیم شهر خود دستور /yourcity را ارسال نمایید
`;
}
module.exports = { textCommandYourCity , textCommandStart};
