let users =  [];

const io = require('socket.io')(3000, {
    cors: {
        origin: ['http://localhost:1234']
    }
});

io.on('connection', socket => {
    let user = {id: socket.id, name : "", coordX: 0, coordY: 0};
    users.push(user)
    socket.emit('init', user.id);
    socket.broadcast.emit('hello-world', user.id);

    socket.on('coord', (coord, myId) => {
        if (user.id == myId) {
            user.coordX = coord[0]
            user.coordY = coord[1]
        }
        io.emit('userUpdate', users);
    });

    socket.on('change-name', (name, id) => {
        const oldName = user.name
        if (user.id == id) {
            user.name = name;
        }
        io.emit('name-notification', name, id, oldName)
    });
    
    // if(room === "") {
    // } else {
    //     socket.to(room).emit('receive-message', message)
    // }
    // socket.on('join-room', (room) => {
    //     socket.join(room)
    // });

    socket.on('disconnect', socket => {
        io.emit('disconnect-notification', user.id, user.name)
    })
})