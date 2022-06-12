const MongoClient = require("mongodb").MongoClient;
const User = require("./user");
const Security = require("./security");
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
			title: 'Welcome to Gan Hospital Visitor Management System',
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
	res.send('Welcome to Gan Hospital Visitor Management System')
})

app.get('/hello', (req, res) => {
	res.send('Hello from BENR2423')
})

//User

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

app.post('/register', async (req, res) => {
	console.log(req.body);

	let user = await User.register(req.body.username, req.body.password);
	if (user.status == 'Duplicate username') {
		res.status(401).send("User already exits!");
		return
	}

	res.status(200).send("Register success!");

})

/**
 * @swagger
 * /register:
 *   post:
 *     description: User Register
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
 *         description: Register success!
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: User already exits!
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

app.patch('/update', async (req, res) => {
	console.log(req.body);
	
	let user = await User.update(req.body.username, req.body.newusername);
	if (user.status == 'Invalid username') {
		res.status(401).send("Invalid username");
		return
	}

	res.status(200).send("Update success!");
})

/**
 * @swagger
 * /update:
 *   patch:
 *     description: User Update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: 
 *             type: object
 *             properties:
 *               username: 
 *                 type: string
 *               newusername: 
 *                 type: string
 *     responses:
 *       200:
 *         description: Update success!
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Invalid username
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

app.delete('/delete', async (req, res) => {
	console.log(req.body);

	await User.delete(req.body.username);
	return res.status(200).send("Delete success!");
})

/**
 * @swagger
 * /delete:
 *   delete:
 *     description: User Delete
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: 
 *             type: object
 *             properties:
 *               username: 
 *                 type: string
 *     responses:
 *       200:
 *         description: Delete success!
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
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

app.delete('/deleteVisitor', async (req, res) => {
	console.log(req.body);

	await User.deleteVisitor(req.params.visitor_id);
	res.status(200).send("Delete success!");

})

app.delete('/deleteReservation', async (req, res) => {
	console.log(req.body);

	await User.deleteReservation(req.params.reservation_id);
	res.status(200).send("Delete success!");

})
/////////////////////////////////////////////////

app.post('/login', async (req, res) => {
	console.log(req.body);

	let user = await Security.login(req.body.username, req.body.password);
	if (user.status == 'Invalid username' || user.status == 'Invalid password') {
		res.status(401).send("Invalid username or password");
		return
	}

	res.status(200).json({
		_id: user._id,
		username: user.username,
	})
})

app.post('/register', async (req, res) => {
	console.log(req.body);

	let user = await Security.register(req.body.username, req.body.password);
	if (user.status == 'Duplicate username') {
		res.status(401).send("User already exits!");
		return
	}

	res.status(200).send("Register success!");

})

app.patch('/update', async (req, res) => {
	console.log(req.body);
	
	let user = await Security.update(req.body.username, req.body.newusername);
	if (user.status == 'Invalid username') {
		res.status(401).send("Invalid username");
		return
	}

	res.status(200).send("Update success!");
})

app.delete('/delete', async (req, res) => {
	console.log(req.body);

	await Security.delete(req.body.username);
	return res.status(200).send("Delete success!");
})

//Open to all
app.get('/visitor/:id', async (req, res) => {
	console.log(req.body);

	let visitor = await User.getVisitor(req.params.visitor_id);
	res.status(200).json(visitor)

})

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

app.get('/reservation/:id', async (req, res) => {
	console.log(req.body);

	let reservation = await User.getReservation(req.params.reservation_id);
	res.status(200).json(reservation)

})

/**
 * @swagger
 * /reservation,{id}:
 *   get:
 *     description: Get reservation information
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Reservation ID
 */

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`)
})