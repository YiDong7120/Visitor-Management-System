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
		openapi: '3.0.3',
		info: {
			title: 'Hospital Visitor Management System',
			version: '1.0.0',
			description: 'For academic purposes only! - BENR 2423 Database and Cloud System'
		},
	},
	host: 'localhost:3000',
    basePath: '/',
	apis: ['./main.js'],
	components: {
		securitySchemes: {
		  BearerAuth: {
			type: "http",
			scheme: "bearer",
			in: "header",
			bearerFormat: "JWT"
		  },
		}
	  }
	  ,
	  security: [{
		BearerAuth: []
	  }],
	swagger: "2.0",
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
		token:generateAccessToken({ _id: user._id, username: user.username })
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
	
	let user = await User.updateUser(req.body.username, req.body.newusername);
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

	await User.deleteUser(req.body.username);
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

	await User.deleteVisitor(req.body.visitor_id);
	res.status(200).send("Delete success!");

})

/**
 * @swagger
 * /user/deleteVisitor:
 *   delete:
 *     description: Visitor Delete
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
 *               $ref: '#/components/schemas/Visitor'
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
 *         visitor_name: 
 *           type: string
 */

app.delete('/user/deleteReservation', async (req, res) => {
	console.log(req.body);

	await User.deleteReservation(req.body.reservation_id);
	res.status(200).send("Delete success!");

})

/**
 * @swagger
 * /user/deleteReservation:
 *   delete:
 *     description: Reservation Delete
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
 *               $ref: '#/components/schemas/Reservation'
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
 */

////////////////////////////////////////////////////////////
//                                                        //
//                       Security                         //
//                                                        //
////////////////////////////////////////////////////////////

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
		token:generateAccessToken({ _id: user._id, username: user.username })
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

////////////////////////////////////////////////////////////
//                                                        //
//            View Information (Open to all)              //
//                                                        //
////////////////////////////////////////////////////////////

app.get('/visitor/:id', async (req, res) => {
	console.log(req.body);

	let visitor = await Visitor.getVisitor(req.params.id);
	res.status(200).json(visitor)

})

/**
 * @swagger
 * /visitor/{id}:
 *   get:
 *     description: Get visitor information
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Visitor ID
 *     responses:
 *       200:
 *         description: Visitor Information
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Visitor'
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

	let reservation = await Visitor.getReservation(req.params.id);
	res.status(200).json(reservation)

})

/**
 * @swagger
 * /reservation/{id}:
 *   get:
 *     description: Get reservation information
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Reservation ID
 *     responses:
 *       200:
 *         description: Reservation Information
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reservation'
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

app.use(verifyToken);

 app.get('/user/:id', async (req, res) => {
	console.log(req.body);
	console.log(req.security);

	if(req.security.role == 'Admin') {

		let user = await Security.getUser(req.params.id);

		if (user)
			res.status(200).json(user)
		else
			res.status(404).send("Invalid User Id");

	} else {

		res.status(403).send('Unauthorized')

	}
})

/**
 * @swagger
 * tags:
 *   name: admin only
 *   description: APIs for security to handle user resources.
 */

/**
 * @swagger
 * /user/{id}:
 *   get:
 *     summary: Retrieves a user
 *     tags: [admin only]
 *     parameters:
 *     - in: path
 *       name: id
 *       schema:
 *         type: string
 *       required: true
 *       description: User ID
 *     security:
 *       - earerAuth: []
 *     responses:
 *       200:
 *         description: Authorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
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