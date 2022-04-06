let users =  []
const codeLetters = ["A", "W", "S", "E", "D", "F", "T", "G", "Y", "H", "U", "J", "K", "O", "L", "P", "M"]
let existingCodes = []

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

    socket.on('generate-code', () => {
        let code = generateCode()
        while(checkCode(code) == true) { 
            code = generateCode()
        }
        existingCodes.push(code)
        // socket.join(code)
        socket.emit('friendcode-generated', code)
    });

    socket.on('join-partner', (code, id) => {
        console.log(io)
        // if(code !== "") {    
        socket.join(code)
        io.to(code).emit('room-notification', code, id,user.name)
        // }
    });

    socket.on('message', (msg,code, id) => {
        // console.log(msg)
        if(code === "") {
            io.emit('messsage-emit', msg, code, id)
        } else {
            
            io.to(code).emit('messsage-emit', msg, code, id)
        }    
    });

    socket.on('disconnect', () => {
        io.emit('disconnect-notification', user.id, user.name)
        users.map((knownUser, i) => {
            if (knownUser.id == user.id) {
                users.splice(i, 1)
            }
        })
    })
})

const generateCode = () => {
    let code = []
    for(let i = 0; i < 4; i++) {
        code.push(codeLetters[Math.floor(Math.random() * 17)]);
    }
    return code
}

const checkCode = (code) => {
    let status = false
    for(let i = 0; i < existingCodes.length; i++) {
        if (JSON.stringify(existingCodes[i]) === JSON.stringify(code)) {
            console.log("idem")
            status = true
        }
    }
    return status
}