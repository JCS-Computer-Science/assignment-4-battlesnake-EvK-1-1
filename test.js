import { move } from "./moveLogicSeer.js";

let gameState = {
    board : {
        width : 11,
        height : 11
    }
}

console.log(move(gameState))