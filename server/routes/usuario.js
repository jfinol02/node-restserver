const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const Usuario = require('../models/usuario');
const _ = require('underscore');

app.get('/usuario', function(req, res) {

    let desde = req.query.desde || 0;
    let limite = req.query.limite || 20;
    let campos = 'nombre email role estado google img';

    Usuario.find({ estado: true }, campos)
        .skip(Number(desde))
        .limit(Number(limite))
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err: err,
                    mensaje: 'Error al intentar recuperar los registros'
                });
            }

            Usuario.count({ estado: true }, (err, conteo) => {
                res.json({
                    usuarios: usuarios,
                    cantidad: conteo,
                    ok: true,
                    author: 'Jesus E. Finol'
                });
            });
        });
});

app.post('/usuario', function(req, res) {

    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err: err,
                mensaje: 'Error al intentar almacenar registro'
            });
        }

        res.json({
            usuario: usuarioDB,
            ok: true,
            author: 'Jesus E. Finol',
            mensaje: 'registro creado de forma satisfactoria'
        })
    });
});

app.put('/usuario/:id', function(req, res) {

    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err: err,
                mensaje: 'Error al intentar actualizar registro'
            });
        }

        res.json({
            usuario: usuarioDB,
            ok: true,
            author: 'Jesus E. Finol',
            mensaje: 'registro actualizado de forma satisfactoria'
        });
    });
});

app.delete('/usuario/:id', function(req, res) {

    let id = req.params.id;
    let cambiaEstado = {
            estado: false
        }
        //Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
    Usuario.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, usuarioBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err: err,
                mensaje: 'Error al intentar eliminar registro'
            });
        }

        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        }

        res.json({
            usuario: usuarioBorrado,
            ok: true,
            author: 'Jesus E. Finol',
            mensaje: 'registro eliminado de forma satisfactoria'
        });
    });
});

module.exports = app;