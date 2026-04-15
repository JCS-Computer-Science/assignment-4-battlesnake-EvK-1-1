export function move(gameState) {
    const REDGE = gameState.board.width - 1;
    const TEDGE = gameState.board.height - 1;

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
        map[i][TEDGE] -= 0.25
    }

    //food weighting
    
    //around snake weighting

    return map;
}