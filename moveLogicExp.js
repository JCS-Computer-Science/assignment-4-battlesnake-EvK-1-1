export function gameCons(gamestate){
    this.gameId = gamestate.id
    this.target = {x:0,y:0}
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
    
    const Body = gameState.you.body
    const Head = Body[0]
    const TopEdge = gameState.board.height - 1
    const RightEdge = gameState.board.width - 1

    console.warn('---checking for edge---')
    if (Head.x == 0){
        moves['left'] = -999
        console.log('left')
    }else if (Head.x == RightEdge){
        moves['right'] = -999
        console.log('right')
    }
    if (Head.y == 0){
        moves['down'] = -999
        console.log('down')
    }else if (Head.y == TopEdge){
        moves['up'] = -999
        console.log('up')
    }

    console.warn('---checking self---')
    for (let i = 1; i < gameState.you.body.length - 1; i++) {
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
        if (enemy[0].x != Head.x && enemy[0].y != Head.y){
            for (let j = 0; j < enemy.length - 1; j++){
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
        }
    }

    console.log('---calculating move---')
    const Pos = Object.keys(moves).filter(direct => moves[direct] > -999)
    let plan = 0
    if (Pos.length > 0){
        while (Pos.length > 1) {
            if (moves[plan] > moves[plan + 1]) {
                Pos.splice(plan + 1, 1)
            }else if (moves[plan] < moves[plan + 1]) {
                Pos.shift()
            }else if (moves[plan] == moves[plan + 1]){
                let rand = Math.floor(Math.random() * 2)
                console.log(`--two even weights, chose random ${rand}--`)
                if (rand == 1){
                    Pos.shift()
                }else{
                    Pos.splice(plan + 1, 1)
                }
            }
        }
        console.log(`MOVE ${gameState.turn}: ${Pos[0]}`)
        return { move : Pos[0]}
    }else{
        console.log(`MOVE ${gameState.turn}: I'm dead`)
        return { move : 'down'}
    }
}