let scoreBoard=document.getElementById('score-board')
function getScores(){
    let URL="/score/table"
    fetch(URL)
      .then((response) => response.json())
      .then((data) => {
          console.log(data)
          renderScores(data)
      })

}
let yourName=''
function getName(){
    let URL="/name"
    fetch(URL)
      .then((response) => response.text())
      .then((data)=>{
          console.log(data)
          yourName=data
      })
}
let yourPosition=document.getElementById('your-position')
function renderScores(data){
    for(let i=0;i<5;i++){
        let row=document.createElement('tr')
        if(yourName===data[i].username){
            row.classList.add('your-rank')
            yourPosition.innerHTML=(i+1)
        }
        let rank=document.createElement('th')
        rank.innerHTML=(i+1)
        row.appendChild(rank)
        let username=document.createElement('th')
        username.innerHTML=data[i].username
        row.appendChild(username)
        let scores=document.createElement('th')
        scores.innerHTML=data[i].scores
        row.appendChild(scores)
        scoreBoard.appendChild(row)
    }
    //let index = data.findIndex(x => x.username === yourName);
    //console.log(index)
    //yourPosition.innerHTML=index+1
}
getName()
getScores()
