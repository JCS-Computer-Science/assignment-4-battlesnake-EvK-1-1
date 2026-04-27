export function move(gameState) {
    const REDGE = gameState.board.width - 1;
    const TEDGE = gameState.board.height - 1;
    const SELF = gameState.you
    const HEAD = SELF.body[0]

    //make blank map of board
    let map = []
    for(let i = 0; i <= TEDGE; i++){
        let row = []
        for(let j = 0; j <= REDGE; j++){
            row.push(1);
        }
        map.push(row);
    }

    //make edges not safe
    for(let i = 0; i <= REDGE; i++){
        map[0][i] -= 0.25;
        map[TEDGE][i] -= 0.25;
    }
    for(let i = 0; i <= TEDGE; i++){
        map[i][0] -= 0.25
        map[i][REDGE] -= 0.25
    }

    //hazard weighting
    gameState.board.hazards.forEach((haz) => {
        map[haz.y][haz.x] -= 0.25
    })

    //food weighting
    gameState.board.food.forEach((food) => {
        map[food.y][food.x] += 0.1
    })

    //around snake weighting
    gameState.board.snakes.forEach((snake) => {
        for (let i = 0; i < snake.body.length - 1; i++){
            part = snake.body[i]
            map[part.y][part.x] == 0
            if (i == 0){
                if (!part[i].x != HEAD.x || !part[i] != HEAD.y){
                    if (snake.body.length >= SELF.body.length){
                        if (part.y < TEDGE){
                            map[part.y + 1][part.x] -= 0.2
                        }
                        if (part.y > 0){
                            map[part.y - 1][part.x] -= 0.2
                        }
                        if (part.x < REDGE){
                            map[part.y][part.x + 1] -= 0.2
                        }
                        if (part.x > 0){
                            map[part.y][part.x - 1] -= 0.2
                        }
                    }else{
                        if (part.y < TEDGE){
                            map[part.y + 1][part.x] += 0.2
                        }
                        if (part.y > 0){
                            map[part.y - 1][part.x] += 0.2
                        }
                        if (part.x < REDGE){
                            map[part.y][part.x + 1] += 0.2
                        }
                        if (part.x > 0){
                            map[part.y][part.x - 1] += 0.2
                        }
                    }
                }
            }
        }
    })

    let highest = 0
    let witWegh = []
    for (let i = 0; i <= TEDGE; i++){
        for (let j = 0; j <= REDGE; j++){
            let weigh = map[i][j]
            if (weigh > highest){
                highest = weigh;
                witWegh = []
                witWegh.push({x : j, y : i})
            }else if(weigh == highest){
                witWegh.push({x : j, y : i})
            }
        }
    }

    let closest;

    if (witWegh.length > 1){

    }else{
        closest = witWegh[0]
    }

    return map; //only for testing
}