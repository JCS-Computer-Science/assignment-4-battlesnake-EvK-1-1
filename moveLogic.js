import flood from "./fill.js"

export function gameCons(gamestate){
    this.gameId = gamestate.id
}

export const games = {}

export function move(gameState){
    let moves = {
        'left' : 0,
        'right' : 0,
        'up' : 0,
        'down' : 0
    }
    let game = games[gameState.you.id]
    let occupied = {}
    
    const Body = gameState.you.body
    const Head = Body[0]
    const TopEdge = gameState.board.height - 1
    const RightEdge = gameState.board.width - 1
    let Biggest = true;
    for (let i = 0; i <= RightEdge; i++){
        occupied[i] = [];
    }
    occupied[Head.x].push(Head.y)

    console.log(Head)

    console.warn('---checking for edge---')
    if (Head.x == 0){
        moves['left'] = -999
        moves['right'] += 1
        console.log('left')
    }else if (Head.x == RightEdge){
        moves['right'] = -999
        moves['left'] += 1
        console.log('right')
    }
    if (Head.y == 0){
        moves['down'] = -999
        moves['up'] += 1
        console.log('down')
    }else if (Head.y == TopEdge){
        moves['up'] = -999
        moves['down'] += 1
        console.log('up')
    }

    console.warn('---checking self---')
    for (let i = 1; i < gameState.you.body.length - 1; i++) {
        occupied[Body[i].x].push(Body[i].y)
        if (i == 1){
            console.log('--neck--')
            if (Head.x > Body[i].x){
                moves['left'] = -999
                console.log('left')
            }else if (Head.x < Body[i].x){
                moves['right'] = -999
                console.log('right')
            }else if (Head.y > Body[i].y){
                moves['down'] = -999
                console.log('down')
            }else if (Head.y < Body[i].y){
                moves['up'] = -999
                console.log('up')
            }
            console.log('--body--')
        }else{
            if (Head.x - 1 == Body[i].x && Head.y == Body[i].y){
                moves['left'] = -999
                console.log('left')
            }else if (Head.x + 1 == Body[i].x && Head.y == Body[i].y){
                moves['right'] = -999
                console.log('right')
            }else if (Head.y - 1 == Body[i].y && Head.x == Body[i].x){
                moves['down'] = -999
                console.log('down')
            }else if (Head.y + 1 == Body[i].y && Head.x == Body[i].x){
                moves['up'] = -999
                console.log('up')
            }
        }
    }

    console.warn('---checking enemies---')
    for (let i = 0; i < gameState.board.snakes.length; i++) {
        let enemy = gameState.board.snakes[i].body
        if (enemy[0].x != Head.x || enemy[0].y != Head.y){
            console.log(`--${gameState.board.snakes[i].name}--`)
            if(enemy.length >= Body.length){
                Biggest = false;
                if (enemy[0].y < TopEdge){
                    occupied[enemy[0].x].push(enemy[0].y + 1)
                }
                if (enemy[0].y > 0){
                    occupied[enemy[0].x].push(enemy[0].y - 1)

                }
                if (enemy[0].x < RightEdge){
                    occupied[enemy[0].x + 1].push(enemy[0].y)

                }
                if (enemy[0].x > 0){
                    occupied[enemy[0].x - 1].push(enemy[0].y)

                }
            }
            if (Math.abs(Head.x - enemy[0].x) + Math.abs(Head.y - enemy[0].y) == 2) {
                console.log('-heads could collide-')
                let xdif = Head.x - enemy[0].x
                let ydif = Head.y - enemy[0].y
                if(Body.length > enemy.length){
                    console.log('attacking')
                    // if (Math.abs(xdif) == 2){
                    //     moves['up'] -= 5
                    //     moves['down'] -= 5
                    // }else if (Math.abs(ydif) == 2){
                    //     moves['left'] -= 5
                    //     moves['right'] -= 5
                    // }else{
                        if (xdif > 0){
                            moves['left'] += 5
                        }else{
                            moves['right'] += 5
                        }
                        if (ydif > 0){
                            moves['down'] += 5
                        }else{
                            moves['up'] += 5
                        }
                    // }
                }else{
                    console.log('Retreating')
                    if (Math.abs(xdif) == 2){
                        moves['up'] += 5
                        moves['down'] += 5
                    }else if (Math.abs(ydif) == 2){
                        moves['left'] += 5
                        moves['right'] += 5
                    }
                    if (xdif > 0){
                        moves['right'] += 5
                    }else{
                        moves['left'] += 5
                    }
                    if (ydif > 0){
                        moves['up'] += 5
                    }else{
                        moves['down'] += 5
                    }
                }
            }
            for (let j = 0; j < enemy.length - 1; j++){
                occupied[enemy[j].x].push(enemy[j].y)
                if (Head.x - 1 == enemy[j].x && Head.y == enemy[j].y){
                    moves['left'] = -999
                    console.log('left')
                }else if (Head.x + 1 == enemy[j].x && Head.y == enemy[j].y){
                    moves['right'] = -999
                    console.log('right')
                }else if (Head.y - 1 == enemy[j].y && Head.x == enemy[j].x){
                    moves['down'] = -999
                    console.log('down')
                }else if (Head.y + 1 == enemy[j].y && Head.x == enemy[j].x){
                    moves['up'] = -999
                    console.log('up')
                }
            }
        }else{
            console.log('--me--')
        }
    }

    console.log(`---am biggest? ${Biggest}---`)
    if (gameState.you.health <= 50 || !Biggest || gameState.board.snakes.length == 1){
        console.warn('---finding food---')
        let closest = {x:0,y:0}
        let dist = 40
        let distx = 0
        let disty = 0
        gameState.board.food.forEach(el => {
            if(Math.abs(Head.x - el.x) + Math.abs(Head.y - el.y) < dist){
                dist = Math.abs(Head.x - el.x) + Math.abs(Head.y - el.y)
                distx = Head.x - el.x
                disty = Head.y - el.y
                closest = {...el}
                console.log(closest)
            }
        })
        console.log(`found food ${closest.x} ${closest.y}`)
        if (distx != 0 && Math.abs(distx) < Math.abs(disty) || disty == 0) {
            if (distx > 0){
                moves['left'] += 2
                console.log('Left is best')
            }else{
                moves['right'] += 2
                console.log('Right is best')
            }
            if (disty > 0){
                moves['down'] += 1
                console.log('Down is second')
            }else if (disty < 0){
                moves['up'] += 1
                console.log('Up is second')
            }
        }else if (disty != 0 && Math.abs(distx) > Math.abs(disty) || distx == 0) {
            if (disty > 0){
                moves['down'] += 2
                console.log('Down is best')
            }else{
                moves['up'] += 2
                console.log('Up is best')
            }
            if (distx > 0){
                moves['left'] += 1
                console.log('Left is second')
            }else if (distx < 0){
                moves['right'] += 1
                console.log('Right is second')
            }
        }
    }else if (gameState.board.snakes.length > 1){
        console.warn('---kill---')
        let closest = null
        let dist = 40
        let distx = 0
        let disty = 0
        gameState.board.snakes.forEach(el => {
            if(el.body[0].x != Head.x || el.body[0].y != Head.y){
                if(Math.abs(Head.x - el.body[0].x) + Math.abs(Head.y - el.body[0].y) < dist){
                    let diffx = el.body[0].x - el.body[1].x
                    let diffy = el.body[0].y - el.body[1].y
                    let target = {x:el.body[0].x + diffx, y:el.body[0].y + diffy}
                    dist = Math.abs(Head.x - target.x) + Math.abs(Head.y - target.y)
                    distx = Head.x - target.x
                    disty = Head.y - target.y
                    closest = target
                    console.log(closest)
                }
            }
        })
        console.log(`found target ${closest.x} ${closest.y}`)
        console.log(`dist ${distx} ${disty}`)
        if (distx != 0 && Math.abs(distx) > Math.abs(disty) || disty == 0) {
            if (distx > 0){
                moves['left'] += 2
                console.log('Left is best')
            }else{
                moves['right'] += 2
                console.log('Right is best')
            }
            if (disty > 0){
                moves['down'] += 1
                console.log('Down is second')
            }else if (disty < 0){
                moves['up'] += 1
                console.log('Up is second')
            }
        }else if (disty != 0 && Math.abs(distx) < Math.abs(disty) || distx == 0) {
            if (disty > 0){
                moves['down'] += 2
                console.log('Down is best')
            }else{
                moves['up'] += 2
                console.log('Up is best')
            }
            if (distx > 0){
                moves['left'] += 1
                console.log('Left is second')
            }else if (distx < 0){
                moves['right'] += 1
                console.log('Right is second')
            }
        }
    }

    if(gameState.you.health > 15){
        console.log('--flood--')
        let flofil = flood(gameState, occupied)
        console.log(flofil)
        if (flofil[0] == 1){
            moves['up'] -= 100;
        }else{
            moves['up'] += flofil[0]
        }
        if (flofil[1] == 1){
            moves['down'] -= 100;
        }else{
            moves['down'] += flofil[1]
        }
        if (flofil[2] == 1){
            moves['left'] -= 100;
        }else{
            moves['left'] += flofil[2]
        }
        if (flofil[3] == 1){
            moves['right'] -= 100;
        }else{
            moves['right'] += flofil[3]
        }
    }

    console.log('---calculating move---')
    console.log(moves)
    let Pos = Object.keys(moves).filter(direct => moves[direct] > -999)
    let plan = 0
    if (Pos.length > 0){
        while (Pos.length > 1) {
            if (moves[Pos[plan]] > moves[Pos[plan + 1]]) {
                console.log(`${Pos[plan]} is better than ${Pos[plan + 1]}`)
                Pos.splice(plan + 1, 1)
            }else if (moves[Pos[plan]] < moves[Pos[plan + 1]]) {
                console.log(`${Pos[plan + 1]} is better than ${Pos[plan]}`)
                Pos.shift()
            }else if (moves[Pos[plan]] == moves[Pos[plan + 1]]){
                let rand = Math.floor(Math.random() * 2)
                console.log(`--two even weights, chose random ${rand}--`)
                if (rand == 1){
                    Pos.shift()
                }else{
                    Pos.splice(plan + 1, 1)
                }
            }else{
                console.log('error')
                break
            }
        }
        console.log(`MOVE ${gameState.turn}: ${Pos[0]}`)
        return { move : Pos[0]}
    }else{
        console.log(`MOVE ${gameState.turn}: I'm dead`)
        return { move : 'down'}
    }
}