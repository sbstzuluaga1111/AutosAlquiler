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

router.get('/punto1', async (req, res) => {
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



router.get('/punto2', async (req, res) => {
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

router.get('/punto3', async (req, res) => {
    try {
        const client = new MongoClient(url);
        await client.connect();
        const db = client.db(nombreBases);
        
        const alquileresCollection = db.collection('Alquileres');
        const clientesCollection = db.collection('Clientes');

        const resultado = await alquileresCollection.aggregate([
            {
                $match: {
                    fecha_fin: { $gte: new Date() }, // Filtrar alquileres activos por fecha
                    entregado: false, // Filtrar alquileres no entregados
                },
            },
            {
                $lookup: {
                    from: 'Clientes', // Colección para realizar la unión
                    localField: 'cliente_id', // Utilizar el nombre del campo sin "$oid"
                    foreignField: '_id', // Utilizar el nombre del campo sin "$oid"
                    as: 'cliente', // Alias para el resultado de la unión
                },
            },
            {
                $unwind: '$cliente', // Deshacer el resultado del $lookup para obtener un solo objeto cliente
            },
            {
                $project: {
                    _id: 1, // Incluir campos relevantes de los alquileres y clientes
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





module.exports = router;
