let express = require("express");

let app = express();

let path = require("path");

let bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static(path.join(__dirname, 'static')));

app.set("views", path.join(__dirname, "./views"));
app.set("view engine", "ejs");

require("./server/config/routes.js")(app);

let server = app.listen(3316, () => {
	console.log("App listening on port 3316");
});

let io = require("socket.io").listen(server);

var messages = [];

function addToMessages(msg){
	console.log(messages);
	messages.push(msg);
	console.log(messages);
	return messages;
}

io.sockets.on("connection", (socket) => {
	console.log("Socket, online!");
	console.log(socket.id);
	socket.emit("new_user", {messages: messages})

	socket.on("new_message", (data) => {
		var msg = {'user': data.user, 'message': data.message};
		addToMessages(msg);
		let str = data.user + ": " + data.message;
		socket.broadcast.emit("add_message", {new_message: str});
	})
});
