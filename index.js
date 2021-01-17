const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server)

server.listen(3000);

app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static(__dirname + '/public'));


app.get("/User", function (req, res) {
    res.render('Tranchu User');
});

app.get("/Group", function (req, res) {
    res.render('Tranchu');
});


// array to save list user name register.
var arrayUser = [];

// array to save list group create by user
var arrayGroup = [];

io.on('connection', function (socket) {
    console.log('Co Nguoi Ke noi' + socket.id);

    socket.on('createUserName', function (data) {
        if (arrayUser.indexOf(data) >= 0) {
            socket.emit('failed');
        } else {
            socket.userName = data;

            //create username sussess to chat
            socket.emit('createdUserName', socket.userName);

            //push data is username to arrayUser. Save userName 
            arrayUser.push(data);

            io.sockets.emit('listUser', arrayUser);
        }
    })

    socket.on('mess', function (mess) {
        console.log(socket.userName);
        socket.broadcast.emit("msg_in", { mess: mess, fromUser: socket.userName });
    });

    socket.on('createGroup', function (groupName) {
        socket.join(groupName);

        //check isset group in arrayGroup if not push arraGroup
        if (!arrayGroup.includes(groupName)) {
            arrayGroup.push(groupName);
            socket.join(groupName);

        }
        console.log(io.sockets.adapter.rooms);
        socket.emit('listGroup', arrayGroup);
    });


    socket.on('disconnect', function () {
        console.log(socket.userName + "Da dang xuat");
    })
})
