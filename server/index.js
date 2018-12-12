require('dotenv').config();
const express = require('express');
const graphqlHTTP = require('express-graphql');
const mongoose = require('mongoose');

const schema = require('./schema/schema');
const app = express();
const port = 8080;

mongoose.connect(
    process.env.DB_HOST,
    { useNewUrlParser: true },
);
mongoose.connection.once('open', () => {
    console.log('connected to mlab');
});

app.use(
    '/graphql',
    graphqlHTTP({
        schema,
        graphiql: true,
    }),
);

app.listen(port, () => {
    console.log(`listening for requests on ${port}`);
});
