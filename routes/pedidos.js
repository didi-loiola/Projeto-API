const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;
const pedidos = require('../controllers/pedidos');

router.get('/', pedidos.getPedidos);
router.post('/', pedidos.postPedidos);
router.get('/:id_pedido', pedidos.getPedidoUnico);
router.delete('/', pedidos.deletePedido);

module.exports = router;