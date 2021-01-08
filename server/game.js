const createBoard = (size) => {

    let board;
    const clear = ()=> {
        //2d array of null
        board = Array(size).fill().map( () => Array(size).fill(null));
    };

    const getBoard = () => {
        return board;
    }

    const makeTurn = (x,y,color) => {
        board[y][x] = color;
    }

    return { clear, getBoard, makeTurn }
}


module.exports =  createBoard ;