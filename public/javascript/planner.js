
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
        let timeArray=['morning','afternoon','evening']
        for(let i=0;i<timeArray.length;i++){
            let time=timeArray[i];
            let heading=document.getElementById(time)
            let list=document.getElementById(time+'-list')
            let addTaskButton=document.getElementById('add-'+time)
            heading.onclick=(()=>{
                list.classList.toggle('block')
                addTaskButton.classList.toggle('inline-block')
            })
            addTaskButton.onclick=(()=>{
                addTask(time)
            })
        }
        function addTask(time){
            let ul=document.getElementById(time+'-list')
            let li=document.createElement('li')
            li.setAttribute("contenteditable","true")
            li.innerHTML=" "
            ul.appendChild(li)
        }
        function saveTasks(){
            let tasks=[[],[],[]]
            for(let i=0;i<timeArray.length;i++){
                let time=timeArray[i]
                let list=document.getElementById(time+'-list').getElementsByTagName('li')
                for(let j=0;j<list.length;j++){
                    let task=list[j].innerHTML
                    tasks[i].push(task)
                }
            }
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
            let tasksString=[]
            for(let i=0;i<tasks.length;i++){
                let string=tasks[i].join(',')
                tasksString.push(string)
            }
            const taskDetails={
                date: taskCreatedDate,
                morning: tasksString[0],
                afternoon: tasksString[1],
                evening: tasksString[2]
            }
            var xhr=new window.XMLHttpRequest();
            xhr.open('POST','/task',true)
            xhr.setRequestHeader('Content-Type','application/json;charset=UTF-8')
            xhr.send(JSON.stringify(taskDetails));
        
        }
        
        function isEmpty(obj) {
            return Object.keys(obj).length === 0;
        }            
        function makeItNull(){
            for(let i=0;i<timeArray.length;i++){
                let time=timeArray[i]
                let ul=document.getElementById(time+'-list')
                ul.innerHTML=''
            }
        }
        function getTasksFromServer(date){
            let URL="/task/"+date
            fetch(URL)
              .then((response) => response.json())
              .then((data) => {
                  const empty=isEmpty(data)
                  if(!empty){
                  for(let i=0;i<timeArray.length;i++){
                      let taskString=data[timeArray[i]]
                      let taskArray=taskString.split(",")
                      let time=timeArray[i]
                      let ul=document.getElementById(time+'-list')
                      ul.innerHTML=''
                      for(let j=0;j<taskArray.length;j++){
                          let li=document.createElement('li')
                          li.setAttribute('contenteditable','true')
                          li.innerHTML=taskArray[j]
                          ul.appendChild(li)
                      }
                  }
                }
                else{
                    makeItNull()
                }
                
              })
        }
        function deleteTasks(){
            console.log('delete button clicked!')
            let dateString=plannerDate.innerHTML
            let dateArray=dateString.split(" ")
            let t=dateArray[0]
            dateArray[0]=dateArray[1]
            dateArray[1]=t
            let joinedDateString=dateArray.join(" ")
            let taskCreatedDate=new Date(joinedDateString)
            let taskDetails={
                date: taskCreatedDate
            }
            var xhr=new window.XMLHttpRequest();
            xhr.open('DELETE','/task',true)
            xhr.setRequestHeader('Content-Type','application/json;charset=UTF-8')
            xhr.send(JSON.stringify(taskDetails));
            makeItNull()
        }