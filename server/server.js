const dotenv = require('dotenv')
dotenv.config();

const io = require('socket.io')(process.env.PORT || 3000, {
    cors: {
        origin: [process.env.SERVER_URL]
    }
});

// CONST ------------------------------------------------------------------------------------------------------------------------------------

let users =  []
const codeLetters = ["A", "W", "S", "E", "D", "F", "T", "G", "Y", "H", "U", "J", "K", "O", "L", "P", "M"]
let existingCodes = []
let foundCodeMatch = false

// SOCKET ------------------------------------------------------------------------------------------------------------------------------------

io.on('connection', socket => {
    let user = {id: socket.id, name : "", isReady : false, hasFinished: false, partnerId : "", coordX: 0, coordY: 0};
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
            user.isReady = true
        }

        if (user.partnerId !== "") {
            users.map((u) => {
                if (u.id == user.partnerId ) {
                    if (u.isReady == true) {
                        io.sockets.to(user.partnerId).emit('name-notification', name, id)
                        socket.emit('name-notification', u.name, u.id)
                    } else {
                        socket.emit('waiting-for-partner')
                    }
                }
            })
        } else {
            socket.emit('waiting-for-partner')
        }
    });

    socket.on('generate-room', () => {
        let code = [...generateCode()]
        while(checkCode(code) == true) { 
            code = generateCode()
        }
        existingCodes.push(code)
        socket.join(code.join(''))
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
                    foundCodeMatch = true
                } else {
                    socket.join(code)
                    socket.emit('room-notification', code, "invited")
                    let membersId = [id]
                    roomMembers[i].map((member)=> {
                        membersId.push(member)
                        io.sockets.to(member).emit('canvas-create', id);
                        socket.emit('canvas-create', member);
                        user.partnerId = member.toString()
                        users.map((u) => {
                            if (u.id == member) {
                                u.partnerId = id
                            }
                        })
                    })
                    foundCodeMatch = true
                }
            }
        })

        if(foundCodeMatch == false) {
            socket.emit('room-fail', code)
        }
    });

    socket.on('partner-notification', (type) => {
        io.sockets.to(user.partnerId).emit('partner-notification',type);
    })

    socket.on('set-objects', (objects) => {
        user.hasFinished = true
        io.sockets.to(user.partnerId).emit('partner-objects',objects);
        socket.emit('cursor-create');
        
        if(user.hasFinished == true) {
            users.map((u) => {
                if (u.id == user.partnerId ) {
                    if (u.hasFinished == true) {
                        socket.emit('close-loading')
                        io.sockets.to(user.partnerId).emit('close-loading')
                    } else {
                        socket.emit('waiting-for-partner')
                    }
                }
            })
        } else {
            socket.emit('waiting-for-partner')
        }
    })

    socket.on('disconnect', () => {
        io.sockets.to(user.partnerId).emit('disconnect-notification', user.id, user.name)
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