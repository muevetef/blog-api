const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");

const { check, validationResult } = require("express-validator");

const User = require("../../models/Users");

/**
 * @desc Crea un usuario
 * @route POST api/users
 * @acces Public
 * */
router.post(
  "/",
  [
    check("name", "El nombre es requerido").not().isEmpty(),
    check("email", "Por favor inserte un email válido").isEmail(),
    check("password", "La contraseña debe tener minímo 6 carácteres").isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    console.log(errors);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;
    //mirar si ek usuario existe
    try {
      let user = await User.findOne({ email });
      if (user) {
        res.status(400).json({ errors: [{ msg: " El usuario ya existe" }] });
        return;
      }

      user = new User({
        name,
        email,
        password,
      });

      //Encriptar el pawword
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      //insertar el usuario en la base de datos
      await user.save();

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
