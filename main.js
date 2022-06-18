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
			title: 'Hospital Visitor Management System',
			version: '1.0.0',
			description: 'For academic purposes only! - BENR 2423 Database and Cloud System'
		},
		components: {
			securitySchemes: {
		  		bearerAuth: {
				type: "http",
				scheme: "bearer",
				in: "header",
				bearerFormat: "JWT"
		  		}
			}
	  	},
	  	// security: [{
		// 	bearerAuth: []
	  	// }],
	},
	apis: ['./main.js'],
};

const swaggerSpec = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.get('/', (req, res) => {
	res.send('Welcome to G4 Hospital Visitor Management System')
})

app.get('/hello', (req, res) => {
	res.send('Hello from BENR2423')
})

////////////////////////////////////////////////////////////
//                                                        //
//                          User                          //
//                                                        //
////////////////////////////////////////////////////////////

/**
 * @swagger
 * tags:
 *   name: User
 *   description: APIs for user to handle resources.
 */

app.post('/user/login', async (req, res) => {
	console.log(req.body);
	try {

		let user = await User.login(req.body.username, req.body.password);
		if (user.status == 'Invalid username' || user.status == 'Invalid password') {
			res.status(401).send("Invalid username or password");
			return
		}

		res.status(200).json({
			_id: user._id,
			username: user.username,
			role: user.role,
			token:generateAccessToken({ _id: user._id, username: user.username, role: user.role })
		})

	} catch (e) {
		console.error(`Internal server error, ${e}`)
		res.status(500).json(e)
	}
})

/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: Login existing user
 *     description: User Login
 *     tags: [User]
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
 *       500:
 *         description: Internal server error
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
	try {

		let user = await User.register(req.body.username, req.body.password);
		if (user.status == 'Duplicate username') {
			res.status(401).send("User already exits!");
			return
		}

		res.status(200).send("Register success!");

	} catch (e) {
		console.error(`Internal server error, ${e}`)
		res.status(500).json(e)
	}
})

/**
 * @swagger
 * /user/register:
 *   post:
 *     summary: Register new user
 *     description: User Register
 *     tags: [User]
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
 *       500:
 *         description: Internal server error
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
	try {

		let user = await User.updateUser(req.body.username, req.body.newusername);
		if (user.status == 'Invalid username') {
			res.status(401).send("Invalid username");
			return
		}

		res.status(200).send("Update success!");

	} catch (e) {
		console.error(`Internal server error, ${e}`)
		res.status(500).json(e)
	}
})

/**
 * @swagger
 * /user/update:
 *   patch:
 *     summary: Update user's username
 *     description: User Update
 *     tags: [User]
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
 *       500:
 *         description: Internal server error
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
	try {

		await User.deleteUser(req.body.username);
		return res.status(200).send("Delete success!");

	} catch (e) {
		console.error(`Internal server error, ${e}`)
		res.status(500).json(e)
	}
})

/**
 * @swagger
 * /user/delete:
 *   delete:
 *     summary: Delete user
 *     description: User Delete
 *     tags: [User]
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
 *       500:
 *         description: Internal server error
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
	try {

		await User.deleteVisitor(req.body.visitor_id);
		res.status(200).send("Delete success!");

	} catch (e) {
		console.error(`Internal server error, ${e}`)
		res.status(500).json(e)
	}
})

/**
 * @swagger
 * /user/deleteVisitor:
 *   delete:
 *     summary: Delete visitor
 *     description: Visitor Delete
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: 
 *             type: object
 *             properties:
 *               visitor_id: 
 *                 type: string
 *     responses:
 *       200:
 *         description: Delete success!
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Visitor'
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Visitor:
 *       type: object
 *       properties:
 *         _id: 
 *           type: string
 *         visitor_id: 
 *           type: string
 *         visitor_name:
 *           type: string
 *         visitor_age:
 *           type: string
 *         visitor_address:
 *           type: string
 *         visitor_city:
 *           type: string
 *         visitor_email:
 *           type: string
 *         visitor_phone:
 *           type: string
 *         visitor_ic:
 *           type: string
 *         visitor_date:
 *           type: string
 *         reserve_id:
 *           type: string
 */

app.delete('/user/deleteReservation', async (req, res) => {
	console.log(req.body);
	try {

		await User.deleteReservation(req.body.reservation_id);
		res.status(200).send("Delete success!");

	} catch (e) {
		console.error(`Internal server error, ${e}`)
		res.status(500).json(e)

	}
})

/**
 * @swagger
 * /user/deleteReservation:
 *   delete:
 *     summary: Delete reservation
 *     description: Reservation Delete
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: 
 *             type: object
 *             properties:
 *               reservation_id: 
 *                 type: string
 *     responses:
 *       200:
 *         description: Delete success!
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reservation'
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Reservation:
 *       type: object
 *       properties:
 *         _id: 
 *           type: string
 *         reserve_id: 
 *           type: string
 *         reserve_vehicle: 
 *           type: string
 *         reserve_date: 
 *           type: string
 *         reserve_plate: 
 *           type: string
 *         visitor_id: 
 *           type: string
 */

////////////////////////////////////////////////////////////
//                                                        //
//                       Security                         //
//                                                        //
////////////////////////////////////////////////////////////

/**
 * @swagger
 * tags:
 *   name: Security
 *   description: APIs for security to handle resources.
 */

app.post('/security/login', async (req, res) => {
	console.log(req.body);
	try {

		let user = await Security.login(req.body.username, req.body.password);
		if (user.status == 'Invalid username' || user.status == 'Invalid password') {
			res.status(401).send("Invalid username or password");
			return
		}

		res.status(200).json({
			_id: user._id,
			username: user.username,
			role: user.role,
			token:generateAccessToken({ _id: user._id, username: user.username, role: user.role })
		})

	} catch (e) {
		console.error(`Internal server error, ${e}`)
		res.status(500).json(e)
	}
})

