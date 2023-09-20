let mongoose = require('mongoose')
require('dotenv').config()
let url = process.env.DATABASE_URL
mongoose.connect(url).then(() => console.log('Conect To db Bot Successfully'))
.catch((err) => err)