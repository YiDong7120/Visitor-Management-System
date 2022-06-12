const MongoClient = require("mongodb").MongoClient;
const Visitor = require("./visitor")
const User = require("./user")

describe("Visitor Account", () => {
	let client;
	beforeAll(async () => {
		client = await MongoClient.connect(
			"mongodb+srv://m001-student:m001-mongodb-basics@sandbox.2ozfn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
			{ useNewUrlParser: true },
		);
		Visitor.injectDB(client);
	})

	afterAll(async () => {
		await client.close();
	})

	test("Read Visitor", async () => {
		const res = await Visitor.getVisitor(User.randomId)
		expect(res).not.toBeUndefined()
	})

	test("Read Reservation", async () => {
		const res = await Visitor.getReservation(User.randomBookingId)
		expect(res).not.toBeUndefined()
	})
})

