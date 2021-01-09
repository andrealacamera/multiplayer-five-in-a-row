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
        //columns, rows
        board[y][x] = color;
        return isWinningTurn(x,y);
    }

    const inBounds = (x,y) => {
        return y>=0 && y < board.length && x >=0 && x<board[y].length;
    }

    const numMatches = (x,y,dx,dy) => {
        let i = 1;
        //go on until there's same color or reach the boundary.
        //considering one direction (right, up, etc) 
        while ( inBounds(x+i*dx, y+i*dy) && 
                board[y+i*dy][x+i*dx] === board[y][x] ) {
            i++;
        }
        return i-1; // remove the starting cell 
    }
    const isWinningTurn = (x,y) => {
        for (let dx=-1; dx < 2; dx++) {
            for (let dy=-1; dy<2; dy++) {
                if (dx===0 && dy===0) {
                    continue;
                }
                //sum one direction (right, up, etc) + the opposite (left, down, etc)+ the starting cell!
                const count=numMatches(x,y,dx,dy)+numMatches(x,y,-dx,-dy)+1;

                if (count >=5) {
                    return true; //win condition
                }
            }
        }
        return false; //otherwise
    }
    //init the game
    clear();

    return { clear, getBoard, makeTurn }
}


const createCooldown = (delay) => {
    let lastUpdateTime = 0;
    return () => {
        if (Date.now() - lastUpdateTime > delay) {
            lastUpdateTime = Date.now();
            return true;
        }

    return false;
    }

}

module.exports =  { createBoard, createCooldown } ;