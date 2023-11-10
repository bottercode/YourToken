import dotenv from 'dotenv'
dotenv.config()

const db = {}

db.URL = process.env.SUPABASE_URL
db.KEY = process.env.SUPABASE_KEY

export default db
