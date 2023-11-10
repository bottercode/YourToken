import {createClient} from '@supabase/supabase-js'
import db from '../config/db.js'

const supabaseUrl = db.URL
const supabaseKey = db.KEY

const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase
