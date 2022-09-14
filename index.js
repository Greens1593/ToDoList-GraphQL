const express = require('express');
const path = require('path');
const {graphqlHTTP} = require('express-graphql')
const app = express();

const schema = require('./graphql/schema.js')
const resolver = require('./graphql/resolver.js')
const sequelize = require('./utils/dataBase');

const PORT = process.env.port || 3000;

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json())
app.use(graphqlHTTP({
    schema: schema,
    rootValue: resolver,
    graphiql: true, 
}))


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