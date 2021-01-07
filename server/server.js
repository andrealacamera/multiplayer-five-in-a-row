const io = require('socket.io')({
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});



io.on('connection', socket => {
    const now = new Date();
    // console.log(`Connected ${socket.id} at ${now}`);
    socket.emit("welcome", `${now.toLocaleTimeString()}: Welcome! your ID is: ${socket.id}`);

    socket.on("message", text => {
        const now = new Date();
        io.emit("message", `${now.toLocaleTimeString()}: ${text}`);
        // console.log("New message: ", `${now.toLocaleTimeString()}: ${text}`);
    });
    

    socket.on('disconnect', () => {
        console.log("Goodbye!");
    })
});


io.listen(3000);
