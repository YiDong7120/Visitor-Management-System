const MongoClient = require("mongodb").MongoClient;
const User = require("./user")

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
	});

	test(("Delete user"), async () => {
		const res = await User.delete("Arif")
		expect(res.status).toBe("Deleted")
	});
});