const mysql = require('../mysql');

exports.getPedidos = async(req, res, next) => {
    try {
        const result = await mysql.execute(
            `SELECT pedidos.id_pedidos,
                    pedidos.quantidade,
                    produtos.id_produtos,
                    produtos.nome,
                    produtos.preco
               FROM pedidos
         INNER JOIN produtos
                ON  produtos.id_produtos = pedidos.id_produtos`);
        const response = {
            pedidos: result.map(pedido => {
                return {
                    id_pedido: pedido.id_pedidos,
                    quantidade: pedido.quantidade,
                    produto: {
                        id_produto: pedido.id_produtos,
                        nome: pedido.nome,
                        preco: pedido.preco
                    },
                    request: {
                        tipo: 'GET',
                        descricao: 'Retorna detalhes de um pedido específico',
                        url: process.env.URL_API + '/pedidos/' + pedido.id_pedidos
                    }
                }
            })
        }
        return res.status(200).send(response)
    } catch (error) {
        return res.status(500).send({ error: error })
    }
};

exports.postPedidos = async(req, res, next) => {
    try {
        const queryProduto = 'SELECT * FROM produtos WHERE id_produtos=?'
        const resultProduto = await mysql.execute(queryProduto, [req.body.id_produto]);
        if (resultProduto.length == 0) {
            return res.status(404).send({
                mensagem: 'Produto não encontrado'
            })
        }
        const queryPedido = 'INSERT INTO pedidos(id_produtos,quantidade) VALUES (?,?)'
        const result = await mysql.execute(queryPedido, [req.body.id_produtos, req.body.quantidade]);
        const response = {
            mensagem: 'Pedido inserido com sucesso',
            pedidoCriado: {
                id_pedido: result.id_pedidos,
                id_produto: req.body.id_produtos,
                quantidade: req.body.quantidade,
                request: {
                    tipo: 'POST',
                    descricao: 'Insere um pedido',
                    url: process.env.URL_API + '/pedidos/'
                }
            }
        }
        return res.status(201).send(response);
    } catch (error) {
        return res.status(500).send({ error: error })
    }
};

exports.getPedidoUnico = async(req, res, next) => {
    try {
        const query = 'SELECT * FROM pedidos WHERE id_pedidos=?;'
        const result = await mysql.execute(query, [req.params.id_pedido]);
        if (result.length == 0) {
            return res.status(404).send({
                mensagem: 'Não foi encontrado pedido com esse id.'
            })
        }
        const response = {
            pedido: {
                id_pedido: result[0].id_pedidos,
                id_produto: result[0].id_produtos,
                quantidade: result[0].quantidade,
                request: {
                    tipo: 'GET',
                    descricao: 'Retorna um pedido',
                    url: process.env.URL_API + '/pedidos/'
                }
            }
        }
        return res.status(200).send(response);
    } catch (error) {
        return res.status(500).send({ error: error });
    }
};

exports.deletePedido = async(req, res, next) => {
    try {
        const query = `DELETE FROM pedidos WHERE id_pedidos= ?`
        await mysql.execute(query, [req.body.id_pedidos]);
        const response = {
            messagem: 'Pedido removido com sucesso',
            request: {
                tipo: 'DELETE',
                descricao: 'Apaga um pedido',
                url: process.env.URL_API + '/produtos/',
                body: {
                    id_produto: 'String',
                    quantidade: 'Number'
                }
            }
        }
        return res.status(201).send(response)
    } catch (error) {
        return res.status(500).send({ error: error });
    }
};