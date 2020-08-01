let ball=document.getElementById('ball');
let game=document.getElementById('game');
let interval=null;
function randomlyCreateHoles(){
    let random=Math.floor(Math.random()*360);
    return random;
}
function moveLeft(){
    var left = parseInt(window.getComputedStyle(ball).getPropertyValue("left"));
    if(left>0){
        ball.style.left = left - 2 + "px";
    }
}
function moveRight(){
    var left = parseInt(window.getComputedStyle(ball).getPropertyValue("left"));
    if(left<380){
        ball.style.left = left + 2 + "px";
    }
}
let bothPressed=0;
document.addEventListener('keydown',(e)=>{
    if(bothPressed==0){
        bothPressed++;
      if(e.key==='ArrowLeft'){
          interval=setInterval(moveLeft,1)
      }
      else if(e.key==='ArrowRight'){
          interval=setInterval(moveRight,1)
      }
    }
})
document.addEventListener('keyup',e=>{
    clearInterval(interval)
    bothPressed=0;
})
let counter=0;
let currentPlatforms=[];
let platformInterval=setInterval(()=>{
    var platformLast = document.getElementById("platform"+(counter-1));
    var holeLast = document.getElementById("hole"+(counter-1));
    if(counter>0){
        var platformLastTop = parseInt(window.getComputedStyle(platformLast).getPropertyValue("top"));
        var holeLastTop = parseInt(window.getComputedStyle(holeLast).getPropertyValue("top"));
    }
    if(counter==0 || platformLastTop<400){
        let platform=document.createElement('div');
        platform.className='platform'
        platform.id='platform'+counter;
        platform.style.top=platformLastTop+100+"px";
        game.appendChild(platform);
        let hole=document.createElement('div');
        hole.className='hole'
        hole.id='hole'+counter;
        hole.style.top=holeLastTop+100+"px";
        game.appendChild(hole);
        let random=Math.floor(Math.random()*360)
        hole.style.left=random+"px";
        currentPlatforms.push(counter);
        counter++;
     
    }
    let ballTop = parseInt(window.getComputedStyle(ball).getPropertyValue("top"));
    var ballLeft = parseInt(window.getComputedStyle(ball).getPropertyValue("left"));
    let drop=0;
    if(ballTop <= 0){
        let score=counter-9;
        alert("Game over. Score: "+(score));
        clearInterval(platformInterval);
        sendScoreToServer(score)
        location.reload();
    }

    for(let i=0;i<currentPlatforms.length;i++){
       let current=currentPlatforms[i];
       let iplatform = document.getElementById("platform"+current);
       let ihole = document.getElementById("hole"+current);
       let iplatformTop = parseFloat(window.getComputedStyle(iplatform).getPropertyValue("top"));
       let iholeLeft = parseFloat(window.getComputedStyle(ihole).getPropertyValue("left"));
       iplatform.style.top = iplatformTop - 0.5 + "px";
       ihole.style.top = iplatformTop - 0.5 + "px";
       if(iplatformTop < -20){
           currentPlatforms.shift();
           iplatform.remove();
           ihole.remove();
       }
       if(iplatformTop-20<ballTop && iplatformTop>ballTop){
        drop++;
         if(iholeLeft<=ballLeft && iholeLeft+20>=ballLeft){
            drop = 0;
        }
       }
    }
    if(drop===0){
        if(ballTop < 480){
            ball.style.top = ballTop + 2 + "px";
        }
    }else{
        ball.style.top = ballTop - 0.5 + "px";
    }


},10)
function sendScoreToServer(score){
    const scoreDetails={
        name:'fallOutGame',
        score: score
    }
    var xhr=new window.XMLHttpRequest();
    xhr.open('POST','/score',true)
    xhr.setRequestHeader('Content-Type','application/json;charset=UTF-8')
    xhr.send(JSON.stringify(scoreDetails));

}