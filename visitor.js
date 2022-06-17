const ObjectId = require("mongodb").ObjectId;
let visitors;
let reservations;

class Visitor {
	static async injectDB(conn) {
        try {
            visitors = await conn.db("Visitor-Management-System").collection("Visitors")
            reservations = await conn.db("Visitor-Management-System").collection("Reservations")
	    } catch (e) {
            console.error(`Unable to establish collection handles in visitor: ${e}`)
        }
    }

    // Read Visitor
    static async getVisitor(visitorId) {
        try {

            return await visitors.findOne({ _id: new ObjectId(visitorId) })
        
        } catch (e) {
            console.error(`Error occurred while getting visitor, ${e}.`)
            return { error: e }
        }
    }

    // Read Reservation
    static async getReservation(reserveId) {
        try {

            return await reservations.findOne({ _id: new ObjectId(reserveId) })
        
        } catch (e) {
            console.error(`Error occurred while getting reservation, ${e}.`)
            return { error: e }
        }
    }
}
module.exports = Visitor;