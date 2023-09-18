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
  