const MongoClient = require("mongodb").MongoClient;
const User = require("./user");

MongoClient.connect(
	// TODO: Connection 
	"mongodb+srv://m001-student:m001-mongodb-basics@sandbox.2ozfn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
	{ useNewUrlParser: true },
).catch(err => {
	console.error(err.stack)
	process.exit(1)
}).then(async client => {
	console.log('Connected to MongoDB');
	User.injectDB(client);
})

const express = require('express')
const app = express()
const port = process.env.PORT || 3000

const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const options = {
	definition: {
		openapi: '3.0.0',
		info: {
			title: 'MyVMS API',
			version: '1.0.0',
		},
	},
	apis: ['./main.js'],
};
const swaggerSpec = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.get('/', (req, res) => {
	res.send('Hello World')
})

app.get('/hello', (req, res) => {
	res.send('Hello BENR2423')
})


app.post('/login', async (req, res) => {
	console.log(req.body);

	let user = await User.login(req.body.username, req.body.password);
	if (user.status == 'Invalid username' || user.status == 'Invalid password') {
		res.status(401).send("Invalid username or password");
		return
	}

	res.status(200).json({
		_id: user._id,
		username: user.username,
	})
})

/**
 * @swagger
 * /login:
 *   post:
 *     description: User Login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: 
 *             type: object
 *             properties:
 *               username: 
 *                 type: string
 *               password: 
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful login
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Invalid username or password
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         _id: 
 *           type: string
 *         username: 
 *           type: string
 */

/**
 * @swagger
 * /visitor,{id}:
 *   get:
 *     description: Get visitor information
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Visitor ID
 */

app.post('/register', async (req, res) => {
	console.log(req.body);

	let user = await User.register(req.body.username, req.body.password);
	if (user.status == 'Duplicate username') {
		res.status(401).send("User already exits!");
		return
	}

	res.status(200).send("Register success!");

})

app.patch('/update', async (req, res) => {
	console.log(req.body);
	
	let user = await User.update(req.body.username, req.body.newusername);
	if (user.status == 'Invalid username') {
		res.status(401).send("Invalid username");
		return
	}

	res.status(200).send("Update success!");
})

app.delete('/delete', async (req, res) => {
	console.log(req.body);

	await User.delete(req.body.username);
	return res.status(200).send("Delete success!");
})

app.get('visitor/:id', async (req, res) => {
	console.log(req.params.id);
	res.status(200).json({})
	})

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`)
})
