const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const port = process.env.PORT || 8080;
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// the __dirname is the current directory from where the script is running
app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, 'build')));

app.get('/api/hello', (req, res) => {
    res.send({ express: 'Hello From Express' });
});
app.post('/api/world', (req, res) => {
    res.send(
        `I received your POST request. This is what you sent me: ${req.body.post}`,
	);
	console.log(req.body);
});
app.get('/ping', function (req, res) {
	 return res.send('pong');
});
app.get('/*', function (req, res) {
  	res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(port, () => {console.log(`Listening on port ${port}`)});