const ObjectId = require("mongodb").ObjectId;
const bcrypt = require("bcryptjs/dist/bcrypt");

let security;
let users;
let visitors;

class Security {
	static async injectDB(conn) {
        try {
            security = await conn.db("Visitor-Management-System").collection("Security")
		    users = await conn.db("Visitor-Management-System").collection("Users")
            visitors = await conn.db("Visitor-Management-System").collection("Visitors")
	    } catch (e) {
            console.error(`Unable to establish collection handles in security: ${e}`)
        }
    }

////////////////////////////////////////////////////////////
//                                                        //
//                       Security                         //
//                                                        //
////////////////////////////////////////////////////////////

    // Register Security
	static async register(username, password) {
        try {

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

	    } catch (e) {
            console.error(`Error occurred while registering new security, ${e}.`)
            return { error: e }
        }
    }

    // Login Security
	static async login(username, password) {
        try {

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

        } catch (e) {
            console.error(`Error occurred while logging in security, ${e}.`)
            return { error: e }
        }
    }

    //Update Security
    static async update(username, newusername) {
        try {

            // TODO: Check if username exists
            const user = await security.findOne({ username: username })
            if(!user) {
                return { status: "Invalid username" }
            }

                await security.updateOne({ username: username }, { $set: { username: newusername }})
                return { status: "Updated" }

        } catch (e) {
            console.error(`Error occurred while updating security, ${e}.`)
            return { error: e }
        }
    }
    
    // Delete Security
    static async delete(username) {
        try {

            await security.deleteOne({ username: username })
            return { status: "Deleted"};

        } catch (e) {
            console.error(`Error occurred while deleting security, ${e}.`)
            return { error: e }
        }
    }

////////////////////////////////////////////////////////////
//                                                        //
//                          User                          //
//                                                        //
////////////////////////////////////////////////////////////
    
    // Read User
    static async getUser(userId) {
        try {

            const user = await users.findOne({ _id: new ObjectId(userId) })
            if(!user) {
                return { status: "Invalid Id" }
            }
            return await users.findOne({ _id: new ObjectId(userId) })

        } catch (e) {
            console.error(`Error occurred while getting user, ${e}.`)
            return { error: e }
        }
    }
}
        
module.exports = Security;