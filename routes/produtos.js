const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.status(200).send({
        messagem: 'Usando GET na rota de produtos'
    })
})

router.post('/', (req, res, next) => {
    const produto = {
        nome: req.body.nome,
        preco: req.body.preco
    }
    res.status(201).send({
        messagem: 'Usando POST na rota de produtos',
        produtoCriado: produto
    })
})

router.get('/:id_produto', (req, res, next) => {
    const id = req.params.id_produto
    if (id === 'especial') {
        res.status(200).send({
            messagem: 'Você descobriu o id especial',
            id: id
        })
    } else {
        res.status(200).send({
            messagem: 'Você passou um id'
        })
    }
})

router.delete('/', (req, res, next) => {
    res.status(200).send({
        messagem: 'Usando DELETE na rota de produtos'
    })
})

router.patch('/', (req, res, next) => {
    res.status(200).send({
        messagem: 'Usando PATCH na rota de produtos'
    })
})

module.exports = router;