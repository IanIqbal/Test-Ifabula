const express = require("express")
const Controller = require("../controllers/controller")
const authenticate = require("../middlewares/authentication")
const router = express.Router()


router.post("/login", Controller.login)
router.get("/test", Controller.test )
router.post("/", authenticate,Controller.createTransaction)

//BASIC CONCEPT TEST
router.get("/users", Controller.getUsers)
router.get("/users/:id", Controller.getUserDetail)
router.post("/fibonacci", Controller.finonacciOddOnly)
router.post("/longestWord", Controller.longestWordInsideWord)
module.exports = router