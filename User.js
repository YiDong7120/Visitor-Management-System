const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://m001-student:m001-mongodb-basics@sandbox.2ozfn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
const { faker } = require('@faker-js/faker');
const bcrypt = require("bcryptjs");
const randomId = faker.datatype.uuid();
const randomName = faker.name.findName(); 
const randomAge = faker.datatype.number({ min: 18, max: 60 });
const randomAddress = faker.address.streetAddress(true);
const randomCity = faker.address.city();
const randomEmail = faker.internet.email(); 
const randomPhone = faker.phone.phoneNumber('01# - ### ####');
const password = "mypass123"
const saltRounds = 10

client.connect(async err => {
	if(err) {
		console.log(err.message)
		return
	}
	console.log('Connected to MongoDB');

console.time('Insert')
const hash = await bcrypt.hash(password, saltRounds);
let result = await client.db('Visitor-Management-System').collection('User').insertOne(
    {
        user_id: randomId,
        user_name: randomName,
        user_age: randomAge,
		user_address: randomAddress,
        user_city: randomCity,
        user_email: randomEmail,
		user_phone: randomPhone,
		user_pass: hash,
    }
)
console.timeEnd('Insert')
console.log('Inserted 1 document', result);
});