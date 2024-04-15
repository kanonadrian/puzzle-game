'use strict';
const express = require('express');
const mysql = require('mysql');
const connection = require('../../config/mysql');
const scoreController = express.Router();

scoreController.post('/insertUser/', async(req, res) => {

    try {

        let dataBody = req.body;
        let in_nombre = dataBody.NOMBRE;
        let in_puesto = null;
        let in_area = null;
        let in_unidad_negocio = null;
        let in_telefono = null;
        let in_correo = dataBody.CORREO;
        
        connection.query(`CALL sp_registro_juego(?,?,?,?,?,?)`, [in_nombre, in_puesto, in_area, in_unidad_negocio, in_telefono, in_correo], (error, rows) => {
            
            if(error){

                res.json({
                    "error": true,
                    "code": 502,
                    "message": error.message,
                    "data": {}
                });

            }else{
                res.json({
                    "error": false,
                    "code": 200,
                    "message": 'Success',
                    "data": rows[0][0]
                });
            }
        });

    } catch (err) {

        res.json({
            "error": true,
            "code": 502,
            "message": err.message,
            "data": {}
        });

    }

});

scoreController.post('/insertScore/', async(req, res) => {

    try {

        let dataBody = req.body;
        let in_id = dataBody.ID;
        let in_nombre = dataBody.NOMBRE;
        let in_puntuacion = dataBody.PUNTUACION;
        connection.query(`CALL sp_puntuacion_juego(?,?,?)`, [in_id, in_nombre, in_puntuacion], (error, rows) => {
            
            if(error){

                res.json({
                    "error": true,
                    "code": 502,
                    "message": error.message,
                    "data": {}
                });

            }else{
                res.json({
                    "error": false,
                    "code": 200,
                    "message": 'Success',
                    "data": {}
                });
            }
        });

    } catch (err) {

        res.json({
            "error": true,
            "code": 502,
            "message": err.message,
            "data": {}
        });

    }

});

scoreController.post('/insertStand/', async(req, res) => {

    try {

        let dataBody = req.body;
        let in_nombre = dataBody.NOMBRE;
        let in_puesto = dataBody.PUESTO;
        let in_area = dataBody.AREA;
        let in_unidad_negocio = dataBody.UNIDAD_NEGOCIO;
        let in_telefono = dataBody.TELEFONO;
        let in_correo = dataBody.CORREO;
        connection.query(`CALL sp_registro_stand(?,?,?,?,?,?)`, [in_nombre, in_puesto, in_area,in_unidad_negocio,in_telefono,in_correo], (error, rows) => {
            
            if(error){

                res.json({
                    "error": true,
                    "code": 502,
                    "message": error.message,
                    "data": {}
                });

            }else{
                res.json({
                    "error": false,
                    "code": 200,
                    "message": 'Success',
                    "data": {}
                });
            }
        });

    } catch (err) {

        res.json({
            "error": true,
            "code": 502,
            "message": err.message,
            "data": {}
        });

    }

});


scoreController.post('/getScore/', async(req, res) => {

    try {

        connection.query(`CALL sp_puntuaciones()`, [], (error, rows) => {
            
            if(error){

                res.json({
                    "error": true,
                    "code": 502,
                    "message": error.message,
                    "data": {}
                });

            }else{
                res.json({
                    "error": false,
                    "code": 200,
                    "message": 'Success',
                    "data": rows[0]
                });
            }
        });

    } catch (err) {

        res.json({
            "error": true,
            "code": 502,
            "message": err.message,
            "data": {}
        });

    }

});

module.exports = scoreController;


