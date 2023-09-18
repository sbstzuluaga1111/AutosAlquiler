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
