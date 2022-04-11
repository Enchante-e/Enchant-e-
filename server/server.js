const io = require('socket.io')(3000, {
    cors: {
        origin: ['http://localhost:1234']
    }
});


// CONST ------------------------------------------------------------------------------------------------------------------------------------

let users =  []
const codeLetters = ["A", "W", "S", "E", "D", "F", "T", "G", "Y", "H", "U", "J", "K", "O", "L", "P", "M"]
let existingCodes = []


// SOCKET ------------------------------------------------------------------------------------------------------------------------------------

io.on('connection', socket => {
    let user = {id: socket.id, name : "", partnerId : "", coordX: 0, coordY: 0};
    users.push(user)
    socket.emit('init', user);

    socket.on('coord', (coord, myId) => {
        if (user.id == myId) {
            user.coordX = coord[0]
            user.coordY = coord[1]
        }
        io.sockets.to(user.partnerId).emit('cursor-update',user.partnerId, user.coordX, user.coordY);
    });

    socket.on('change-name', (name, id) => {
        if (user.id == id) {
            user.name = name;
        }
        io.emit('name-notification', name, id)
    });

    socket.on('generate-room', () => {
        let code = [...generateCode()]
        while(checkCode(code) == true) { 
            code = generateCode()
        }
        existingCodes.push(code)
        socket.join(code.toString())
        socket.emit('room-notification', code, "creator")
    });

    socket.on('join-room', (code, id) => {  
        const roomNames = Array.from(io.sockets.adapter.rooms)
        let roomMembers = []
        for (let member of io.sockets.adapter.rooms.values()) {
            roomMembers.push(Array.from(member))
        }
        
        roomNames.map((room, i) => {
            if (room[0] == code) {
                if (roomMembers[i].length >= 2) {
                    socket.emit('room-fail', code)
                } else {
                    socket.join(code)
                    let membersId = [id]
                    roomMembers[i].map((member)=> {
                        membersId.push(member)
                        io.sockets.to(member).emit('cursor-create', id);
                        socket.emit('cursor-create', member);
                        user.partnerId = member.toString()
                        users.map((u) => {
                            if (u.id == member) {
                                u.partnerId = id
                            }
                        })
                    })
                    socket.emit('room-notification', code, "invited");
                }
            }
        })
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


// LOCAL ------------------------------------------------------------------------------------------------------------------------------------

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
            status = true
        }
    }
    return status
}