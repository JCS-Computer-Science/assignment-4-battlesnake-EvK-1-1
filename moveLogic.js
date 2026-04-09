export function gameCons(gamestate){
    this.gameId = gamestate.id
    this.target = {x:0,y:0}
}

export const games = {}

export function move(gameState){
    let moveSafety = {
        up: true,
        down: true,
        left: true,
        right: true
    };
    
    // We've included code to prevent your Battlesnake from moving backwards
    let game = games[gameState.you.id]
    console.log(game)
    const myHead = gameState.you.body[0];
    const myNeck = gameState.you.body[1];

    if (game == undefined){
        game = new gameCons(gameState.game)
        games[gameState.you.id] = game
    }

    if (gameState.turn == 0){
        if (myHead.x <= Math.ceil((gameState.board.width - 1) / 2)) {
            game.target.x = 0
        }else{
            game.target.x = gameState.board.width - 1
        }
        if (myHead.y <= Math.ceil((gameState.board.height - 1) / 2)) {
            game.target.y = 0
        }else{
            game.target.y = gameState.board.height - 1
        }
    }

    if (myHead.x == 0 || myHead.x == gameState.board.width - 1){
        if (myHead.y == 0 || myHead.y == gameState.board.height - 1) {
            if (game.target.x == 0 && game.target.y == 0){
                game.target.y = gameState.board.height - 1
            }else if (game.target.x == 0 && game.target.y == gameState.board.height - 1){
                game.target.x = gameState.board.width - 1
            }else if (game.target.x == gameState.board.width - 1 && game.target.y == gameState.board.height - 1){
                game.target.y = 0
            }else if (game.target.x == gameState.board.width - 1 && game.target.y == 0){
                game.target.x = 0
            }
        }
    }
  
    if (myNeck.x < myHead.x) {
        console.log(`My neck is left`)        // Neck is left of head, don't move left
        moveSafety.left = false;
        
    } else if (myNeck.x > myHead.x) { // Neck is right of head, don't move right
        console.log(`My neck is right`) 
        moveSafety.right = false;
        
    } else if (myNeck.y < myHead.y) { // Neck is below head, don't move down
        console.log(`My neck is down`) 
        moveSafety.down = false;
        
    } else if (myNeck.y > myHead.y) { // Neck is above head, don't move up
        console.log(`My neck is up`) 
        moveSafety.up = false;
    }
    
    // TODO: Step 1 - Prevent your Battlesnake from moving out of bounds
    // gameState.board contains an object representing the game board including its width and height
    // https://docs.battlesnake.com/api/objects/board
    if (myHead.x == 0){
        console.log(`I'm on the left edge`) 
        moveSafety.left = false;
    }else if (myHead.x == gameState.board.width - 1){
        console.log(`I'm on the right edge`)
        moveSafety.right = false;
    }
    if (myHead.y == 0){
        console.log(`I'm on the bottom edge`)
        moveSafety.down = false;
    }else if (myHead.y == gameState.board.height - 1){
        console.log(`I'm on the top edge`)
        moveSafety.up = false;
    }
    // TODO: Step 2 - Prevent your Battlesnake from colliding with itself
    // gameState.you contains an object representing your snake, including its coordinates
    // https://docs.battlesnake.com/api/objects/battlesnake
    for (let i = gameState.you.body.length - 1; i > 1; i--){
        let cur = gameState.you.body[i];
        if(cur.x == myHead.x + 1 && cur.y == myHead.y){
            console.log('My body is to my right')
            moveSafety.right = false;
        }else if(cur.x == myHead.x - 1 && cur.y == myHead.y){
            console.log('My body is to my left')
            moveSafety.left = false;
        }else if(cur.y == myHead.y + 1 && cur.x == myHead.x){
            console.log('My body is up')
            moveSafety.up = false;
        }else if(cur.y == myHead.y - 1 && cur.x == myHead.x){
            console.log('My body is down')
            moveSafety.down = false;
        }
    }
    
    // TODO: Step 3 - Prevent your Battlesnake from colliding with other Battlesnakes
    // gameState.board.snakes contains an array of enemy snake objects, which includes their coordinates
    // https://docs.battlesnake.com/api/objects/battlesnake
    for (let i = 0; i < gameState.board.snakes.length; i++){
        let enemy = gameState.board.snakes[i]
        if(enemy.body[0].x == myHead.x && enemy.body[0].y == myHead.y){
            console.log('thats me!')
        }else{
            for (let j = 0; j < gameState.board.snakes[i].body.length; j++){
                let cur = gameState.board.snakes[i].body[j];
                if(cur.x == myHead.x + 1 && cur.y == myHead.y){
                    console.log('A body is to my right')
                    moveSafety.right = false;
                }else if(cur.x == myHead.x - 1 && cur.y == myHead.y){
                    console.log('A body is to my left')
                    moveSafety.left = false;
                }else if(cur.y == myHead.y + 1 && cur.x == myHead.x){
                    console.log('A body is up')
                    moveSafety.up = false;
                }else if(cur.y == myHead.y - 1 && cur.x == myHead.x){
                    console.log('A body is down')
                    moveSafety.down = false;
                }
            }
        }
    }
    // Are there any safe moves left?
    
    //Object.keys(moveSafety) returns ["up", "down", "left", "right"]
    //.filter() filters the array based on the function provided as an argument (using arrow function syntax here)
    //In this case we want to filter out any of these directions for which moveSafety[direction] == false
    const safeMoves = Object.keys(moveSafety).filter(direction => moveSafety[direction]);
    if (safeMoves.length == 0) {
        console.log(`MOVE ${gameState.turn}: No safe moves detected! Moving down`);
        return { move: "down" };
    }
    
    let nextMove = safeMoves[Math.floor(Math.random() * safeMoves.length)];

    if(safeMoves.length > 1 && gameState.you.health < 100){
        let foodf = gameState.board.food[0];
        let xdif = foodf.x - myHead.x
        let xdir;
        if (xdif > 0){
            xdir = 'right'
        }else if (xdif < 0){
            xdir = 'left'
            xdif *= -1
        }else{
            xdir = 'none'
        }
        let ydif = foodf.y - myHead.y
        let ydir;
        if (ydif > 0){
            ydir = 'up'
        }else if (ydif < 0){
            ydir = 'down'
            ydif *= -1
        }else{
            ydir = 'none'
        }
        let dir1;
        let dir2;
        if (xdif > ydif){
            dir1 = xdir
            dir2 = ydir
        }else{
            dir1 = ydir
            dir2 = xdir
        }
        if (safeMoves.indexOf(dir1) != -1){
            nextMove = dir1
        }else if (safeMoves.indexOf(dir2) != -1){
            nextMove = dir2
        }
    }else if (safeMoves.length > 1){
        let xdif = game.target.x - myHead.x
        let xdir;
        if (xdif > 0){
            xdir = 'right'
        }else if (xdif < 0){
            xdir = 'left'
            xdif *= -1
        }else{
            xdir = 'none'
        }
        let ydif = game.target.y - myHead.y
        let ydir;
        if (ydif > 0){
            ydir = 'up'
        }else if (ydif < 0){
            ydir = 'down'
            ydif *= -1
        }else{
            ydir = 'none'
        }
        let dir1;
        let dir2;
        if (xdif > ydif){
            dir1 = xdir
            dir2 = ydir
        }else{
            dir1 = ydir
            dir2 = xdir
        }
        if (safeMoves.indexOf(dir1) != -1){
            nextMove = dir1
        }else if (safeMoves.indexOf(dir2) != -1){
            nextMove = dir2
        }
    }

    // Choose a random move from the safe moves
    
    // TODO: Step 4 - Move towards food instead of random, to regain health and survive longer
    // gameState.board.food contains an array of food coordinates https://docs.battlesnake.com/api/objects/board

    console.log(`MOVE ${gameState.turn}: ${nextMove}`)
    return { move: nextMove };
}