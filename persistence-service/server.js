'use strict'

const express = require('express');
const MongoClient = require('mongodb').MongoClient;
//const dbUri = 'mongodb://localhost:27019';
const dbUri = 'mongodb://smartproxy_mongo_2:27019,smartproxy_mongo_1:27017,smartproxy_mongo_2:27018/?replicaSet=rs0';
const app = express();
const port = process.env.PORT || 3000;

//const client = new MongoClient(dbUri, { useNewUrlParser: true });
let client = null;
MongoClient.connect(dbUri, { useNewUrlParser: true }, (err, res) => {
	if (err) throw err;
  client = res;

app.use(express.json())

app.listen(port, () => {
	console.log(`Server started on port ${port}`);
});

app.get('/messages', (req, res) => {
	const collection = client.db('lab3').collection('messages');
	collection.find({ }, { projection: {_id:0, id: 1}}).toArray((err, result) => {
		console.log(result);
		res.json(result.map((elem) => elem.id));
	});
});

app.get('/messages/:id', (req, res) => {
	const messageId = req.params.id;
	console.log(`Requested id: ${messageId}`);
	try {
	console.log(client);
	const collection = client.db('lab3').collection('messages');
	collection.findOne({id: +messageId}, function(err, result) {
		if (err) throw err;
		console.log(result);
		res.json(result);
	});
	} catch (ex) {
		console.log(ex);
	}
});

app.post('/messages', (req, res) => {
	let message = req.body;
	console.log(`Inside "/messages" POST handler. Message: ${JSON.stringify(message)}`);
	const collection = client.db('lab3').collection('messages');
	collection.find().sort({ id: -1 }).limit(1).toArray((err, result) => {
		const lastId = result[0] && result[0].id || 0;
		console.log(`New id: ${JSON.stringify(lastId)}`);
		message.id = lastId + 1;
		collection.insertOne(message);
		res.sendStatus(200);
	});
});
})

