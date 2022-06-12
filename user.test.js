const MongoClient = require("mongodb").MongoClient;
const User = require("./user")
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

const randomBookingId = faker.datatype.uuid();
const randomVehicle = faker.vehicle.vehicle();
const randomBookingDate = faker.time.recent('date');
const randomPlate = faker.vehicle.vrm();

describe("User Account", () => {
	let client;
	beforeAll(async () => {
		client = await MongoClient.connect(
			"mongodb+srv://m001-student:m001-mongodb-basics@sandbox.2ozfn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
			{ useNewUrlParser: true },
		);
		User.injectDB(client);
	})

	afterAll(async () => {
		await client.close();
	})

	test("New user registration", async () => {
		const res = await User.register("Arif", "Password")
		expect(res).not.toBeUndefined();
	})

	test("Duplicate username", async () => {
		const res = await User.register("Gan", "Password")
		expect(res.status).toBe("Duplicate username")
	})

	test("User login invalid username", async () => {
		const res = await User.login("Idz", "Drowssad")
		expect(res.status).toBe("Invalid username")
	})

	test("User login invalid password", async () => {
		const res = await User.login("Gan", "Password-fail")
		expect(res.status).toBe("Invalid password")
	})

	test("User login successfully", async () => {
		const res = await User.login("Gan", "Password")
		expect(res).toEqual(
            expect.objectContaining({
                username: expect.any(String),
                password: expect.any(String),
            })
		);
    })

	test("Update username", async () => {
		const res = await User.update("Gan", "Gan")
		expect(res.status).toBe("Updated")
	})

	test(("Delete user"), async () => {
		const res = await User.delete("Arif")
		expect(res.status).toBe("Deleted")
	})

	test("Create Visitor", async () => {
		const res = await User.addVisitor(randomId, randomName, randomAge, randomAddress, randomCity, randomEmail, randomPhone, randomIc, randomDate, randomBookingId)
		expect(res).not.toBeUndefined()
	})

	test("Duplicate visitor id", async () => {
		const res = await User.addVisitor(randomId, randomName, randomAge, randomAddress, randomCity, randomEmail, randomPhone, randomIc, randomDate, randomBookingId)
		expect(res.status).toBe("Duplicate visitor id")
	})

	test("Read Visitor", async () => {
		const res = await User.getVisitor(randomName)
		expect(res).not.toBeUndefined()
	})

	test("Delete Visitor", async () => {
		const res = await User.deleteVisitor(randomId)
		expect(res.status).toBe("Deleted")
	})

	test("Create Reservation", async () => {
		const res = await User.addReservation(randomBookingId, randomVehicle, randomBookingDate, randomPlate, randomId)
		expect(res).not.toBeUndefined()
	})

	test("Duplicate reservation id", async () => {
		const res = await User.addReservation(randomBookingId, randomVehicle, randomBookingDate, randomPlate, randomId)
		expect(res.status).toBe("Duplicate reservation id")
	})

	test("Read Reservation", async () => {
		const res = await User.getReservation(randomBookingId)
		expect(res).not.toBeUndefined()
	})

	test("Delete Reservation", async () => {
		const res = await User.deleteReservation(randomBookingId)
		expect(res.status).toBe("Deleted")
	})
});