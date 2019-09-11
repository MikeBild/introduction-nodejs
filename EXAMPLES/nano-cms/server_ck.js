const express = require("express")
const app = express()

app.use(express.json)

const port = 1234

const accounts = [
	{
		name: "Ich",
		email: "ich@ich.de",
	},
	{
		name: "Du",
		email: "du@du.de",
	},
]

app.get("/accounts", (req, res) => {
	res.status(200).send(accounts[0])
})

app.listen(port, () => {
	console.log("Port " + port + " wird genutzt")
})
