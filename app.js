const express = require('express')
const morgan = require('morgan')
const uploadRoute = require('./routes/uploadRoute')

const port = process.env.port || 5000
const app = express()


// Setup view engine
app.set('view engine', 'ejs')
app.set('views', 'views')

// Middleware Array
const middlewares = [
    // morgan('dev'),
    express.static('public'),
    express.urlencoded({extended: true}),
    express.json()
]

app.use(middlewares)
app.use('/', uploadRoute)

app.get('/', (req, res)=>{
    res.send("Hello world")
})

app.listen(port, ()=>{
    console.log(`Server is Listening on port: ${port}`);
})