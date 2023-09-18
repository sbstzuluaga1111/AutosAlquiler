const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
const { claveSecretaJWT } = require('../auth');

dotenv.config();

const url = process.env.MONGO_URI;
const cliente = new MongoClient(url);

const autenticarEmpleado = async (req, res) => {
    const { nombre, password } = req.body;
  
    try {
      await cliente.connect();
  
      const empleadosCollection = cliente.db('AlquilerAutos').collection('empleado');
  
      const empleado = await empleadosCollection.findOne({ nombre });
  
      if (!empleado) {
        console.log('Empleado no encontrado');
        return res.status(401).json({ mensaje: 'Credenciales inválidas' });
      }
  
      const contrasenaCoincide = bcrypt.compareSync(password, empleado.password);
  
      if (!contrasenaCoincide) {
        console.log('Contraseña no coincide');
        return res.status(401).json({ mensaje: 'Credenciales inválidas' });
      }
  
      // Genera el token JWT aquí
      const token = jwt.sign({ empleado_id: empleado._id }, process.env.claveSecretaJWT, {
        expiresIn: '1h',
      });
  
      res.json({ token });
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Error en el servidor');
    } finally {
      await cliente.close();
    }
  };
  

module.exports = {
  autenticarEmpleado,
};
