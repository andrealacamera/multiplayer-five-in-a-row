const io = require('socket.io')({
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});
const randomColor = require('randomcolor');
const createBoard = require('./game');

const {clear, getBoard, makeTurn} = createBoard(20);
 
io.on('connection', socket => {
    const color = randomColor();
    const now = new Date();
    console.log(`Connected ${socket.id} at ${now}`);
    socket.emit("welcome", `${now.toLocaleTimeString()}: Welcome! your ID is: ${socket.id}`);
    socket.emit("board", getBoard());

    socket.on("message", text => {
        const now = new Date();
        io.emit("message", `${now.toLocaleTimeString()}: ${text}`);
        console.log("New message: ", `${now.toLocaleTimeString()}: ${text}`);
    });
    
    socket.on("turn", ({x,y}) => {
        makeTurn(x,y,color);
        io.emit("turn", {x,y,color});
    });

    socket.on('disconnect', () => {
        socket.emit("clear", clear());
        console.log("Goodbye!");
    })
});


io.listen(3000);
