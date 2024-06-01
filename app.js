const express = require('express')
const app = express()
const cors = require('cors');
// const db = require('./src/config/db')
const route = require('./src/routes/api')

app.use("/mp3/",express.static('src/resources/mp3/'));
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors({
    origin: '*',
    credentials: true
}));

route(app)


app.listen(3000, () => {
    console.log(`Server is running on port 3000`);
});