const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.status(200).send({
        messagem: 'Retorna os pedidos'
    })
})

router.post('/', (req, res, next) => {
    const pedido = {
        id_produto: req.body.id_produto,
        quantidade: req.body.quantidade
    }
    res.status(201).send({
        messagem: 'O pedido foi criado',
        pedidoCriado: pedido
    })
})

router.get('/:id_pedido', (req, res, next) => {
    const id = req.params.id_pedido
    res.status(200).send({
        messagem: 'Detalhes do pedido',
        id_pedido: id
    })
})

router.delete('/', (req, res, next) => {
    res.status(200).send({
        messagem: 'Pedido excluído'
    })
})


module.exports = router;