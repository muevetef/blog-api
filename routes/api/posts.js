const express = require("express");
const router = express.Router();

/**
 * @route GET api/posts
 * @acces Public
 * */
router.get("/", (req, res) => res.send("posts route!!"));

module.exports = router;

/*
 GET /api/posts -> todos los posts

 GET /api/posts/{id} ->  un post por id

 POST /api/posts -> crea un post

 PUT /api/posts/{id} -> actualizar un post

 DELETE /api/posts/{id} -> elimina un post


 - El usuario debe estar logeado para crear, editar o eliminar
*/