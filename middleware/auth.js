const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = function (req, res, next) {
  //recogemos el token de la cabecera
  const token = req.header("x-auth-token");
  console.log(req.headers);
  if (!token) {
    return res
      .status(401)
      .json({ msg: "No hay token, no tienes autorización" });
  }

  try {
    //Verificar el token
    const decoded = jwt.verify(token, config.get("jwtToken"));
    req.user = decoded.user;
    next(); //ejecutamos el siguiente callback
  } catch (err) {
    return res.status(401).json({ msg: "El token no és válido" });
  }
};
