var express = require('express')
var cors = require('cors')
var bodyParser = require('body-parser')
var app = express()
var port = process.env.PORT || 3000

app.use(express.json());

app.use(cors({origin: '*'}));

app.use(
    bodyParser.urlencoded({
        extended: false
    })
)

var Users = require('./RoutesUsers')
var Clases = require('./RoutesClases')
var Cousers = require('./RoutesCursos')

app.use('/korima/user', Users)
app.use('/korima/courses', Cousers)
app.use('/korima/class', Clases)

app.listen(port, function () {
    console.log('Server is running on port: ' + port)
})
