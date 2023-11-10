import userModel from './api/models/userModel.js'
import app from './app.js'
import config from './config/server.js'
const PORT = config.PORT

userModel.init()

app.listen(PORT, () => {
  console.log(`🏋️ Your-Token server listening on port ${PORT}`)
})
