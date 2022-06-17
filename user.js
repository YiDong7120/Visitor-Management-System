const bcrypt = require("bcryptjs"); ///dist/bcrypt

let users;
let visitors;
let reservations;

class User {
	static async injectDB(conn) {
        try {
		    users = await conn.db("Visitor-Management-System").collection("Users")
            visitors = await conn.db("Visitor-Management-System").collection("Visitors")
            reservations = await conn.db("Visitor-Management-System").collection("Reservations")
	    }catch (e) {
            console.error(`Unable to establish collection handles in user: ${e}`)
        }
}

////////////////////////////////////////////////////////////
//                                                        //
//                          User                          //
//                                                        //
////////////////////////////////////////////////////////////

    // Register User
	static async register(username, password) {
        try {

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

	    } catch (e) {
            console.error(`Error occurred while registering new user, ${e}.`)
            return { error: e }
        }
    }

    // Login User
	static async login(username, password) {
        try {

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

        } catch (e) {
            console.error(`Error occurred while logging in user, ${e}`)
            return { error: e }
        }
    }

    // Update User
    static async updateUser(username, newusername) {
        try {

            // TODO: Check if username exists
            const user = await users.findOne({ username: username })
            if(!user) {
                return { status: "Invalid username" }
            }
    
            await users.updateOne({ username: username }, { $set: { username: newusername }})
            return { status: "Updated" }

        } catch (e) {
            console.error(`Error occurred while updating user, ${e}`)
            return { error: e }
        }
    }
    
    // Delete User
    static async deleteUser(username) {
        try {

            await users.deleteOne({ username: username })
            return { status: "Deleted"};

        } catch (e) {
            console.error(`Error occurred while deleting user, ${e}`)
            return { error: e }
        }
    }
    
////////////////////////////////////////////////////////////
//                                                        //
//                        Visitor                         //
//                                                        //
////////////////////////////////////////////////////////////

    // Create Visitor
    static async addVisitor(randomId, randomName, randomAge, randomAddress, randomCity, randomEmail, randomPhone, randomIc, randomDate, randomBookingId) {
        try {

            // TODO: Check if visitor id exists
            const duplicate = await visitors.findOne({ visitor_id: randomId })
            if (duplicate) {
                return { status: "Duplicate visitor id" }
            }

            //Generate Visitor
            return await visitors.insertOne({
                visitor_id: randomId,
                visitor_name: randomName,
                visitor_age: randomAge,
                visitor_address: randomAddress,
                visitor_city: randomCity,
                visitor_email: randomEmail,
                visitor_phone: randomPhone,
                visitor_ic: randomIc,
                visitor_date: randomDate,
                reserve_id: randomBookingId
            })

	    } catch (e) {
            console.error(`Error occurred while adding visitor, ${e}`)
            return { error: e }
        }
    }

    // Read Visitor
    static async getVisitor(randomId) {
        try{

            return await visitors.findOne({ visitor_id: randomId })

        } catch (e) {
            console.error(`Error occurred while getting visitor, ${e}`)
            return { error: e }
        }
    }

    // Delete Visitor
    static async deleteVisitor(randomId) {
        try {

		    await visitors.deleteOne({ visitor_id: randomId })
            return { status: "Deleted"};

        } catch (e) {
            console.error(`Error occurred while deleting visitor, ${e}`)
            return { error: e }
        }
    }

////////////////////////////////////////////////////////////
//                                                        //
//                      Reservation                       //
//                                                        //
////////////////////////////////////////////////////////////

    // Create Reservation
    static async addReservation(randomBookingId, randomVehicle, randomBookingDate, randomPlate, randomId) {
        try {
            const duplicate = await reservations.findOne({ reserve_id: randomBookingId })
            if (duplicate) {
                return { status: "Duplicate reservation id" }
            }

            //Generate Reservation
            return await reservations.insertOne({
                reserve_id: randomBookingId,
                reserve_vehicle: randomVehicle,
                reserve_date: randomBookingDate,
                reserve_plate: randomPlate,
                visitor_id: randomId
            })

        } catch (e) {
            console.error(`Error occurred while adding reservation, ${e}`)
            return { error: e }
        }
    }

    // Read Reservation
    static async getReservation(randomBookingId) {
        try{

            return await reservations.findOne({ reserve_id: randomBookingId })

        } catch (e) {
            console.error(`Error occurred while getting reservation, ${e}`)
            return { error: e }
        }
    }

    // Delete Reservation
    static async deleteReservation(randomBookingId) {
        try {

            await reservations.deleteOne({ reserve_id: randomBookingId })
            return { status: "Deleted"};

        } catch (e) {
            console.error(`Error occurred while deleting reservation, ${e}`)
            return { error: e }
        }
    }
}
module.exports = User;