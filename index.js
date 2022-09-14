const express = require('express');
const path = require('path');
const app = express();

const todoRoutes = require('./routes/todo')
const sequelize = require('./utils/dataBase')

const PORT = process.env.port || 3000;

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json())

app.use('/api/todo', todoRoutes)

app.use((req, res, next) => {
    res.sendFile(__dirname + '/public/index.html')
});

async function start () {
    try{
        await sequelize.sync()
        await app.listen(PORT)
        console.log('Server was start in port:', PORT)
    } catch (e) {
        console.log(e)
    }
}

start()