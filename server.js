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

app.use('/korima', Users)

app.listen(port, function () {
    console.log('Server is running on port: ' + port)
})
