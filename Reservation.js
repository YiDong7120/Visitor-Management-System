const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://m001-student:m001-mongodb-basics@sandbox.2ozfn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
const { faker } = require('@faker-js/faker');
const randomId = faker.datatype.uuid();
const randomVehicle = faker.vehicle.vehicle();
const randomDate = faker.time.recent('date');
const randomPlate = faker.vehicle.vrm();

client.connect(async err => {
	if(err) {
		console.log(err.message)
		return
	}
	console.log('Connected to MongoDB');

console.time('Insert')

let result = await client.db('Visitor-Management-System').collection('Reservation').insertOne(
    {
        reserve_id: randomId,
        reserve_vehicle: randomVehicle,
        reserve_date: randomDate,
        reserve_plate: randomPlate,
    }
)
console.timeEnd('Insert')
console.log('Inserted 1 document', result);
});