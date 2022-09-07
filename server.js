const express = require('express')
const app = express()
const mongoose = require('mongoose') // Allows usage of models and database access
const passport = require('passport') // For authentication and strategies
const session = require('express-session') // Creates sessions/cookies for logins so it can keep users logged in
const MongoStore = require('connect-mongo')(session) // Cookie storage in DB
const flash = require('express-flash') // Flashes error messages. Ex: invalid password or email
const logger = require('morgan') // Logs server-side events
const connectDB = require('./config/database') // Connects to MongoDB
const mainRoutes = require('./routes/main')
const todoRoutes = require('./routes/todos')

require('dotenv').config({path: './config/.env'})

// Passport config
require('./config/passport')(passport)

connectDB()

app.set('view engine', 'ejs') // Uses EJS for views
app.use(express.static('public')) // For CSS and JS
app.use(express.urlencoded({ extended: true })) // Allows to see info in the requests coming through (data in forms, etc.) and pull it
app.use(express.json()) // ^
app.use(logger('dev')) // Sets up morgan to log everything

// Sessions
app.use(
    session({
      secret: 'keyboard cat',
      resave: false,
      saveUninitialized: false,
      store: new MongoStore({ mongooseConnection: mongoose.connection }),
    })
  )
  
// Passport middleware
app.use(passport.initialize())
app.use(passport.session())

app.use(flash())
  
app.use('/', mainRoutes)
app.use('/todos', todoRoutes)
 
app.listen(process.env.PORT, ()=>{
    console.log(`Server is running on ${PORT}, you better catch it!`)
})    