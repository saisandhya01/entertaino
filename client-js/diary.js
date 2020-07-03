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
        let diaryDate=document.getElementById('diary-date');
        displayCalendar(currentMonth,currentYear);

        //function to display the calendar
        function displayCalendar(month,year){
            let firstDay=(new Date(year,month)).getDay();
            let daysInMonth = 32 - new Date(year, month, 32).getDate();
            monthAndYear.innerHTML=months[month]+" "+year;
            diaryDate.innerHTML=today.getDate()+" "+months[today.getMonth()]+" "+today.getFullYear();
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
                     }
                     cell.addEventListener('click',()=>{
                        monthAndYear.innerHTML=(cell.innerHTML)+" "+months[month]+" "+year;
                        diaryDate.innerHTML=(cell.innerHTML)+" "+months[month]+" "+year;
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
