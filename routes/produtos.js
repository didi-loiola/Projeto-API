const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;

router.get('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            'select * from produtos;',
            (error, resultado, fields) => {
                if (error) { return res.status(500).send({ error: error }) }
                return res.status(200).send({ response: resultado })
            }
        )
    })

})

router.post('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        conn.query(
            'INSERT INTO produtos(nome, preco) values (?,?)', [req.body.nome, req.body.preco],
            (error, resultado, field) => {
                conn.release();

                if (error) {
                    return res.status(500).send({
                        error: error,
                        response: null
                    })
                }
                res.status(201).send({
                    messagem: 'Produto inserido com sucesso',
                    id_produto: resultado.insertId
                })
            }
        )
    })
})

router.get('/:id_produto', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            'select * from produtos where id_produtos=?;', [req.params.id_produto],
            (error, resultado, fields) => {
                if (error) { return res.status(500).send({ error: error }) }
                return res.status(200).send({ response: resultado })
            }
        )
    })
})

router.delete('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        conn.query(
            `delete from produtos where id_produtos= ?`, [req.body.id_produto],
            (error, resultado, field) => {
                conn.release();

                if (error) {
                    return res.status(500).send({
                        error: error,
                        response: null
                    })
                }
                res.status(201).send({
                    messagem: 'Produto removido com sucesso',
                })
            }
        )
    })
})

router.patch('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        conn.query(
            `update produtos
                set nome=?,
                    preco=?
            where   id_produtos= ?`, [
                req.body.nome,
                req.body.preco,
                req.body.id_produto
            ],
            (error, resultado, field) => {
                conn.release();

                if (error) {
                    return res.status(500).send({
                        error: error,
                        response: null
                    })
                }
                res.status(202).send({
                    messagem: 'Produto atualizado com sucesso',
                })
            }
        )
    })
})

module.exports = router;