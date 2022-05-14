const MongoClient = require("mongodb").MongoClient;
const User = require("./user")

const testUser = {
  name: "Gan Aik Tong",
  email: "aiktong@gmail.com",
  password: "BENR2423",
}

const sessionUser = {
  user_id: testUser.email,
  jwt: "hello",
}

describe("User Management", () => {
	let client;
	beforeAll(async () => {
		client = await MongoClient.connect(
			"mongodb+srv://m001-student:m001-mongodb-basics@sandbox.2ozfn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
			{ useNewUrlParser: true },
		);
		await User.injectDB(client);
	})
  
	afterAll(async () => {
		await client.close();
	})

  test("it can add a new user to the database", async () => {
    const actual = await User.addUser(testUser)
    expect(actual.success).toBeTruthy()
    expect(actual.error).toBeUndefined()
    const user = await User.getUser(testUser.email)
    delete user._id
    expect(user).toEqual(testUser)
  }) 

  test("it returns an error when trying to register duplicate user", async () => {
    const expected = "A user with the given email already exists."
    const actual = await User.addUser(testUser.email)
    expect(actual.error).toBe(expected)
    expect(actual.success).toBeFalsy()
  })

  test("it allows a user to login", async () => {
    const actual = await User.loginUser(testUser.email, sessionUser.jwt)
    expect(actual.success).toBeTruthy()
    const sessionResult = await User.getUserSession(testUser.email)
    delete sessionResult._id
    expect(sessionResult).toEqual(sessionUser)
  })

  test("it allows a user to logout", async () => {
    const actual = await User.logoutUser(testUser.email)
    expect(actual.success).toBeTruthy()
    const sessionResult = await User.getUserSession(testUser.email)
    expect(sessionResult).toBeNull()
  })
})
