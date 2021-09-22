const mysql = require('../mysql');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.cadastroUsuario = async(req, res, next) => {
    try {
        const queryVerificaUsuario = `SELECT * FROM usuarios WHERE email=?`;
        const queryVerificacao = await mysql.execute(queryVerificaUsuario, [req.body.email]);
        if (queryVerificacao.length > 0) {
            res.status(409).send({ mensagem: 'Usuário já cadastrado' })
        }
        const hash = await bcrypt.hashSync(req.body.senha, 10);

        const queryInserirUsuario = `insert into usuarios (email, senha) values (?,?)`;
        const resultUsuario = await mysql.execute(queryInserirUsuario, [req.body.email, hash]);

        const response = {
            mensagem: 'Usuário criado com sucesso',
            usuarioCriado: {
                id_usuario: resultUsuario.insertId,
                email: req.body.email,
                hash: hash,
                password: req.body.senha
            }
        }
        return res.status(201).send(response);

    } catch (error) {
        return res.status(500).send({ error: error, })
    }
};

exports.logarUsuario = async(req, res, next) => {
    try {
        const query = 'select * from usuarios where email = ?';
        const result = await mysql.execute(query, [req.body.email]);
        if (result.length < 1) { return res.status(401).send({ mensagem: 'Falha na autencicação' }) }

        if (await bcrypt.compareSync(req.body.senha, result[0].senha)) {
            const token = jwt.sign({
                id_usuario: result[0].id_usuario,
                email: result[0].email
            }, process.env.JWT_KEY, {
                expiresIn: "1h"
            })
            return res.status(200).send({
                mensagem: 'Autenticação com sucesso',
                token: token
            })
        }
        return res.status(401).send({ mensagem: 'Falha na autencicação' })

    } catch (error) {
        return res.status(500).send({ messagem: 'Falha na autencicação' })
    }

};