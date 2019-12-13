const express = require('express');
const app = express();
const request = require('request');
const redis = require('redis');
const cache = redis.createClient();
const port = 4000;

function* _nextService () {
	const usvcs = [ 
		'http://localhost:3000',
		'http://localhost:3001',
		'http://localhost:3002'
	];

	for (let svcId = 0; ; svcId = (svcId + 1) % usvcs.length) {
		yield usvcs[svcId];
	}
}

const loadBalancer = {
	_gen: _nextService(),
	getService : function () {
		return this._gen.next().value;
	}
}

cache.on('connect', () => console.log('Redis connected'));
cache.on('error', (err) => console.log(err));

app.use(express.json())

app.listen(port, () => {
	console.log(`Server started on port ${port}`);
});

app.get('/messages', (req, res) => {
	const service = loadBalancer.getService();
	console.log(service);
	request(`${service}/messages`, (err, result, body) => {
		if (err) throw err;
		console.log(body);
		res.json(body);
	});
});

app.get('/messages/:id', (req, res) => {
	const id = req.params.id;
	cache.get(`message${id}`, (error, result) => {
		if (error) throw error;
		if (result) {
			console.log(`Cache hit! ${result}`);
			res.json(result);
		} else {
			const service = loadBalancer.getService();
			console.log(service);
			request(`${service}/messages/${id}`, (err, result, body) => {
				if (err) throw err;
				cache.set(`message${id}`, body, redis.pring);
				console.log(body);
				res.json(body);
			});
		}
	});
});

app.post('/messages', (req, res) => {
	const message = req.body;
	const service = loadBalancer.getService();
	console.log(service);
	request.port(`${service}/messages`, {
		json: message
	}, (err, result, body) => {
		if (err) throw err;
		console.log('Message sent!');
		res.sendStatus(200);
	});
});
