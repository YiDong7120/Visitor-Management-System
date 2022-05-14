const bcrypt = require("bcryptjs")
let users
let sessions

class User {
  static async injectDB(conn) {
    if (users && sessions) {
      return
    }
    try {
      users = await conn.db("Visitor-Management-System").collection("Users")
      sessions = await conn.db("Visitor-Management-System").collection("Sessions")
    } catch (e) {
      console.error(`Unable to establish collection handles in user: ${e}`)
    }
  }
//Find User
  static async getUser(email) {
    return await users.findOne({ email })
  }
  
//Register User
  static async addUser(userInfo) {
    try {
      const { name, email, password } = userInfo
      const hashPassword = await bcrypt.hash(password, 10)
      await users.insertOne({ name, email, password: hashPassword }, {w: 'majority'})
      return { success: true }
    } catch (e) {
      if ( users.email == userInfo.email ) {
        return { error: "A user with the given email already exists." }
      }
      console.error(`Error occurred while adding new user, ${e}.`)
      return { error: e }
    }
  }
//Login User
  static async loginUser(email, jwt) {
    try {
      await sessions.updateOne(
        { "user_id": email },
        { $set: { jwt } },
        { upsert: true }
      )
      return { success: true }
    } catch (e) {
      console.error(`Error occurred while logging in user, ${e}`)
      return { error: e }
    }
  }
// //Logout User
  static async logoutUser(email) {
    try {
      await sessions.deleteOne({ "user_id": email })
      return { success: true }
    } catch (e) {
      console.error(`Error occurred while logging out user, ${e}`)
      return { error: e }
    }
  }
//Find Login
  static async getUserSession(email) {
    try {
      return sessions.findOne({ "user_id": email })
    } catch (e) {
      console.error(`Error occurred while retrieving user session, ${e}`)
      return null
    }
  }
//Delete User
  static async deleteUser(email) {
    try {
      await users.deleteOne({ email })
      await sessions.deleteOne({ user_id: email })
      if (!(await this.getUser(email)) && !(await this.getUserSession(email))) {
        return { success: true }
      } else {
        console.error(`Deletion unsuccessful`)
        return { error: `Deletion unsuccessful` }
      }
    } catch (e) {
      console.error(`Error occurred while deleting user, ${e}`)
      return { error: e }
    }
  }
}

module.exports = User;