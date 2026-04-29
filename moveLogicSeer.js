export function move(gameState) {
    const REDGE = gameState.board.width - 1;
    const TEDGE = gameState.board.height - 1;
    const SELF = gameState.you
    const HEAD = SELF.body[0]
    console.log(`---turn ${gameState.turn}---`)
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
        map[0][i] -= 0.2;
        map[TEDGE][i] -= 0.2;
    }
    for(let i = 0; i <= TEDGE; i++){
        map[i][0] -= 0.2
        map[i][REDGE] -= 0.2
    }

    //hazard weighting
    gameState.board.hazards.forEach((haz) => {
        map[haz.y][haz.x] -= 0.2
    })

    //food weighting
    gameState.board.food.forEach((food) => {
        map[food.y][food.x] += 0.25
    })

    //around snake weighting
    gameState.board.snakes.forEach((snake) => {
        for (let i = 0; i < snake.body.length - 1; i++){
            let part = snake.body[i]
            map[part.y][part.x] = 0
            if (i == 0){
                if (part.x != HEAD.x || part.y != HEAD.y){
                    console.log('notme')
                    if (snake.body.length >= SELF.body.length){
                        if (part.y < TEDGE){
                            map[part.y + 1][part.x] -= 0.3
                        }
                        if (part.y > 0){
                            map[part.y - 1][part.x] -= 0.3
                        }
                        if (part.x < REDGE){
                            map[part.y][part.x + 1] -= 0.3
                        }
                        if (part.x > 0){
                            map[part.y][part.x - 1] -= 0.3
                        }
                    }else{
                        if (part.y < TEDGE){
                            map[part.y + 1][part.x] += 0.3
                        }
                        if (part.y > 0){
                            map[part.y - 1][part.x] += 0.3
                        }
                        if (part.x < REDGE){
                            map[part.y][part.x + 1] += 0.3
                        }
                        if (part.x > 0){
                            map[part.y][part.x - 1] += 0.3
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
        closest = witWegh[0]
        witWegh.forEach((tile) => {
            let cur = proximity(HEAD, closest);
            let newt = proximity(HEAD, tile);
            if (newt < cur){
                closest = tile
            }
        })
    }else{
        closest = witWegh[0]
    }

    console.log(`at ${HEAD.x},${HEAD.y}`)
    console.log(`going towards ${closest.x},${closest.y}`)

    let opt = {
        'up' : {x : HEAD.x, y : HEAD.y + 1},
        'down' : {x : HEAD.x, y : HEAD.y - 1},
        'left' : {x : HEAD.x - 1, y : HEAD.y},
        'right' : {x : HEAD.x + 1, y : HEAD.y}
    }
    let xDist = HEAD.x - closest.x
    let yDist = HEAD.y - closest.y
    if (Math.abs(xDist) < Math.abs(yDist) && xDist != 0 || yDist == 0){
        if (xDist > 0){
            if (map[opt['left'].y][opt['left'].x] > 0){
                console.log('left is best')
                map[opt['left'].y][opt['left'].x] += 0.1
            }
        }else{
            if (map[opt['right'].y][opt['right'].x] > 0){
                console.log('right is best')
                map[opt['right'].y][opt['right'].x] += 0.1
            }
        }
        if (yDist > 0){
            if (map[opt['down'].y][opt['down'].x] > 0){
                console.log('down is okay')
                map[opt['down'].y][opt['down'].x] += 0.05
            }
        }else if (yDist < 0){
            if (map[opt['up'].y][opt['up'].x] > 0){
                console.log('up is okay')
                map[opt['up'].y][opt['up'].x] += 0.05
            }
        }
    }else{
        if (yDist > 0){
            if (map[opt['down'].y][opt['down'].x] > 0){
                console.log('down is best')
                map[opt['down'].y][opt['down'].x] += 0.1
            }
        }else{
            if (map[opt['up'].y][opt['up'].x] > 0){
                console.log('up is best')
                map[opt['up'].y][opt['up'].x] += 0.1
            }
        }
        if (xDist > 0){
            if (map[opt['left'].y][opt['left'].x] > 0){
                console.log('left is okay')
                map[opt['left'].y][opt['left'].x] += 0.05
            }
        }else if (xDist < 0){
            if (map[opt['right'].y][opt['right'].x] > 0){
                console.log('right is okay')
                map[opt['right'].y][opt['right'].x] += 0.05
            }
        }
    }
    let dirs = ['up', 'down', 'left', 'right']
    if (opt.up.y > TEDGE){
        dirs.splice(0, 1)
    }
    if (opt.down.y < 0){
        dirs.splice(1, 1)
    }
    if (opt.left.x < 0){
        dirs.splice(2, 1)
    }
    if (opt.right.x > REDGE){
        dirs.splice(3, 1)
    }
    let best = null;
    dirs.forEach((dir) => {
        if (best == null){
            best = dir
        }else{
            // console.log(best)
            // console.log(map[opt[best].y][opt[best].x])
            if (map[opt[best].y][opt[best].x] < map[opt[dir].y][opt[dir].x]){
                best = dir
            }
        }
    })

    //terminal board display
    // for (let i = 10; i >= 0; i--){
    //     let row = map[i]
    //     let rowtxt = ``
    //     for (let j = 0; j < 11; j++){
    //         if (row[j] == 0){
    //             rowtxt += `\x1b[32m`
    //         }else if(row[j] > 1){
    //             rowtxt += `\x1b[34m`
    //         }
    //         rowtxt += `${row[j]}\x1b[0m `
    //     }
    //     console.log(rowtxt)
    // }
    return {move : best};
    // return map; //only for testing
}

function proximity(a, b){
    let xPr = Math.abs(a.x - b.x)
    let yPr = Math.abs(a.y - b.y)
    return xPr + yPr
}