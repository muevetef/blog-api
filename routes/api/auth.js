const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");

const User = require("../../models/Users");
/**
 * @route GET api/auth
 * @acces Public
 * */
router.get("/", auth, async (req, res) => {
  //recoger el usuario de la base de datos
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error");
  }
});

/**
 * @desc Verifica las credenciales del usuario y genera el token de sessión
 * @route POST api/auth
 * @acces Public
 * */
router.post(
  "/",
  [
    check("email", "Por favor inserte un email válido").isEmail(),
    check("password", "Se requiere un contraseña").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    //mirar si el email está registrado
    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });

      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Credenciales no válidas email" }] });
      }

      //comprobamo la contraseña
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Credenciales no válidas" }] });
      }

      //El usuario está autorizado
      const payload = {
        user: {
          id: user.id,
        },
      };
      //Generar un jswebtoken y devolverlo
      jwt.sign(
        payload,
        config.get("jwtToken"),
        { expiresIn: 36000 },
        (err, token) => {
          if (err) throw err;
          res.status(201).json({ token });
        }
      );
    } catch (error) {
      console.log(error);
      res.status(500).send("Server Error");
    }
  }
);

module.exports = router;
