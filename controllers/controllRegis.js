const { MongoClient } = require('mongodb');
const { generarContraseñaSegura, cifrarContraseña } = require('../auth');
const dotenv = require('dotenv');
dotenv.config();

const url = process.env.MONGO_URI;
const cliente = new MongoClient(url);

const registrarEmpleado = async (req, res) => {
  try {
    const contraseñaAleatoria = await generarContraseñaSegura(12);

    const contraseñaCifrada = await cifrarContraseña(contraseñaAleatoria);

    const nuevoEmpleado = {
      nombre: req.body.nombre,
      apellido: req.body.apellido,
      dni: req.body.dni,
      direccion: req.body.direccion,
      telefono: req.body.telefono,
      cargo: req.body.cargo,
      password: contraseñaCifrada,
    };

    await cliente.connect();

    const empleadosCollection = cliente.db('AlquilerAutos').collection('empleado');

    const resultado = await empleadosCollection.insertOne(nuevoEmpleado);

    res.json({ mensaje: 'Empleado registrado con éxito', contraseñaAleatoria });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Error en el servidor');
  } finally {
    await cliente.close();
  }
};

module.exports = {
  registrarEmpleado,
};
