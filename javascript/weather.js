let tempDegree=document.querySelector('.temperature-degree')
let tempDescription=document.querySelector('.temperature-description')
let timeZone=document.querySelector('.location-timezone')
let iconSelector=document.getElementById('location-icon')
window.addEventListener('load',()=>{
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(position=>{
            let latitude=position.coords.latitude
            let longitude=position.coords.longitude
            const api=`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&appid={API_KEY}` 
            fetch(api)
              .then(response => response.json())
              .then(data => {
                 console.log(data)
                 timeZone.innerHTML=data.timezone
                 tempDegree.innerHTML=data.current.temp
                 tempDescription.innerHTML=data.current.weather[0].description
                 let iconId=data.current.weather[0].id
                 let icon=document.createElement('i')
                 icon.className=`owf owf-${iconId} owf-5x`
                 iconSelector.appendChild(icon)
              })

        })
    }
})
