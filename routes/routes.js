const express = require('express');
const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
const router = express.Router();
const { registrarEmpleado } = require('../controllers/controllRegis');
const { autenticarEmpleado } = require('../controllers/controllAut');
dotenv.config();

const url = process.env.MONGO_URI;
const nombreBases = "AlquilerAutos";

//Empleados rutas
router.post('/autenticar-empleado', autenticarEmpleado);
router.post('/registrar-empleado', registrarEmpleado);


const { checkPermission } = require('../middleware');


router.post('/agregar-cliente',checkPermission('gerente'), async (req, res) => {
    try {
      await cliente.connect();
  
      const nuevoCliente = {
        ID_Cliente: req.body.ID_Cliente,
        Nombre: req.body.Nombre,
        Apellido: req.body.Apellido,
        DNI: req.body.DNI,
        Direccion: req.body.Direccion,
        Telefono: req.body.Telefono,
        Email: req.body.Email,
      };
  
      const clientesCollection = cliente.db('AlquilerAutos').collection('cliente');
  
      const resultado = await clientesCollection.insertOne(nuevoCliente);
  
      res.json({ mensaje: 'Cliente agregado con éxito', nuevoCliente });
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Error en el servidor');
    } finally {
      await cliente.close();
    }
  });

// Ruta para agregar un automóvil (solo accesible para empleados con el rol "gerente").
  router.post('/agregar-automovil', checkPermission('gerente'), async (req, res) => {
    try {
        await cliente.connect();
    
        const db = cliente.db('AlquilerAutos');
        const automovilesCollection = db.collection('automovil');
    
        const nuevoAutomovil = req.body;
    
        await automovilesCollection.insertOne(nuevoAutomóvil);
    
        res.json({ mensaje: 'Automóvil agregado con éxito' });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Error en el servidor');
    } finally {
        await cliente.close();
    }
});

// Ruta para editar un automóvil (solo accesible para empleados con el rol "gerente").
router.put('/editar-automovil/:id', checkPermission('gerente'), async (req, res) => {
    try {
        const automovilId = req.params.id;
        const nuevoDatosAutomovil = req.body;

        await cliente.connect();

        const db = cliente.db('AlquilerAutos');
        const automovilesCollection = db.collection('automovil');

        const automovilExistente = await automovilesCollection.findOne({ _id: ObjectId(automovilId) });

        if (!automovilExistente) {
            return res.status(404).json({ mensaje: 'Automóvil no encontrado' });
        }

        await automovilesCollection.updateOne(
            { _id: ObjectId(automovilId) },
            { $set: nuevoDatosAutomovil }
        );

        res.json({ mensaje: 'Automóvil actualizado con éxito' });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Error en el servidor');
    } finally {
        await cliente.close();
    }
});

// Ruta para obtener la lista de automóviles disponibles.
router.get('/automoviles-disponibles', async (req, res) => {
    try {
        await cliente.connect();

        const db = cliente.db('AlquilerAutos');
        const automovilesCollection = db.collection('automovil');

        const automovilesDisponibles = await automovilesCollection.find({ disponible: true }).toArray();

        res.json(automovilesDisponibles);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Error en el servidor');
    } finally {
        await cliente.close();
    }
});

// Ruta para eliminar un automóvil por su ID.
router.delete('/eliminar-automovil/:id', checkPermission('gerente'), async (req, res) => {
    try {
        const automovilId = req.params.id;

        await cliente.connect();

        const db = cliente.db('AlquilerAutos');
        const automovilesCollection = db.collection('automovil');

        const automovilExistente = await automovilesCollection.findOne({ ID_Automovil: automovilId });

        if (!automovilExistente) {
            return res.status(404).json({ mensaje: 'Automóvil no encontrado' });
        }

        await automovilesCollection.deleteOne({ ID_Automovil: automovilId });

        res.json({ mensaje: 'Automóvil eliminado con éxito' });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Error en el servidor');
    } finally {
        await cliente.close();
    }
});

