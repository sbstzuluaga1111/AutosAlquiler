const { MongoClient } = require('mongodb');

const dotenv = require('dotenv');
dotenv.config();

const url = process.env.MONGO_URI;
const client = new MongoClient(url);

const ejercicio2 = async (req, res) => {
  try {
    const colection = (await conection()).Clientes;
    const clientes = await colection.find({}).toArray();
    res.json(clientes);
    await client.close();
  } catch (error) {
    console.log(error);
    res.status(404).end("Dato Inválido/No enontrado");
  }
};

const ejercicio3 = async (req, res) => {
  try {
    const colection = (await conection()).Automoviles;
    const automoviles = await colection.find({}).toArray();
    res.json(automoviles);
    await client.close();
  } catch (error) {
    console.log(error);
    res.status(404).end("Dato Inválido/No enontrado");
  }
};

const ejercicio4 = async (req, res) => {
  try {
    const colection = (await conection()).Alquileres;
    const alquileres = await colection
      .find({
        Estado: true,
      })
      .toArray();
    res.json(alquileres);
    await client.close();
  } catch (error) {
    console.log(error);
    res.status(404).end("Dato Inválido/No enontrado");
  }
};

const ejercicio5 = async (req, res) => {
  try {
    const colection = (await conection()).Reservas;
    const reservas = await colection
      .find({
        Estado: true,
      })
      .toArray();
    res.json(reservas);
    await client.close();
  } catch (error) {
    console.log(error);
    res.status(404).end("Dato Inválido/No enontrado");
  }
};

const ejercicio6 = async (req, res) => {
  try {
    const { id } = req.query;
    const objectId = new ObjectId(id);
    const colection = (await conection()).Alquileres;
    const alquileres = await colection
      .find({
        _id: objectId,
      })
      .toArray();
    res.json(alquileres);
    await client.close();
  } catch (error) {
    console.log(error);
    res.status(404).end("Dato Inválido/No enontrado");
  }
};

const ejercicio7 = async (req, res) => {
  try {
    const colection = (await conection()).Empleados;
    const empleados = await colection
      .find({
        Cargo: "Vendedor",
      })
      .toArray();
    res.json(empleados);
    await client.close();
  } catch (error) {
    console.log(error);
    res.status(404).end("Dato Inválido/No enontrado");
  }
};

const ejercicio8 = async (req, res) => {
  try {
    const colection = (await conection()).SucursalAutomovil;
    const result = await colection
      .aggregate([
        {
          $group: {
            _id: {
              sucursal: "$Sucursal.Nombre",
              automovilMarca: "$Automovil.Marca",
              automovilModelo: "$Automovil.Modelo",
              automovilAnio: "$Automovil.Anio",
            },
          },
        },
        {
          $group: {
            _id: "$_id.sucursal",
            AutomovilesDiponibles: {
              $push: {
                automovilMarca: "$_id.automovilMarca",
                automovilModelo: "$_id.automovilModelo",
                automovilAnio: "$_id.automovilAnio",
              },
            },
            TotalAutomovilesDisponibles: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
            Sucursal: "$_id",
            TotalAutomovilesDisponibles: 1,
          },
        },
      ])
      .toArray();
    res.json(result);
    await client.close();
  } catch (error) {
    console.log(error);
    res.status(404).end("Dato Inválido/No enontrado");
  }
};

const ejercicio9 = async (req, res) => {
  try {
    const { id } = req.query;
    const objectId = new ObjectId(id);
    const colection = (await conection()).Alquileres;
    const alquileres = await colection
      .find({
        _id: objectId,
      })
      .project({
        CostoTotal: 1,
      })
      .toArray();
    res.json(alquileres);
    await client.close();
  } catch (error) {
    console.log(error);
    res.status(404).end("Dato Inválido/No enontrado");
  }
};

const ejercicio10 = async (req, res) => {
  try {
    const { dni } = req.query;
    const dniNumero = Number(dni);
    const colection = (await conection()).Clientes;
    const clientes = await colection
      .find({
        DNI: dniNumero,
      })
      .project({
        _id: 0,
        DNI: 1,
        Nombre: 1,
        Apellido: 1,
      })
      .toArray();
    res.json(clientes);
    await client.close();
  } catch (error) {
    console.log(error);
    res.status(404).end("Dato Inválido/No enontrado");
  }
};

const ejercicio11 = async (req, res) => {
  try {
    const { capacity } = req.query;
    const capacityNumbe = Number(capacity);
    const colection = (await conection()).Automoviles;
    const automoviles = await colection
      .find({
        capacidad: { $gt: capacityNumbe },
      })
      .toArray();
    res.json(automoviles);
    await client.close();
  } catch (error) {
    console.log(error);
    res.status(404).end("Dato Inválido/No enontrado");
  }
};

const ejercicio12 = async (req, res) => {
  try {
    const { date } = req.query;
    const fecha = new Date(date);
    const colection = (await conection()).Alquileres;
    const alquileres = await colection
      .find({
        FechaInicio: fecha,
      })
      .toArray();
    res.json(alquileres);
    await client.close();
  } catch (error) {
    console.log(error);
    res.status(404).end("Dato Inválido/No enontrado");
  }
};

