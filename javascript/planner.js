        //for displaying the days
        let daysElement=document.getElementById('days');
        let days=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
        for(let day=0;day<7;day++){
         let el=document.createElement('th');
         el.innerHTML=days[day]+" ";
         daysElement.appendChild(el);
        }
        //jump to chosen month
        let selectMonth=document.getElementById('month');
        let months=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sept','Oct','Nov','Dec'];
        for(let month=0;month<12;month++){
            let option=document.createElement('option');
            option.value=month;
            option.innerHTML=months[month];
            selectMonth.appendChild(option);
        }
        //jump to the chosen year
        let selectYear=document.getElementById('year');
        let today=new Date();
        let currentYear=today.getFullYear();
        let currentMonth=today.getMonth();
        let limitYear=currentYear+20;
        for(let year=currentYear-20;year<=limitYear;year++){
          let option=document.createElement('option');
          option.value=year;
          option.innerHTML=year;
          selectYear.appendChild(option);
        }
        let monthAndYear=document.getElementById('monthAndYear');
        let plannerDate=document.getElementById('planner-date');
        displayCalendar(currentMonth,currentYear);

        //function to display the calendar
        function displayCalendar(month,year){
            let firstDay=(new Date(year,month)).getDay();
            let daysInMonth = 32 - new Date(year, month, 32).getDate();
            monthAndYear.innerHTML=months[month]+" "+year;
            plannerDate.innerHTML=today.getDate()+" "+months[today.getMonth()]+" "+today.getFullYear();
            let date=1;
            let table=document.getElementById('calendar-body');
            table.innerHTML="";
            for(let i=0;i<6;i++){
              let row=document.createElement('tr');
              table.appendChild(row);
              for(let j=0;j<7;j++){
                  if(i==0 && j<firstDay){
                      let cell=document.createElement('td');
                      cell.innerHTML="";
                      row.appendChild(cell);
                  }
                  else if(date > daysInMonth){
                      break;
                  }
                  else{
                     let cell=document.createElement('td');
                     cell.innerHTML=date;
                     if(date===today.getDate() && year===today.getFullYear() && month===today.getMonth()){
                         cell.style.background='lightgrey';
                         let todayDate=new Date(year,month,date)
                         getTasksFromServer(todayDate)
                     }
                     cell.addEventListener('click',()=>{
                        monthAndYear.innerHTML=(cell.innerHTML)+" "+months[month]+" "+year;
                        plannerDate.innerHTML=(cell.innerHTML)+" "+months[month]+" "+year;
                        let clickedDate=new Date(year,month,cell.innerHTML)
                        getTasksFromServer(clickedDate)
                     })
                     row.appendChild(cell);
                     date++; 
                  }
              }
            }
        }
        function previous(){
            currentYear=currentMonth==0?currentYear-1:currentYear;
            currentMonth=currentMonth==0?11:currentMonth-1;
            displayCalendar(currentMonth,currentYear);
        }
        function next(){
            currentYear=currentMonth==11?currentYear+1:currentYear;
            currentMonth=currentMonth==11?0:currentMonth+1;
            displayCalendar(currentMonth,currentYear);
        }
        function jump(){
            currentMonth=selectMonth.value;
            currentYear=selectYear.value;
            displayCalendar(currentMonth,currentYear);
        }
        let ul=document.getElementById('planner-content')
        function addTask(){
            let li=document.createElement('li')
            li.setAttribute("contenteditable","true")
            li.innerHTML=" "
            ul.appendChild(li)
        }
        function saveTasks(){
            let listLi=document.querySelectorAll('li')
            let tasks=[]
            for(i=0;i<listLi.length;i++){
                listLi[i].setAttribute("contenteditable","false")
                tasks.push(listLi[i].innerHTML)
            }
            console.log(tasks)
            sendTasksToServer(tasks)
        }
        function sendTasksToServer(tasks){
            let dateString=plannerDate.innerHTML
            let dateArray=dateString.split(" ")
            let t=dateArray[0]
            dateArray[0]=dateArray[1]
            dateArray[1]=t
            let joinedDateString=dateArray.join(" ")
            let taskCreatedDate=new Date(joinedDateString)
            let taskString=tasks.join(",")
            const taskDetails={
                date: taskCreatedDate,
                tasks: taskString
            }
            var xhr=new window.XMLHttpRequest();
            xhr.open('POST','/task',true)
            xhr.setRequestHeader('Content-Type','application/json;charset=UTF-8')
            xhr.send(JSON.stringify(taskDetails));
        
        }
        function getTasksFromServer(date){
            let URL="/task/"+date
            fetch(URL)
              .then((response) => response.text())
              .then((text) => {
                  let taskArray=text.split(",")
                  ul.innerHTML=''
                  for(let i=0;i<taskArray.length;i++){
                      let li=document.createElement('li')
                      li.setAttribute('contenteditable','true')
                      li.innerHTML=taskArray[i]
                      ul.appendChild(li)
                  }
              })
        }