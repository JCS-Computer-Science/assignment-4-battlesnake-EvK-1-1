import { move } from "./moveLogicSeer.js";

let gameState = {
    board : {
        width : 11,
        height : 11,
        food : [{x : 3, y : 8}, {x : 0, y : 2}]
    }
}
let mv = move(gameState)

for (let i = 10; i >= 0; i--){
    let row = mv[i]
    console.log(` ${row[0]} ${row[1]} ${row[2]} ${row[3]} ${row[4]} ${row[5]} ${row[6]} ${row[7]} ${row[8]} ${row[9]} ${row[10]}`)
}