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
function renderScores(data){
    for(let i=0;i<data.length;i++){
        let row=document.createElement('tr')
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

}
getScores()
