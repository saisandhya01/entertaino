let quoteDisplay=document.getElementById('quoteDisplay');
let quoteInput=document.getElementById('quoteInput');
let timer=document.getElementById('timer');
function randomQuoteGenerator(){
    return fetch('http://api.quotable.io/random')
      .then(response=> response.json())
      .then(data=> data.content)
}
async function addNewQuote(){
    const quote=await randomQuoteGenerator();
    quoteDisplay.innerHTML='';
    const quoteArray=quote.split('');
    quoteArray.forEach(character => {
        const span=document.createElement('span');
        span.innerHTML=character;
        quoteDisplay.appendChild(span);
    });
    quoteInput.value='';
    setTimer();
}
quoteInput.addEventListener('input',()=>{
    const arrayOfSpans=document.querySelectorAll('span');
    const arrayInput=quoteInput.value.split('');
    let correct=true;
    arrayOfSpans.forEach((characterSpan,index)=>{
        const characterInput=arrayInput[index];
        if(characterInput==null){
            characterSpan.classList.remove('correct')
            characterSpan.classList.remove('incorrect')
            correct=false;
        }
        else if(characterInput==characterSpan.innerHTML){
            characterSpan.classList.remove('incorrect')
            characterSpan.classList.add('correct')
        }
        else{
            characterSpan.classList.remove('correct')
            characterSpan.classList.add('incorrect')
            correct=false;
        }
    })
    if(correct){
        changeTimeToScore(timer.innerHTML)
        clearTimer();
    }
})
let interval=null;
function changeSeconds(){
    let second=Number(timer.innerHTML);
    second+=1;
    timer.innerHTML=second;
}
function setTimer(){
    interval=window.setInterval(changeSeconds,1000);
}
function clearTimer(){
    window.clearInterval(interval);
    inteval=null;
    timer.innerHTML=0;
    addNewQuote();
}
let score=0
function changeTimeToScore(time){
    if(time<=10){
      score=50
    }
    else if(time>10 && time<=20){
        score=30
    }
    else{
        score=0
    }
    sendScoreToServer(score)
}
function sendScoreToServer(score){
    const scoreDetails={
        name:'game1',
        score: score
    }
    var xhr=new window.XMLHttpRequest();
    xhr.open('POST','/score',true)
    xhr.setRequestHeader('Content-Type','application/json;charset=UTF-8')
    xhr.send(JSON.stringify(scoreDetails));
}
addNewQuote();
