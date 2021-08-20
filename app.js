const express = require('express');
const app = express();

const rotaProduto = require('./routes/produtos');
const rotaPedidos = require('./routes/pedidos');

app.use('/produtos', rotaProduto);
app.use('/pedidos', rotaPedidos);

module.exports = app