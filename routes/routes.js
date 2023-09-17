const express = require('express');
const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
const router = express.Router();

dotenv.config();

const url = process.env.MONGO_URI;
const nombreBases = "AlquilerAutos";

router.get('/', (req, res) => {
    try {
        res.json("Somos CL");
    } catch (e) {
        res.status(500).json("estoy mal");
    }
});

router.get('/punto2', async (req, res) => {
    try {
        const client = new MongoClient(url);
        await client.connect();
        const db = client.db(nombreBases);
        const colection = db.collection('Clientes');
        const result = await colection.find({}).toArray();
        res.json(result);
        client.close();
        
    } catch (e) {
        console.log(e);
        res.status(404).json("Error en la consulta");
    }
});



router.get('/punto3', async (req, res) => {
    try {
        const client = new MongoClient(url);
        await client.connect();
        const db = client.db(nombreBases);
        const colection = db.collection('Automoviles');
        const result = await colection.find({ disponible: true }).toArray();
        res.json(result);
        client.close();
        
    } catch (e) {
        console.error(e);
        res.status(500).json("Error en la consulta");
    }
});

router.get('/punto4', async (req, res) => {
    try {
        const client = new MongoClient(url);
        await client.connect();
        const db = client.db(nombreBases);
        
        const alquileresCollection = db.collection('Alquileres');
        const clientesCollection = db.collection('Clientes');

        const resultado = await alquileresCollection.aggregate([
            {
                $match: {
                    fecha_fin: { $gte: new Date() },
                    entregado: false,
                },
            },
            {
                $lookup: {
                    from: 'Clientes',
                    localField: 'cliente_id',
                    foreignField: '_id',
                    as: 'cliente',
                },
            },
            {
                $unwind: '$cliente',
            },
            {
                $project: {
                    _id: 1,
                    fecha_inicio: 1,
                    fecha_fin: 1,
                    cliente: {
                        nombre: 1,
                        email: 1,
                        telefono: 1,
                        direccion: 1,
                    },
                },
            },
        ]).toArray();

        res.json(resultado);
        client.close();
    } catch (e) {
        console.error(e);
        res.status(500).json("Error en la consulta");
    }
});


router.get('/punto5', async (req, res) => {
    try {
        const client = new MongoClient(url);
        await client.connect();
        const db = client.db(nombreBases);
        
        const reservasCollection = db.collection('Reservas');
        const clientesCollection = db.collection('Clientes');
        const automovilesCollection = db.collection('Automoviles');

        const resultado = await reservasCollection.aggregate([
            {
                $match: {
                    fecha_inicio: { $gte: new Date() },
                    entregado: false,
                },
            },
            {
                $lookup: {
                    from: 'Clientes',
                    localField: 'cliente_id',
                    foreignField: '_id',
                    as: 'cliente',
                },
            },
            {
                $lookup: {
                    from: 'Automoviles',
                    localField: 'automovil_id',
                    foreignField: '_id',
                    as: 'automovil',
                },
            },
            {
                $unwind: '$cliente',
            },
            {
                $unwind: '$automovil',
            },
            {
                $project: {
                    _id: 1,
                    fecha_inicio: 1,
                    fecha_fin: 1,
                    cliente: {
                        nombre: 1,
                        email: 1,
                        telefono: 1,
                        direccion: 1,
                    },
                    automovil: {
                        marca: 1,
                        modelo: 1,
                        ano: 1,
                    },
                },
            },
        ]).toArray();

        res.json(resultado);
        client.close();
    } catch (e) {
        console.error(e);
        res.status(500).json("Error en la consulta");
    }
});





module.exports = router;
