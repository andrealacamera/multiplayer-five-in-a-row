const io = require('socket.io')({
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});
const randomColor = require('randomcolor');
const { createBoard, createCooldown } = require('./game');

const { clear, getBoard, makeTurn} = createBoard(10);
const cooldown = createCooldown(2000); //wait 2 sec every turn

io.on('connection', socket => {
    const color = randomColor();
    const now = new Date();
    console.log(`Connected ${socket.id} at ${now}`);
    socket.emit("welcome", `${now.toLocaleTimeString()}: Welcome! Your ID is: ${socket.id}`);
    io.emit("board", getBoard());

    socket.on("message", text => {
        const now = new Date();
        io.emit("message", `${now.toLocaleTimeString()}: ${text}`);
        console.log("New message: ", `${now.toLocaleTimeString()}: ${text}`);
    });
    
    socket.on("turn", ({x,y}) => {
        if (cooldown()) {
            // console.log(`Turn for ${socket.id}: ${x}  ${y}`);
            const now = new Date();
            const winner = makeTurn(x,y,color);
            io.emit("turn", {x,y,color});
            if (winner) {
                socket.emit("message", `${now.toLocaleTimeString()}: Congratulations! You won!`);
                io.emit("message", `${now.toLocaleTimeString()}: Game over... new turn!`);
                io.emit("board");
                clear(); //clear the board 
            }
        }
    });

    socket.on('disconnect', () => {
        console.log("Goodbye!");
    })
});


io.listen(3000);
