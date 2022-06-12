let visitors;
let reservations;

class Visitor {
	static async injectDB(conn) {
        visitors = await conn.db("Visitor-Management-System").collection("Visitors")
        reservations = await conn.db("Visitor-Management-System").collection("Reservations")
	}

    // Read Visitor
    static async getVisitor(randomId) {
        return await visitors.findOne({ visitor_id: randomId })
    }

    // Read Reservation
    static async getReservation(randomBookingId) {
        return await reservations.findOne({ reserve_id: randomBookingId })
    }
}
module.exports = Visitor;