// Ruta para registrar un alquiler o una reserva.
router.post('/registrar-alquiler-o-reserva', async (req, res) => {
    try {
        const nuevaOperacion = req.body;

        await cliente.connect();

        const db = cliente.db('AlquilerAutos');
        const clientesCollection = db.collection('cliente');
        const automovilesCollection = db.collection('automovil');

        const clienteExistente = await clientesCollection.findOne({ ID_Cliente: nuevaOperacion.ID_Cliente });
        const automovilExistente = await automovilesCollection.findOne({ ID_Automovil: nuevaOperacion.ID_Automovil });

        if (!clienteExistente) {
            return res.status(404).json({ mensaje: 'Cliente no encontrado' });
        }

        if (!automovilExistente) {
            return res.status(404).json({ mensaje: 'Automóvil no encontrado' });
        }

        if (nuevaOperacion.Tipo === 'alquiler') {
            const alquileresCollection = db.collection('alquiler');
            await alquileresCollection.insertOne(nuevaOperacion);
        } else if (nuevaOperacion.Tipo === 'reserva') {
            const reservasCollection = db.collection('reserva');
            await reservasCollection.insertOne(nuevaOperacion);
        } else {
            return res.status(400).json({ mensaje: 'Tipo de operación no válido' });
        }

        res.json({ mensaje: 'Operación registrada con éxito' });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Error en el servidor');
    } finally {
        await cliente.close();
    }
});








// Ruta para registrar la devolución de un automóvil
router.post('/registrar-devolucion', async (req, res) => {
    try {
        const devolucion = req.body; // Datos de la devolución

        await cliente.connect();
        const db = cliente.db('AlquilerAutos');
        const registroDevolucionCollection = db.collection('registro_devolucion');

        // Insertar la devolución en la colección registro_devolucion
        const resultado = await registroDevolucionCollection.insertOne(devolucion);

        res.json({ mensaje: 'Devolución registrada con éxito', resultado });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Error en el servidor');
    } finally {
        await cliente.close();
    }
});

// Ruta para registrar la entrega de un automóvil
router.post('/registrar-entrega', async (req, res) => {
    try {
        const entrega = req.body; // Datos de la entrega

        await cliente.connect();
        const db = cliente.db('AlquilerAutos');
        const registroEntregaCollection = db.collection('registro_entrega');

        // Insertar la entrega en la colección registro_entrega
        const resultado = await registroEntregaCollection.insertOne(entrega);

        res.json({ mensaje: 'Entrega registrada con éxito', resultado });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Error en el servidor');
    } finally {
        await cliente.close();
    }
});



//Empleados rutas


//Rutas General de los puntos

const {ejercicio2,
    ejercicio3,
    ejercicio4,
    ejercicio5,
    ejercicio6,
    ejercicio7,
    ejercicio8,
    ejercicio9,
    ejercicio10,
    ejercicio11,
    ejercicio12,
    ejercicio13,
    ejercicio14,
    ejercicio15,
    ejercicio16,
    ejercicio17,
    ejercicio18,
    ejercicio19,
    ejercicio20,
    ejercicio21, } = require('../controller/endpoints.controller.js');
  
 
  
  router.use("/ejercicio2", [], ejercicio2);
  router.use("/ejercicio3", [], ejercicio3);
  router.use("/ejercicio4", [], ejercicio4);
  router.use("/ejercicio5", [], ejercicio5);
  router.use("/ejercicio6", [], ejercicio6);
  router.use("/ejercicio7", [], ejercicio7);
  router.use("/ejercicio8", [], ejercicio8);
  router.use("/ejercicio9", [], ejercicio9);
  router.use("/ejercicio10", [], ejercicio10);
  router.use("/ejercicio11", [], ejercicio11);
  router.use("/ejercicio12", [], ejercicio12);
  router.use("/ejercicio13", [], ejercicio13);
  router.use("/ejercicio14", [], ejercicio14);
  router.use("/ejercicio15", [], ejercicio15);
  router.use("/ejercicio16", [], ejercicio16);
  router.use("/ejercicio17", [], ejercicio17);
  router.use("/ejercicio18", [], ejercicio18);
  router.use("/ejercicio19", [], ejercicio19);
  router.use("/ejercicio20", [], ejercicio20);
  router.use("/ejercicio21", [], ejercicio21);
  
module.exports = router;
