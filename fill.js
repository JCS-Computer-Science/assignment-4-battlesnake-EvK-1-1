export default function flood(gameState, occupied) {
    let wid = gameState.board.width - 1;
    let high = gameState.board.height - 1;
    let Head = gameState.you.body[0]
    let checked = {}
    let checkmap = {}
    let parity = {'arr' : []}
    for (let i = 0; i <= wid; i++){
        checked[i] = [];
    }
    let up = fill(occupied, Head.x, Head.y + 1, wid, high, checked, 1, checkmap, parity);
    let down = fill(occupied, Head.x, Head.y - 1, wid, high, checked, 2, checkmap, parity);
    let left = fill(occupied, Head.x - 1, Head.y, wid, high, checked, 3, checkmap, parity);
    let right = fill(occupied, Head.x + 1, Head.y, wid, high, checked, 4, checkmap, parity);
    let dirs = [up, down, left, right];
    console.log(dirs)
    if (parity['arr'].length > 0){
        for (let i = 0; i < parity['arr'].length; i++){
            let fir = parity['arr'][i].charAt(0)
            let sec = parity['arr'][i].charAt(0)
            let add = dirs[fir] + dirs[sec]
            dirs[fir] = add;
            dirs[sec] = add;
        }
    }
    console.log(dirs)
    return dirs;
}

function fill(occupied, x, y, wid, high, checked, group, checkmap, parity){
    // console.log(`--checking ${x} ${y}--`)
    let occ;
    if (occupied[x]){
        occ = occupied[x].indexOf(y);
    }else{
        occ = -1
    }
    if (occ != -1 || x > wid || x < 0 || y > high || y < 0){
        // console.log('-occupied or out of bounds-')
        return 0;
    }else if (checked[x].indexOf(y) != -1){
        // console.log('-already checked-')
        let other = checkmap[`${x}${y}`]
        parity['arr'].push(`${group}${other}`)
        return 0;
    }else{
        // console.log('-empty-')
        checked[x].push(y)
        checkmap[`${x}${y}`] = group;
        let left = 0;
        let right = 0;
        let down = 0;
        let up = 0;
        if(x > 0){
            left = fill(occupied, x - 1, y, wid, high, checked, group, checkmap, parity)
            console.log(left)
        }
        if(x < wid){
            right = fill(occupied, x + 1, y, wid, high, checked, group, checkmap, parity)
            console.log(right)
        }
        if(y > 0){
            down = fill(occupied, x, y - 1, wid, high, checked, group, checkmap, parity)
            console.log(down)
        }
        if(y < high){
            up = fill(occupied, x, y + 1, wid, high, checked, group, checkmap, parity)
            console.log(up)
        }
        let tot = 1 + left + right + down + up
        console.log(tot)
        return tot
    }
}