const ejercicio13 = async (req, res) => {
  try {
    const { name, lstName } = req.query;
    const colection = (await conection()).Reservas;
    const reservas = await colection
      .find({
        "Cliente.Nombre": name,
        "Cliente.Apellido": lstName,
        Estado: true
      })
      .toArray();
    res.json(reservas);
    await client.close();
  } catch (error) {
    console.log(error);
    res.status(404).end("Dato Inválido/No enontrado");
  }
};

const ejercicio14 = async (req, res) => {
  try {
    const { cargo } = req.query;
    const cargoSeparados = cargo.split("-");
    const colection = (await conection()).Empleados;
    const alquileres = await colection
      .find({
        Cargo: { $in: cargoSeparados },
      })
      .toArray();
    res.json(alquileres);
    await client.close();
  } catch (error) {
    console.log(error);
    res.status(404).end("Dato Inválido/No enontrado");
  }
};

const ejercicio15 = async (req, res) => {
  try {
    const colection = (await conection()).Clientes;
    const colection2 = (await conection()).Alquileres;

    const alquileresCliente = await colection2.distinct("Cliente");

    const condiciones = alquileresCliente.map((cliente) => ({
      $or: [{ Nombre: cliente.Nombre, Apellido: cliente.Apellido }],
    }));

    const cliente = await colection
      .find({
        $or: condiciones,
      })
      .toArray();
    res.json(cliente);
    await client.close();
  } catch (error) {
    console.log(error);
    res.status(404).end("Dato Inválido/No enontrado");
  }
};

const ejercicio16 = async (req, res) => {
  try {
    const colection = (await conection()).Automoviles;
    const automoviles = await colection
      .aggregate([
        {
          $sort: {
            Marca: 1,
            Modelo: 1,
            Anio: 1,
          },
        },
      ])
      .toArray();
    res.json(automoviles);
    await client.close();
  } catch (error) {
    console.log(error);
    res.status(404).end("Dato Inválido/No enontrado");
  }
};

const ejercicio17 = async (req, res) => {
  try {
    const colection = (await conection()).SucursalAutomovil;
    const result = await colection
      .aggregate([
        {
          $group: {
            _id: {
              sucursal: "$Sucursal.Nombre",
              Direccion: "$Sucursal.Direccion",
              automovilMarca: "$Automovil.Marca",
              automovilModelo: "$Automovil.Modelo",
              automovilAnio: "$Automovil.Anio",
            },
          },
        },
        {
          $group: {
            _id: "$_id.sucursal",
            Direccion: { $first: "$_id.Direccion" },
            AutomovilesDiponibles: {
              $push: {
                automovilMarca: "$_id.automovilMarca",
                automovilModelo: "$_id.automovilModelo",
                automovilAnio: "$_id.automovilAnio",
              },
            },
            TotalAutomovilesDisponibles: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
            Sucursal: "$_id",
            Direccion: 1,
            AutomovilesDiponibles: 1,
            TotalAutomovilesDisponibles: 1,
          },
        },
      ])
      .toArray();
    res.json(result);
    await client.close();
  } catch (error) {
    console.log(error);
    res.status(404).end("Dato Inválido/No enontrado");
  }
};

const ejercicio18 = async (req, res) => {
  try {
    const colection = (await conection()).Alquileres;
    const alquileres = await colection.find({}).toArray();
    res.json({
      AlquileresTotalesRegistrados: alquileres.length,
    });
    await client.close();
  } catch (error) {
    console.log(error);
    res.status(404).end("Dato Inválido/No enontrado");
  }
};

const ejercicio19 = async (req, res) => {
  try {
    const { capacity } = req.query;
    const capacityNumbe = Number(capacity);
    const colection = (await conection()).Automoviles;
    const colection2 = (await conection()).SucursalAutomovil;

    const sucursalAutomovil = await colection2.distinct('Automovil')

    const automovilSelected = sucursalAutomovil.map((cliente) => ({
        $or: [{ Marca: cliente.Marca, Modelo: cliente.Modelo, Anio: cliente.Anio}],
      }));

    const automoviles = await colection
      .find({
        capacidad:capacityNumbe,
        $or: automovilSelected
      })
      .toArray();
    
    res.json(automoviles);
    await client.close();
  } catch (error) {
    console.log(error);
    res.status(404).end("Dato Inválido/No enontrado");
  }
};

const ejercicio20 = async (req, res) => {
  try {
    const { id } = req.query;
    const mongoID = new ObjectId(id);
    const colection = (await conection()).Clientes;
    const colection2 = (await conection()).Reservas;

    const reservasCliente = await colection2
      .find({
        _id: mongoID,
      })
      .toArray();

    const cliente = await colection
      .find({
        Nombre: reservasCliente[0].Cliente.Nombre,
        Apellido: reservasCliente[0].Cliente.Apellido,
      })
      .toArray();
    res.json(cliente);
    await client.close();
  } catch (error) {
    console.log(error);
    res.status(404).end("Dato Inválido/No enontrado");
  }
};

const ejercicio21 = async (req, res) => {
  try {
    const { ini,fini } = req.query;
    const fechaInicio = new Date(ini);
    const fechaFinal = new Date(fini);
    const colection = (await conection()).Alquileres;
    const alquileres = await colection
      .find({
        FechaInicio: {$gte:fechaInicio },
        FechaFin: {$lte: fechaFinal}
      })
      .toArray();
    res.json(alquileres);
    await client.close();
  } catch (error) {
    console.log(error);
    res.status(404).end("Dato Inválido/No enontrado");
  }
};

module.exports = {
  ejercicio2,
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
  ejercicio21,
};