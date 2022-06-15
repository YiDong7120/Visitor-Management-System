const MongoClient = require("mongodb").MongoClient;
const User = require("./user");
const Security = require("./security");
const Visitor = require("./visitor");
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
	Security.injectDB(client);
	Visitor.injectDB(client);
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
			title: 'Welcome to Hospital Visitor Management System',
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

////////////////////////////////////////////////////////////
//                                                        //
//                          User                          //
//                                                        //
////////////////////////////////////////////////////////////

app.post('/user/login', async (req, res) => {
	console.log(req.body);

	let user = await User.login(req.body.username, req.body.password);
	if (user.status == 'Invalid username' || user.status == 'Invalid password') {
		res.status(401).send("Invalid username or password");
		return
	}

	res.status(200).json({
		_id: user._id,
		username: user.username,
		// token:generateAccessToken({ _id: user._id, username: user.username })
	})
})

/**
 * @swagger
 * /user/login:
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

app.post('/user/register', async (req, res) => {
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
 * /user/register:
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

app.patch('/user/update', async (req, res) => {
	console.log(req.body);
	
	let user = await Security.updateUser(req.body.username, req.body.newusername);
	if (user.status == 'Invalid username') {
		res.status(401).send("Invalid username");
		return
	}

	res.status(200).send("Update success!");
})

/**
 * @swagger
 * /user/update:
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

app.delete('/user/delete', async (req, res) => {
	console.log(req.body);

	await Security.deleteUser(req.body.username);
	return res.status(200).send("Delete success!");
})

/**
 * @swagger
 * /user/delete:
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

app.delete('/user/deleteVisitor', async (req, res) => {
	console.log(req.body);

	await User.deleteVisitor(req.params.visitor_id);
	res.status(200).send("Delete success!");

})

app.delete('/user/deleteReservation', async (req, res) => {
	console.log(req.body);

	await User.deleteReservation(req.params.reservation_id);
	res.status(200).send("Delete success!");

})
/////////////////////////////////////////////////

app.post('/security/login', async (req, res) => {
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

/**
 * @swagger
 * /security/login:
 *   post:
 *     description: Security Login
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
 *               $ref: '#/components/schemas/Security'
 *       401:
 *         description: Invalid username or password
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Security:
 *       type: object
 *       properties:
 *         _id: 
 *           type: string
 *         username: 
 *           type: string
 */

app.post('/security/register', async (req, res) => {
	console.log(req.body);

	let user = await Security.register(req.body.username, req.body.password);
	if (user.status == 'Duplicate username') {
		res.status(401).send("User already exits!");
		return
	}

	res.status(200).send("Register success!");

})

/**
 * @swagger
 * /security/register:
 *   post:
 *     description: Security Register
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
 *               $ref: '#/components/schemas/Security'
 *       401:
 *         description: User already exits!
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Security:
 *       type: object
 *       properties:
 *         _id: 
 *           type: string
 *         username: 
 *           type: string
 */

app.patch('/security/update', async (req, res) => {
	console.log(req.body);
	
	let user = await Security.update(req.body.username, req.body.newusername);
	if (user.status == 'Invalid username') {
		res.status(401).send("Invalid username");
		return
	}

	res.status(200).send("Update success!");
})

/**
 * @swagger
 * /security/update:
 *   patch:
 *     description: Security Update
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
 *               $ref: '#/components/schemas/Security'
 *       401:
 *         description: Invalid username
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Security:
 *       type: object
 *       properties:
 *         _id: 
 *           type: string
 *         username: 
 *           type: string
 */

app.delete('/security/delete', async (req, res) => {
	console.log(req.body);

	await Security.delete(req.body.username);
	return res.status(200).send("Delete success!");
})

/**
 * @swagger
 * /security/delete:
 *   delete:
 *     description: Security Delete
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
 *               $ref: '#/components/schemas/Security'
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Security:
 *       type: object
 *       properties:
 *         _id: 
 *           type: string
 *         username: 
 *           type: string
 */

//////////////////////////////////////////////////////////////

// app.use(verifyToken);

// //Open to all
// app.get('/visitor/:id', async (req, res) => {
// 	console.log(req.body);

// 	let visitor = await User.getVisitor(req.params.visitor_id);
// 	res.status(200).json(visitor)

// })

app.get('visitor/:id', async (req, res) => {
	console.log(req.params.id);
	console.log(req.body);
	console.log(req.params);
	console.log(req.params.visitor_id);

	let visitor = await User.getVisitor(req.params.visitor_id);

	if (visitor)
		res.status(200).json(visitor);
	else
		res.status(404).send("Invalid visitor id");
	})
	
/**
 * @swagger
 * /visitor/{id}:
 *   get:
 *     description: Get visitor information
 *     parameters:
 *       - in: path
 *         name: visitor_id
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

// const jwt = require('jsonwebtoken'); 
// function generateAccessToken(payload) {
// return jwt.sign(payload, "my-super-secret", { expiresIn: '1h' }); 
// }

// function verifyToken(req, res, next) {
// 	const authHeader = req.headers['authorization'] 
// 	const token = authHeader && authHeader.split(' ')[1]

// 	if (token == null) return res.sendStatus(401)
// 	jwt.verify(token, "my-super-secret", (err, user) => { 
// 		console.log(err)

// 	if (err) return res.sendStatus(403) 
// 	req.user = user
// 	next () 
// 	})
// };