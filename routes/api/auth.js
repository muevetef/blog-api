const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");

const User = require("../../models/Users");
/**
 * @route GET api/auth
 * @acces Public
 * */
router.get("/", auth, async (req, res) => {
  //recoger el usuario de la base de datos
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error");
  }
});



module.exports = router;
