express = require('express')
app = express()
http = require('http').Server(app)
db = require('./models')
errorHandler = require('./lib/errorHandler')
fs = require('fs')

app.use('/static', express.static(__dirname + '/static'))

# Config
require('./config')(app)

# Set up DB
db.sequelize.sync().complete((err) ->
	if (err)
		throw err[0]
	else
		server = http.listen(8080, () ->
			address = server.address()
			print('Listening at %s:%d', address.address, address.port)
		)
)