const mysql = require('../mysql');
const fs = require('fs');
const https = require('https');
const axios = require('axios');
const randexp = require('randexp');

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

exports.oAuth = async(req, res, next) => {
    try {
        const cert = fs.readFileSync('nome-do-certificado-aqui');
        const credencials = process.env.CLIENT + ':' + process.env.CLIENT_SECRET;
        const auth = Buffer.from(credencials).toString('base64');
        const agent = https.Agent({
            pfx: cert,
            passphrase: ''
        })
        const data = JSON.stringify({ "grant_type": "client_credentials" })
        res.locals.agent = agent;
        const config = {
            method: "POST",
            url: process.env.URL_API_PAY,
            headers: {
                Authorization: 'Basic ' + auth,
                'Content-type': 'application/json'
            },
            httpsAgent: agent,
            data: data
        }

        axios(config)
            .then(response => {
                res.locals.accessToken = response.data.access_token;
                console.log('autenticacao', response.data);
                next();
            })
            .catch((error) => {
                console.log(error);
                return res.status(500).send({ error: error })
            })
    } catch (error) {
        return res.status(500).send({ error: error });
    }
}

exports.cobrancaPix = async(req, res, next) => {
    try {
        const data = JSON.stringify({
            "calendario": { "expiracao": 3600 },
            "devedor": {
                "cpf": req.body.pagador.cpf,
                "nome": req.body.pagador.nome
            },
            "valor": {
                "original": req.body.value
            },
            "chave": process.env.CHAVE_PIX,
            "solicitacaoPagador": req.body.descricao
        })

        const txId = new randexp(/^[a-zA-Z0-9]{26,25}$/).gen();

        const config = {
            method: "PUT",
            url: process.env.URL_API_PAY + `${txId}`,
            headers: {
                Authorization: 'Bearer ' + res.locals.accessToken,
                'Content-type': 'application/json'
            },
            httpsAgent: res.locals.agent,
            data: data
        }

        axios(config)
            .then(response => {
                res.locals.conta = response.data;
                console.log('conta', response.data);
                next();
            })
            .catch((error) => {
                console.log(error);
                return res.status(500).send({ error: error })
            })
    } catch (error) {
        return res.status(500).send({ error: error });
    }
}

exports.getQrCode = async(req, res, next) => {
    try {
        const locId = res.locals.conta.loc.id;
        const config = {
            method: "GET",
            url: process.env.URL_API_PAY + `${locId}` + '/qrcode',
            headers: {
                Authorization: 'Bearer ' + res.locals.accessToken,
                'Content-type': 'application/json'
            },
            httpsAgent: res.locals.agent,
        }

        axios(config)
            .then(response => {
                res.locals.conta = response.data;
                imageQrCode = decodeBase64Image(response.date.imagemQrCode);
                fs.writeFileSync(`qrcode/pix-conta-${locId}.jpg`, imagemQrCode.data)
                return res.status(200).send(response);
            })
            .catch((error) => {
                console.log(error);
                return res.status(500).send({ error: error })
            })
    } catch (error) {
        return res.status(500).send({ error: error });
    }
}

function decodeBase64Image(dataString) {
    var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    var response = {};

    if (matches.length !== 3) {
        return new Error('Invalid input string');
    }

    response.type = matches[1];
    response.data = new Buffer(matches[2], 'base64');

    return response;
}