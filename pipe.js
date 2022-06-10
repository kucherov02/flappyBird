const HOLE_HEIGHT = 194;
const PIPE_WIDTH = 87;
let pipes = []; //array of pipes
let timeSinceLastPipe; 
const PIPE_INTERVAL = 1200;
const PIPE_SPEED = 0.5;
let pipePassedCount;

const counter = document.querySelector(".counter");


export function updatePipes(delta){
    timeSinceLastPipe += delta;

    if(timeSinceLastPipe > PIPE_INTERVAL){ //control of appearing of new pipes
        timeSinceLastPipe -= PIPE_INTERVAL;
        createPipe();
    }

    pipes.forEach(pipe =>{
        if(pipe.left + PIPE_WIDTH < 0){ //if the pipe is out of screen 
            pipePassedCount++;
            counter.textContent = `Counter: ${pipePassedCount}`;
            return pipe.remove();
        }
        pipe.left = pipe.left - delta*PIPE_SPEED;
    });
}

export function setupPipes() {     
    document.documentElement.style.setProperty("--pipe-width", PIPE_WIDTH)
    document.documentElement.style.setProperty("--hole-height", HOLE_HEIGHT)
    pipes.forEach(pipe => pipe.remove())
    timeSinceLastPipe = PIPE_INTERVAL

    pipePassedCount = 0;
  }

export function getPassedPipesCount(){
    return pipePassedCount;
}

export function getPipeRects() { //get pipe position
    return pipes.flatMap(pipe => pipe.rects())
}

function createPipe(){
    const pipeElem = document.createElement("div");
    const topElem = createSegment("top");
    const bottomElem = createSegment("bottom");

    pipeElem.appendChild(topElem);
    pipeElem.appendChild(bottomElem);
    pipeElem.classList.add("pipe");
    pipeElem.style.setProperty("--hole-top", getRandomNumberBetween(HOLE_HEIGHT*1.5, window.innerHeight - HOLE_HEIGHT*0.5)); //put the hole to the random place of pipe

    const pipe = {
        get left(){
            return parseFloat(getComputedStyle(pipeElem).getPropertyValue("--pipe-left"));
        },
        set left(value){
            pipeElem.style.setProperty("--pipe-left", value);
        }, 
        remove() {
            pipes = pipes.filter(p => p !== pipe)
            pipeElem.remove()
          },
          rects() {
            return [
              topElem.getBoundingClientRect(),
              bottomElem.getBoundingClientRect(),
            ]
          },
    }

    pipe.left = window.innerWidth;
    document.body.appendChild(pipeElem);
    pipes.push(pipe);
}   


function createSegment(position){
    const elem = document.createElement("div");
    elem.classList.add("segment", position);

    return elem;
}


function getRandomNumberBetween(min, max){  
    return Math.floor(Math.random()*(max - min + 1 )+min);
}