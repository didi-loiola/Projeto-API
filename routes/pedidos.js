const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;
const pedidos = require('../controllers/pedidos');
const login = require('../middleware/login');

router.get('/', pedidos.getPedidos);
router.post('/', pedidos.postPedidos);
router.get('/:id_pedido', pedidos.getPedidoUnico);
router.delete('/', pedidos.deletePedido);

router.post('/:id_pedido/pix/cobranca', pedidos.oAuth, pedidos.cobrancaPix, pedidos.getQrCode);

module.exports = router;