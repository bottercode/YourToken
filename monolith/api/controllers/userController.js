import paginateResults from '../../utils/pagination.js'
import userModel from '../models/userModel.js'

class User {
  static async getUsers(req, res) {
    try {
      const {page = 1, limit = 10} = req.query

      const sortField = req.query.sort ?? 'name'
      const sortOrder = req.query.order ?? 'asc'

      const users = await userModel.getAllUsers()

      const sortedUsers = users.data.sort((a, b) => {
        if (a[sortField] < b[sortField]) {
          return sortOrder === 'asc' ? -1 : 1
        } else if (a[sortField] > b[sortField]) {
          return sortOrder === 'asc' ? 1 : -1
        } else {
          return 0
        }
      })

      const filterParams = req.query.filter ? {[req.query.filter]: req.query[req.query.filter]} : {}

      const filteredUsers = sortedUsers.filter(user => {
        for (const [key, value] of Object.entries(filterParams)) {
          const userValue = String(user[key]).toLowerCase()
          const filterValue = String(value).toLowerCase()
          console.log(`Key: ${key}, User Value: ${userValue}, Filter Value: ${filterValue}`)

          if (!userValue.includes(filterValue)) {
            return false
          }
        }
        return true
      })

      const paginatedUsers = paginateResults(filteredUsers, page, limit)

      res.json(paginatedUsers)
    } catch (err) {
      res.status(500).json({message: err.message})
    }
  }
}

export default User
