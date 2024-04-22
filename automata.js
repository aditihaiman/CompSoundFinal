const grid_size = 15;
let step_interval_id = 0;
let grid = []


let next_grid;

let neighbors = {}

$(function () {
    reset_grid();
    next_grid = grid;
    do_canvas();
    $("#canvas").on('click', function(e){
        update_canvas(e);
    });
    setup_neighbors();
    console.log(neighbors);
    $("#start").on('click', function(e){
        step_interval_id = setInterval(step_grid, 500);
        $("#start").prop("disabled",true);
        $("#stop").prop("disabled",false);
    })
    $("#stop").on('click', function(e){
        clearInterval(step_interval_id);
        $("#stop").prop("disabled",true);
        $("#start").prop("disabled",false);
    })
    $("#clear").on('click', reset_grid);
});

function reset_grid(){
    grid = [];
    for (let i = 0; i < grid_size; i++) {
        grid.push([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    }
    update_canvas();
}

function step_grid(){
    for(let i = 0; i < grid_size; i++){
        for(let j = 0; j < grid_size; j++){
            let alive_neighbors = 0;
            let curr_alive = false;
            let n = neighbors[[i,j]];
            for(let neighbor of n){
                // console.log(neighbor);
                if(grid[neighbor[0]][neighbor[1]]) alive_neighbors++;
                if(grid[i][j]) curr_alive = true;
            }
            //RULE
            if(curr_alive){
                if(alive_neighbors < 2 || alive_neighbors > 3) next_grid[i][j] = 0;
            }
            else{
                if(alive_neighbors == 3) next_grid[i][j] = 1;
            }
        }
    }
    grid = next_grid;
    update_canvas();
}

function setup_neighbors(){
    for(let i = 0; i < grid_size; i++){
        for(let j = 0; j < grid_size; j++){
            neighbor = []
            if(i-1 >= 0){
                neighbor.push([i-1, j]);
                if(j-1 >= 0) neighbor.push([i-1, j-1]);
                if(j+1 < grid_size) neighbor.push([i-1, j+1]);
            }
            if(i+1 < grid_size){
                neighbor.push([i+1, j]);
                if(j-1 >= 0) neighbor.push([i+1, j-1]);
                if(j+1 < grid_size) neighbor.push([i+1, j+1]);
            }
            if(j-1 >= 0) neighbor.push([i, j-1]);
            if(j+1 < grid_size) neighbor.push([i, j+1]);
            neighbors[[i,j]] = neighbor;
        }
    }
}

//https://stackoverflow.com/questions/55677/how-do-i-get-the-coordinates-of-a-mouse-click-on-a-canvas-element
function getCursorPosition(event) {
    const canvas = document.getElementById('canvas');
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((event.clientX - rect.left)/20);
    const y = Math.floor((event.clientY - rect.top)/20);
    return [y, x];
}

function do_canvas() {
    let canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "rgb(255, 255, 255)";
    update_canvas(ctx);
}

function update_canvas(event) {
    let canvas = document.getElementById('canvas');
    let cursor_pos;
    if(event) cursor_pos = getCursorPosition(event);
    console.log(cursor_pos);
    if(cursor_pos && !isNaN(cursor_pos[0]) && !isNaN(cursor_pos[1])) {
        grid[cursor_pos[0]][cursor_pos[1]] = !grid[cursor_pos[0]][cursor_pos[1]];
    }
    console.log(grid);

    const ctx = canvas.getContext("2d");
    for (let i = 0; i < grid_size; i++) {
        for (let j = 0; j < grid_size; j++) {
            if (grid[j][i]) {
                ctx.fillStyle = "rgb(144, 3, 252)";
                // console.log(ctx.fillStyle);
            }
            else ctx.fillStyle = "rgb(255, 255, 255)";
            ctx.fillRect(i * 20, j * 20, 20, 20);
            ctx.strokeRect(i * 20, j * 20, 20, 20);
        }
    }
}



