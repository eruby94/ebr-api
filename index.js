const express = require('express'),
	debug = require('debug')('app:server'),
	logger = require('morgan'),
	path = require('path'),
	bodyParser = require('body-parser'),
	helmet = require('helmet'),
	contact = require('./contact'),
	http = require('http');

const app = express();
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(
	bodyParser.urlencoded({
		extended: true
	})
);

app.use(helmet());
app.use('/contact', contact);

const port = normalizePort(process.env.PORT || '3001');
app.set('port', port);

const server = http.createServer(app);

server.on('error', onError);
server.on('listening', onListening);
server.listen(port);

function normalizePort(val) {
	let port = parseInt(val, 10);

	if (isNaN(port)) {
		// named pipe
		return val;
	}

	if (port >= 0) {
		// port number
		return port;
	}

	return false;
}

function onError(error) {
	if (error.syscall !== 'listen') {
		throw error;
	}

	let bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

	// handle specific listen errors with friendly messages
	switch (error.code) {
		case 'EACCES':
			console.error(bind + ' requires elevated privileges');
			process.exit(1);
			break;
		case 'EADDRINUSE':
			console.error(bind + ' is already in use');
			process.exit(1);
			break;
		default:
			throw error;
	}
}

function onListening() {
	let addr = server.address();
	let bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
	debug('Listening on ' + bind);
}
