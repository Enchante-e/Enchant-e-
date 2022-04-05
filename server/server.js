const io = require('socket.io')(3000, {
    cors: {
        origin: ['http://localhost:1234']
    }
});

io.on('connection', socket => {
    console.log("Nouvel user ! ID :", socket.id)
    io.emit('init', socket.id);

    io.on('disconnect', socket => {
        console.log("User déconnecté : ID", socket.id)
    })
})