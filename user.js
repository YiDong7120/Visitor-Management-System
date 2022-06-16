const bcrypt = require("bcryptjs"); ///dist/bcrypt

let users;
let visitors;
let reservations;

class User {
	static async injectDB(conn) {
		users = await conn.db("Visitor-Management-System").collection("Users")
        visitors = await conn.db("Visitor-Management-System").collection("Visitors")
        reservations = await conn.db("Visitor-Management-System").collection("Reservations")
	}

////////////////////////////////////////////////////////////
//                                                        //
//                          User                          //
//                                                        //
////////////////////////////////////////////////////////////

    // Register User
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

    // Login User
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

    // Create Visitor
    static async addVisitor(randomId, randomName, randomAge, randomAddress, randomCity, randomEmail, randomPhone, randomIc, randomDate, randomBookingId) {

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
	}

    // Read Visitor
    static async getVisitor(randomId) {
        return await visitors.findOne({ visitor_id: randomId })
    }

    // Delete Visitor
    static async deleteVisitor(randomId) {
		await visitors.deleteOne({ visitor_id: randomId })
        return { status: "Deleted"};
    }

////////////////////////////////////////////////////////////
//                                                        //
//                      Reservation                       //
//                                                        //
////////////////////////////////////////////////////////////

    // Create Reservation
    static async addReservation(randomBookingId, randomVehicle, randomBookingDate, randomPlate, randomId) {

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
    }

    // Read Reservation
    static async getReservation(randomBookingId) {
        return await reservations.findOne({ reserve_id: randomBookingId })
    }

    // Delete Reservation
    static async deleteReservation(randomBookingId) {
        await reservations.deleteOne({ reserve_id: randomBookingId })
        return { status: "Deleted"};
    }
}
module.exports = User;