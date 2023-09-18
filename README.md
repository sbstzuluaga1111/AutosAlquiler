# AutosAlquiler

## puntos importantes del JWT:

- **auth.js**
```
const bcrypt = require('bcryptjs');

const generarContraseñaSegura = async (longitud) => {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let contraseña = '';
    for (let i = 0; i < longitud; i++) {
      const caracterAleatorio = caracteres.charAt(Math.floor(Math.random() * caracteres.length));
      contraseña += caracterAleatorio;
    }
    return contraseña;
};

const cifrarContraseña = async (contraseña) => {
    try {
        const salt = await bcrypt.genSalt(10);
    
        const contraseñaCifrada = await bcrypt.hash(contraseña, salt);
    
        return contraseñaCifrada;
      } catch (error) {
        console.error('Error al cifrar la contraseña:', error);
        throw error;
      }
};

module.exports = {
  generarContraseñaSegura,
  cifrarContraseña,
};
```
- **middleware.js**
```
const checkPermission = (requiredPermission) => {
    return (req, res, next) => {
      const empleado = req.empleado; 
  
      if (!empleado || empleado.rol !== requiredPermission) {
        return res.status(403).json({ mensaje: 'Acceso no autorizado' });
      }
  
      next();
    };
  };
  
  module.exports = {
    checkPermission,
  };
  
```
- **controllRegis.js**
```
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
```
- **controllAut.js**
```
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

```

## End points realizados:

```
  router.use("/Alquileres/ejercicio2", [], ejercicio2);
  router.use("/Alquileres/ejercicio3", [], ejercicio3);
  router.use("/Alquileres/ejercicio4", [], ejercicio4);
  router.use("/Alquileres/ejercicio5", [], ejercicio5);
  router.use("/Alquileres/ejercicio6", [], ejercicio6);
  router.use("/Alquileres/ejercicio7", [], ejercicio7);
  router.use("/Alquileres/ejercicio8", [], ejercicio8);
  router.use("/Alquileres/ejercicio9", [], ejercicio9);
  router.use("/Alquileres/ejercicio10", [], ejercicio10);
  router.use("/Alquileres/ejercicio11", [], ejercicio11);
  router.use("/Alquileres/ejercicio12", [], ejercicio12);
  router.use("/Alquileres/ejercicio13", [], ejercicio13);
  router.use("/Alquileres/ejercicio14", [], ejercicio14);
  router.use("/Alquileres/ejercicio15", [], ejercicio15);
  router.use("/Alquileres/ejercicio16", [], ejercicio16);
  router.use("/Alquileres/ejercicio17", [], ejercicio17);
  router.use("/Alquileres/ejercicio18", [], ejercicio18);
  router.use("/Alquileres/ejercicio19", [], ejercicio19);
  router.use("/Alquileres/ejercicio20", [], ejercicio20);
  router.use("/Alquileres/ejercicio21", [], ejercicio21);
```

