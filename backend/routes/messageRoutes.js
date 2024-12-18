        const express = require("express");
        const router = express.Router();
        const { createMessage,getAllMessages, deleteMessage } = require("../controllers/messageController");
        const {authMiddleware  } = require('../middlewares/authMiddleware');

        // const authenticate = require("../")
        // POST route to create a new message
        router.post("/create",createMessage);


        // GET route to fetch all messages
        router.get("/", getAllMessages);

        // DELETE route to delete a message by ID
        router.delete("/:id", deleteMessage);

        module.exports = router;
