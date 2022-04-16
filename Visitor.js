const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://m001-student:m001-mongodb-basics@sandbox.2ozfn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
const { faker } = require('@faker-js/faker');
const randomId = faker.datatype.uuid();
const randomName = faker.name.findName(); 
const randomAge = faker.datatype.number({ min: 18, max: 60 });
const randomAddress = faker.address.streetAddress(true);
const randomCity = faker.address.city();
const randomEmail = faker.internet.email(); 
const randomPhone = faker.phone.phoneNumber('+01#-#######');
const randomIc = faker.phone.phoneNumber('######-##-####');
const randomDate = faker.time.recent('date')
const randomPatientId = faker.random.alphaNumeric(8);
const randomPatientName = faker.name.findName();
const randomPatientAge = faker.datatype.number({ min: 18, max: 60 });
const randomPatientIc = faker.phone.phoneNumber('######-##-####');
const randomBlock = faker.random.alpha({ count: 1, upcase: true, bannedChars: ['m','n','o','p','q','r','s','t','u','w','x','y','z'] })
const randomFloor = faker.datatype.number({ min: 1, max: 10 });
const randomRoom = faker.datatype.number({ min: 1, max: 100 });

client.connect(async err => {
	if(err) {
		console.log(err.message)
		return
	}
	console.log('Connected to MongoDB');

console.time('Insert')

let result = await client.db('Visitor-Management-System').collection('Visitor').insertOne(
    {
        visitor_id: randomId,
        visitor_name: randomName,
        visitor_age: randomAge,
		visitor_address: randomAddress,
        visitor_city: randomCity,
        visitor_email: randomEmail,
		visitor_phone: randomPhone,
		visitor_ic: randomIc,
        visitor_date: randomDate,
        patient_id: randomPatientId,
        patient_name: randomPatientName,
        patient_age: randomPatientAge,
        patient_ic: randomPatientIc,
        patient_block: randomBlock,
        patient_floor: randomFloor,
        patient_room: randomRoom,
    }
)
console.timeEnd('Insert')
console.log('Inserted 1 document', result);
});