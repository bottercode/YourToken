import paginateResults from '../../utils/pagination.js'
import userModel from '../models/userModel.js'

class User {
  static async getUsers(req, res) {
    try {
      const {page = 1, limit = 10} = req.query

      const sortField = req.query.sort ?? 'name'
      const sortOrder = req.query.order ?? 'asc'

      const users = await userModel.getAllUsers()

      console.log('In controller', users.data)
      const sortedUsers = users.data.sort((a, b) => {
        if (a[sortField] < b[sortField]) {
          return sortOrder === 'asc' ? -1 : 1
        } else if (a[sortField] > b[sortField]) {
          return sortOrder === 'asc' ? 1 : -1
        } else {
          return 0
        }
      })

      const filterParams = req.query.filter ?? {}
      const filteredUsers = sortedUsers.filter(user => {
        for (const [key, value] of Object.entries(filterParams)) {
          if (user[key] !== value) {
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
