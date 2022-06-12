const bcrypt = require("bcryptjs"); ///dist/bcrypt

let users;

class User {
	static async injectDB(conn) {
		users = await conn.db("Visitor-Management-System").collection("Users")
	}

	static async register(username, password) {

        // TODO: Check if username exists
        const duplicate = await users.findOne({ username: username })
        if (duplicate) {
            return { status: "Duplicate username" }
        }

        // TODO: Hash password
        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(password, salt)
	
        // TODO: Save user to database
        return await users.insertOne({
            username: username,
            password: hashed,
        });  
	}

	static async login(username, password) {

	// TODO: Check if username exists
    const user = await users.findOne({ username: username })
    if(!user) {
        return { status: "Invalid username" }
    }

	// TODO: Validate password
    const valid = await bcrypt.compare(password, user.password)
    if(!valid) {
        return { status: "Invalid password"}
    }
      
	// TODO: Return user object
       return user;

    }

    //Update 
    static async update(username, newusername) {
        
    // TODO: Check if username exists
    const user = await users.findOne({ username: username })
    if(!user) {
        return { status: "Invalid username" }
    }

        await users.updateOne({ username: username }, { $set: { username: newusername }})
        return { status: "Updated" }
    }

    // Delete
    static async delete(username) {
		await users.deleteOne({ username: username })
        return { status: "Deleted"};
    }
}
module.exports = User;