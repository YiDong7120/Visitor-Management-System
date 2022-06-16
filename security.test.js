const MongoClient = require("mongodb").MongoClient;
const Security = require("./security")
const User = require("./user")

describe("Security Account", () => {
	let client;
	beforeAll(async () => {
		client = await MongoClient.connect(
			"mongodb+srv://m001-student:m001-mongodb-basics@sandbox.2ozfn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
			{ useNewUrlParser: true },
		);
		Security.injectDB(client);
		User.injectDB(client);
	})

	afterAll(async () => {
		await client.close();
	})

	test("New user registration", async () => {
		const res = await Security.register("Arif", "Password")
		expect(res).not.toBeUndefined();
	})

	test("Duplicate username", async () => {
		const res = await Security.register("Idzwan", "Password")
		expect(res.status).toBe("Duplicate username")
	})

	test("User login invalid username", async () => {
		const res = await Security.login("Idzy", "Password")
		expect(res.status).toBe("Invalid username")
	})

	test("User login invalid password", async () => {
		const res = await Security.login("Idzwan", "Password-fail")
		expect(res.status).toBe("Invalid password")
	})

	test("User login successfully", async () => {
		const res = await Security.login("Idzwan", "Password")
		expect(res).toEqual(
            expect.objectContaining({
                username: expect.any(String),
                password: expect.any(String),
            })
		);
    })

	test("Update username", async () => {
		const res = await Security.update("Idzwan", "Idzwan")
		expect(res.status).toBe("Updated")
	})

	test(("Delete security"), async () => {
		const res = await Security.delete("Arif")
		expect(res.status).toBe("Deleted")
	})

	test(("Read User"), async () => {
		const res = await Security.getUser("Idzwan")
		expect(res).not.toBeUndefined()
	})

	test("Read Visitor", async () => {
		const res = await Security.getVisitor(User.randomName)
		expect(res).not.toBeUndefined()
	})

})

