import {updateBird, setupBird, getBirdRect} from "./bird.js"
import {updatePipes, setupPipes, getPassedPipesCount, getPipeRects} from "./pipe.js"

document.addEventListener("keypress", handleStart, {once: true});
const gray = document.querySelector(".gray");
const title = document.querySelector(".title");
const subtitle = document.querySelector(".subtitle");
let lastTime; 

function updateLoop(time){
    if(lastTime == null){
        lastTime = time;
        window.requestAnimationFrame(updateLoop);
        return;
    }
    const delta = time - lastTime;
    updateBird(delta);
    updatePipes(delta);
    if(checkLose()) return handleLose();
    lastTime = time;
    window.requestAnimationFrame(updateLoop);
}

function checkLose(){
    const birdPos = getBirdRect();
    const insidePipe = getPipeRects().some(rect => isCollision(birdPos, rect)); 
    const outsideWorld = birdPos.top < 0 || birdPos.bottom > window.innerHeight;

    return outsideWorld || insidePipe;
}

function isCollision(rect1,rect2){
    return (
        rect1.left < rect2.right &&
        rect1.top < rect2.bottom &&
        rect1.right > rect2.left &&
        rect1.bottom > rect2.top
      )
}


function handleStart(){
    title.classList.add("hide");
    gray.classList.add("hide");
    setupBird();
    setupPipes();
    lastTime = null;
    window.requestAnimationFrame(updateLoop);

}



function handleLose(){
    setTimeout(() =>{
      title.classList.remove("hide");
    subtitle.classList.remove("hide");
    gray.classList.remove("hide");
    subtitle.textContent = `${getPassedPipesCount()} pipes`;
    document.addEventListener("keypress", handleStart, {once: true});  
    }, 150);
}