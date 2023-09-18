const express = require('express');
const dotenv = require('dotenv');
const router = express.Router(); 
const app = express();

dotenv.config();

const port = process.env.PORT || 3000;

app.use(express.json());

const routerBase = require('./routes/routes');
app.use('/Alquileres', routerBase);

app.listen(port, () => {
   console.log('Servidor en ejecución en el puerto ' + port);
});
