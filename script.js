import {updateBird, setupBird, getBirdRect} from "./bird.js"
import {updatePipes, setupPipes, getPassedPipesCount, getPipeRects} from "./pipe.js"


//record handling 
let recordNum;

if(localStorage.getItem("record") === null){
    recordNum = 0; 
    localStorage.setItem("record", JSON.stringify(recordNum));    
}else{
    recordNum = JSON.parse(localStorage.getItem("record"));
}


//query all elements of modal-window
const modal = document.querySelector(".modal-character");
const characterPanel = document.querySelector(".character-panel");
const counter = document.querySelector(".counter");
const record = document.querySelector(".record");

//creating array of characters  
let characterBtns = [];
characterBtns.push(createCharacterBtn("./images/lazurik.png"));
characterBtns.push(createCharacterBtn("./images/kazhan.png"));
characterBtns.push(createCharacterBtn("./images/kimt.png"));

//appneding all the buttons to the modal
addBtn(characterBtns);
function addBtn(characterBtns){
    for(let btn of characterBtns ){
        characterPanel.appendChild(btn);
    }
}


//create the button of character 
function createCharacterBtn(imgSrc){
    const btn = document.createElement("button");
    const img = document.createElement("img");
    img.src = imgSrc;
    btn.setAttribute("data-img",imgSrc);
    btn.appendChild(img);

    btn.classList.add("character-button");
    return btn;
}

const btns = document.querySelectorAll(".character-button");

btns.forEach( btn =>{
    btn.addEventListener("click", chooseCharacter);
});

//open modal window
openModal();

function openModal(){
    modal.classList.add("active");
}

function chooseCharacter(e){
    const bird = document.querySelector(".bird");

    bird.src = e.target.dataset.img;    //changing the img of character 
    modal.classList.remove("active");   //close the modal
    handleStart();                      //start of the game 
}

//query the gray-background, title with amount of passed pipes
const gray = document.querySelector(".gray");
const title = document.querySelector(".title");
const subtitle = document.querySelector(".subtitle");

//variable with the last time of updating th frame 
let lastTime; 


function updateLoop(time){
    if(lastTime == null){
        lastTime = time;
        window.requestAnimationFrame(updateLoop); //update frame
        return;
    }
    const delta = time - lastTime; //delta between updating frames
    updateBird(delta);         //update bird position
    updatePipes(delta);        //update pipes positions 
    if(checkLose()) return handleLose();    //stop updating frame if game is losing 
    lastTime = time;
    window.requestAnimationFrame(updateLoop);     //update frame
}


function checkLose(){
    const birdPos = getBirdRect();  // get position of the bird
    const insidePipe = getPipeRects().some(rect => isCollision(birdPos, rect));  //checking for collision with pipes
    const outsideWorld = birdPos.top < 0 || birdPos.bottom > window.innerHeight; //checking for going outside the screen 

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

//starting the game

function handleStart(){
    btns.forEach( btn => btn.removeEventListener("click",chooseCharacter));
    title.classList.add("hide");
    gray.classList.add("hide");
    counter.classList.remove("hide");
    record.classList.remove("hide");
    setupBird();    //setup startposition of bird
    setupPipes();   // setup startposition of pipe
    lastTime = null;
    record.textContent = `Record: ${recordNum}`;
    window.requestAnimationFrame(updateLoop);   //start updating animation
}



function handleLose(){  
    setTimeout(() =>{
      title.classList.remove("hide");
    subtitle.classList.remove("hide");
    gray.classList.remove("hide");
    counter.classList.add("hide");
    record.classList.add("hide");
    counter.textContent = `Counter: 0`;
    subtitle.textContent = `${getPassedPipesCount()} pipes`;
    document.addEventListener("keypress", handleStart, {once: true});  

    if(getPassedPipesCount() > recordNum){
        recordNum = getPassedPipesCount();
        localStorage.setItem("record",JSON.stringify(recordNum));
    }
    }, 150);
}


//record functions

function getRecord(){
    return recordNum;
}

function setRecord(value){
    recordNum = value;
}