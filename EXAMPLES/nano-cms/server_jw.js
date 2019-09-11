const express = require("express")
const instance = express()

const accountList = []

instance.get("/accounts", (req, res) => {
	res.send(JSON.stringify(accountList))
})

instance.post("/accounts:account", (req, res) => {
	const newAccount = req.account
	// Account anlegen
})

instance.listen(8080, () => {
	console.log("Listen on 8080")
})
