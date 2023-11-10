import {faker} from '@faker-js/faker'
import supabase from './db.js'

async function populateUserData() {
  const numberOfUsers = 100
  const users = Array.from({length: numberOfUsers}, () => ({
    firstName: faker.person.fullName(),
    username: faker.internet.userName(),
    email: faker.internet.email(),
    location: faker.location.city(),
    company: faker.company.name(),
    registrationDate: faker.date.past()
  }))

  try {
    const {data, error} = await supabase.from('users').upsert(users)

    if (error) {
      console.error('Error inserting fake users:', error.message)
    } else {
      console.log('Fake users inserted successfully:', data)
    }
  } catch (err) {
    console.error('Error inserting fake users:', err.message)
  }
}

export default populateUserData
