const { MongoClient } = require('mongodb');

const dotenv = require('dotenv');
dotenv.config();

const url = process.env.MONGO_URI;
const client = new MongoClient(url);

const ejercicio2 = async (req, res) => {
  try {
    const colection = (await conection()).cliente;
    const cliente = await colection.find({}).toArray();
    res.json(cliente);
    await client.close();
  } catch (error) {
    console.log(error);
    res.status(404).end("Dato Inválido/No enontrado");
  }
};

const ejercicio3 = async (req, res) => {
  try {
    const colection = (await conection()).automovil;
    const automovil = await colection.find({}).toArray();
    res.json(automovil);
    await client.close();
  } catch (error) {
    console.log(error);
    res.status(404).end("Dato Inválido/No enontrado");
  }
};

const ejercicio4 = async (req, res) => {
  try {
    const colection = (await conection()).alquiler;
    const alquiler = await colection
      .find({
        Estado: true,
      })
      .toArray();
    res.json(alquiler);
    await client.close();
  } catch (error) {
    console.log(error);
    res.status(404).end("Dato Inválido/No enontrado");
  }
};

const ejercicio5 = async (req, res) => {
  try {
    const colection = (await conection()).reserva;
    const reserva = await colection
      .find({
        Estado: true,
      })
      .toArray();
    res.json(reserva);
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
    const colection = (await conection()).alquiler;
    const alquiler = await colection
      .find({
        _id: objectId,
      })
      .toArray();
    res.json(alquiler);
    await client.close();
  } catch (error) {
    console.log(error);
    res.status(404).end("Dato Inválido/No enontrado");
  }
};

const ejercicio7 = async (req, res) => {
  try {
    const colection = (await conection()).empleado;
    const empleado = await colection
      .find({
        Cargo: "Vendedor",
      })
      .toArray();
    res.json(empleado);
    await client.close();
  } catch (error) {
    console.log(error);
    res.status(404).end("Dato Inválido/No enontrado");
  }
};

const ejercicio8 = async (req, res) => {
  try {
    const colection = (await conection()).sucursal;
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
            automovilDiponibles: {
              $push: {
                automovilMarca: "$_id.automovilMarca",
                automovilModelo: "$_id.automovilModelo",
                automovilAnio: "$_id.automovilAnio",
              },
            },
            TotalautomovilDisponibles: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
            Sucursal: "$_id",
            TotalautomovilDisponibles: 1,
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
    const colection = (await conection()).alquiler;
    const alquiler = await colection
      .find({
        _id: objectId,
      })
      .project({
        CostoTotal: 1,
      })
      .toArray();
    res.json(alquiler);
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
    const colection = (await conection()).cliente;
    const cliente = await colection
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
    res.json(cliente);
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
    const colection = (await conection()).automovil;
    const automovil = await colection
      .find({
        capacidad: { $gt: capacityNumbe },
      })
      .toArray();
    res.json(automovil);
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
    console.log(date);
    console.log(fecha);
    const colection = (await conection()).alquiler;
    const alquiler = await colection
      .find({
        FechaInicio: fecha,
      })
      .toArray();
    res.json(alquiler);
    await client.close();
  } catch (error) {
    console.log(error);
    res.status(404).end("Dato Inválido/No enontrado");
  }
};

const ejercicio13 = async (req, res) => {
  try {
    const { name, lstName } = req.query;
    const colection = (await conection()).reserva;
    const reserva = await colection
      .find({
        "Cliente.Nombre": name,
        "Cliente.Apellido": lstName,
      })
      .toArray();
    res.json(reserva);
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
    const colection = (await conection()).empleado;
    const alquiler = await colection
      .find({
        Cargo: { $in: cargoSeparados },
      })
      .toArray();
    res.json(alquiler);
    await client.close();
  } catch (error) {
    console.log(error);
    res.status(404).end("Dato Inválido/No enontrado");
  }
};

const ejercicio15 = async (req, res) => {
  try {
  } catch (error) {
    console.log(error);
    res.status(404).end("Dato Inválido/No enontrado");
  }
};

const ejercicio16 = async (req, res) => {
  try {
  } catch (error) {
    console.log(error);
    res.status(404).end("Dato Inválido/No enontrado");
  }
};

const ejercicio17 = async (req, res) => {
  try {
    const colection = (await conection()).sucursal;
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
            automovilDiponibles: {
              $push: {
                automovilMarca: "$_id.automovilMarca",
                automovilModelo: "$_id.automovilModelo",
                automovilAnio: "$_id.automovilAnio",
              },
            },
            TotalautomovilDisponibles: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
            Sucursal: "$_id",
            Direccion: 1,
            automovilDiponibles: 1,
            TotalautomovilDisponibles: 1,
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
  } catch (error) {
    console.log(error);
    res.status(404).end("Dato Inválido/No enontrado");
  }
};

const ejercicio19 = async (req, res) => {
  try {
  } catch (error) {
    console.log(error);
    res.status(404).end("Dato Inválido/No enontrado");
  }
};

const ejercicio20 = async (req, res) => {
  try {
  } catch (error) {
    console.log(error);
    res.status(404).end("Dato Inválido/No enontrado");
  }
};

const ejercicio21 = async (req, res) => {
  try {
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