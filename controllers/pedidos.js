const mysql = require('../mysql');

exports.getPedidos = async(req, res, next) => {
    try {
        const result = await mysql.execute(
            `select pedidos.id_pedidos,
                    pedidos.quantidade,
                    produtos.id_produtos,
                    produtos.nome,
                    produtos.preco
               from pedidos
            inner join produtos
                on  produtos.id_produtos = pedidos.id_produtos`);
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
        const result = await mysql.execute('select * from produtos where id_produtos=?', [req.body.id_produto]);
        if (result.length == 0) {
            return res.status(404).send({
                mensagem: 'Produto não encontrado'
            })
        }
        const response = {
            mensagem: 'Pedido inserido com sucesso',
            pedidoCriado: {
                id_pedido: result.id_pedidos,
                id_produto: req.body.id_produtos,
                quantidade: req.body.nome,
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
        const result = await mysql.execute('select * from pedidos where id_pedidos=?;', [req.params.id_pedido]);
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
        await mysql.execute(`delete from pedidos where id_pedidos= ?`, [req.body.id_pedidos]);
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