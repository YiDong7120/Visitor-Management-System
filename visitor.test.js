const MongoClient = require("mongodb").MongoClient;
const Visitor = require("./visitor")

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
		const res = await Visitor.getVisitor("628b5c72eda3a236e649420e");
		expect(res).not.toBeUndefined()
	})

	test("Read Reservation", async () => {
		const res = await Visitor.getVisitor("6288c1ddf09cf4a2f1656f61");
		expect(res).not.toBeUndefined()
	})
})

