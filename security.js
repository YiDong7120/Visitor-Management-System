const bcrypt = require("bcryptjs/dist/bcrypt");

let security;
let users;
let visitors;

class Security {
	static async injectDB(conn) {
        security = await conn.db("Visitor-Management-System").collection("Security")
		users = await conn.db("Visitor-Management-System").collection("Users")
        visitors = await conn.db("Visitor-Management-System").collection("Visitors")
	}

////////////////////////////////////////////////////////////
//                                                        //
//                       Security                         //
//                                                        //
////////////////////////////////////////////////////////////

    // Register Security
	static async register(username, password) {

        // TODO: Check if username exists
        const duplicate = await security.findOne({ username: username })
        if (duplicate) {
            return { status: "Duplicate username" }
        }

        // TODO: Hash password
        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(password, salt)
	
        // TODO: Save user to database
        return await security.insertOne({
            username: username,
            password: hashed,
        });  
	}

    // Login Security
	static async login(username, password) {

	    // TODO: Check if username exists
        const user = await security.findOne({ username: username })
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

    //Update Security
    static async update(username, newusername) {
        
    // TODO: Check if username exists
    const user = await security.findOne({ username: username })
    if(!user) {
        return { status: "Invalid username" }
    }

        await security.updateOne({ username: username }, { $set: { username: newusername }})
        return { status: "Updated" }
    }    
    
    // Delete Security
    static async delete(username) {
        await security.deleteOne({ username: username })
        return { status: "Deleted"};
    }    

////////////////////////////////////////////////////////////
//                                                        //
//                          User                          //
//                                                        //
////////////////////////////////////////////////////////////
    
    // Read User
    static async getUser(username) {
        const user = await users.findOne({ username: username })
        if(!user) {
            return { status: "Invalid username" }
        }
        return user;
    }
    
    // Update User
    static async updateUser(username, newusername) {
        
        // TODO: Check if username exists
        const user = await users.findOne({ username: username })
        if(!user) {
            return { status: "Invalid username" }
        }
    
            await users.updateOne({ username: username }, { $set: { username: newusername }})
            return { status: "Updated" }
        }
    
    // Delete User
    static async deleteUser(username) {
        await users.deleteOne({ username: username })
        return { status: "Deleted"};
    }
        
////////////////////////////////////////////////////////////
//                                                        //
//                        Visitor                         //
//                                                        //
////////////////////////////////////////////////////////////

    // Read Visitor
    static async getVisitor(randomName) {
        return await visitors.findOne({ visitor_name: randomName })
    }
}

module.exports = Security;