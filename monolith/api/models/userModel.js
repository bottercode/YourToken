import supabase from '../../utils/db.js'
import populateUserData from '../../utils/seed.js'

class UserModel {
  async init() {
    await populateUserData()
  }

  async getAllUsers() {
    const users = await supabase.from('users').select()

    return users
  }
}

export default new UserModel()