/**
 * @swagger
 * /security/login:
 *   post:
 *     summary: Login existing security
 *     description: Security Login
 *     tags: [Security]
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
 *       500:
 *         description: Internal server error
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
	try {

		let user = await Security.register(req.body.username, req.body.password);
		if (user.status == 'Duplicate username') {
			res.status(401).send("User already exits!");
			return
		}

		res.status(200).send("Register success!");

	} catch (e) {
		console.error(`Internal server error, ${e}`)
		res.status(500).json(e)
	}
})

/**
 * @swagger
 * /security/register:
 *   post:
 *     summary: Register new security
 *     description: Security Register
 *     tags: [Security]
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
 *       500:
 *         description: Internal server error
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
	try {
		let user = await Security.update(req.body.username, req.body.newusername);
		if (user.status == 'Invalid username') {
			res.status(401).send("Invalid username");
			return
		}

		res.status(200).send("Update success!");

	} catch (e) {
		console.error(`Internal server error, ${e}`)
		res.status(500).json(e)
	}
})

/**
 * @swagger
 * /security/update:
 *   patch:
 *     summary: Update security's username
 *     description: Security Update
 *     tags: [Security]
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
 *       500:
 *         description: Internal server error
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
	try {

		await Security.delete(req.body.username);
		return res.status(200).send("Delete success!");

	} catch (e) {
		console.error(`Internal server error, ${e}`)
		res.status(500).json(e)
	}
})

/**
 * @swagger
 * /security/delete:
 *   delete:
 *     summary: Delete security
 *     description: Security Delete
 *     tags: [Security]
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
 *       500:
 *         description: Internal server error
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

////////////////////////////////////////////////////////////
//                                                        //
//            View Information (Open to all)              //
//                                                        //
////////////////////////////////////////////////////////////

/**
 * @swagger
 * tags:
 *   name: Everyone
 *   description: APIs for Everyone to handle resources.
 */

app.get('/visitor/:id', async (req, res) => {
	console.log(req.body);
	try {

		let visitor = await Visitor.getVisitor(req.params.id);
		res.status(200).json(visitor)

	} catch (e) {
		console.error(`Internal server error, ${e}`)
		res.status(500).json(e)
	}
})

/**
 * @swagger
 * /visitor/{id}:
 *   get:
 *     summary: View visitor information
 *     description: Get visitor information
 *     tags: [Everyone]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Visitor Object/Session ID
 *     responses:
 *       200:
 *         description: Visitor Information
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Visitor'
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Visitor:
 *       type: object
 *       properties:
 *         _id: 
 *           type: string
 *         visitor_id: 
 *           type: string
 *         visitor_name:
 *           type: string
 *         visitor_age:
 *           type: string
 *         visitor_address:
 *           type: string
 *         visitor_city:
 *           type: string
 *         visitor_email:
 *           type: string
 *         visitor_phone:
 *           type: string
 *         visitor_ic:
 *           type: string
 *         visitor_date:
 *           type: string
 *         reserve_id:
 *           type: string
 */

app.get('/reservation/:id', async (req, res) => {
	console.log(req.body);
	try {

		let reservation = await Visitor.getReservation(req.params.id);
		res.status(200).json(reservation)
	
	} catch (e) {
		console.error(`Internal server error, ${e}`)
		res.status(500).json(e)
	}
})

/**
 * @swagger
 * /reservation/{id}:
 *   get:
 *     summary: View reservation information
 *     description: Get reservation information
 *     tags: [Everyone]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Reservation Object/Session ID
 *     responses:
 *       200:
 *         description: Reservation Information
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reservation'
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Reservation:
 *       type: object
 *       properties:
 *         _id: 
 *           type: string
 *         reserve_id: 
 *           type: string
 *         reserve_vehicle: 
 *           type: string
 *         reserve_date: 
 *           type: string
 *         reserve_plate: 
 *           type: string
 *         visitor_id: 
 *           type: string
 */

////////////////////////////////////////////////////////////
//                                                        //
//          View Information (Authorised only)            //
//                                                        //
////////////////////////////////////////////////////////////

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: APIs for Admin to handle resources.
 */

app.use(verifyToken);

app.get('/user/:id', async (req, res) => {
	console.log(req.user);
	try {

		if(req.user.role == 'Admin') {

			let user = await Security.getUser(req.params.id);

			if (user)
				res.status(200).json(user)
			else
				res.status(404).send("Invalid User Id");

		} else {

			res.status(403).send('Unauthorized')

		}
	} catch (e) {
		console.error(`Internal server error, ${e}`)
		res.status(500).json(e)
	}
})

/**
 * @swagger
 * /user/{id}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: View user information
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: User Object/Session ID
 *     responses:
 *       200:
 *         description: User Information
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       403:
 *         description: Unauthorized
 *       404:
 *         description: Invalid User Id
 *       500:
 *         description: Internal server error
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

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`)
})

const jwt = require('jsonwebtoken'); 
function generateAccessToken(payload) {
return jwt.sign(payload, "my-super-secret", { expiresIn: '1h' }); 
}

function verifyToken(req, res, next) {
	const authHeader = req.headers['authorization'] 
	const token = authHeader && authHeader.split(' ')[1]

	if (token == null) return res.sendStatus(401)
	jwt.verify(token, "my-super-secret", (err, user) => { 
		console.log(err)

	if (err) return res.sendStatus(403) 
	req.user = user
	next () 
	})
};