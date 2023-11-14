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
        const comparison = String(a[sortField]).localeCompare(b[sortField], undefined, {sensitivity: 'base'})

        return sortOrder === 'asc' ? comparison : -comparison
      })

      const filterParams = {}
      // Check if there is at least one filter parameter in the request
      if (req.query.filter) {
        // If there is only one filter, add it to the filterParams object
        if (!Array.isArray(req.query.filter)) {
          filterParams[req.query.filter] = req.query[req.query.filter]
        } else {
          // If there are multiple filters, iterate over each filter and add them to the filterParams object
          req.query.filter.forEach(filterField => {
            // Check if the filter parameter exists in the request
            if (req.query[filterField]) {
              filterParams[filterField] = req.query[filterField]
            }
          })
        }
      }

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
