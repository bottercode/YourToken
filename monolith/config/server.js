import dotenv from 'dotenv'
dotenv.config()

const config = {}

config.PORT = Number(process.env.SERVER_PORT) ?? 80

export default config
