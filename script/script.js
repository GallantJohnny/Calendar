appendDayContainers(96, 2);
addListenersToMonths();
selectCurretnMonth();

function selectCurretnMonth(){
    const currentMonth = new Date().getMonth();
    const ul = document.getElementById('months-list-container').children[0];
    
    console.log(ul.children);
    ul.children[currentMonth].className = "active";
}

function addListenersToMonths(){
    const ul = document.getElementById('months-list-container').children[0];
    const liMonths =  ul.children;
    const year = document.getElementById('year').firstChild.textContent;

    console.log(ul);

    for (let i = 0; i < liMonths.length; i++){
        liMonths[i].addEventListener('click', () => onMonthClicked(year, i, ul));
    }
}

function onMonthClicked(year, month, ul){

    ul.getElementsByClassName('active')[0].className = ""; 
    ul.children[month].className = "active";

    removeDayContainers();
    appendDayContainers(year, month);
}

function appendDayContainers(year, month){
    const daysContainer = document.getElementById("days-container");
    const numberOfDayContainers = 42;

    const calendarArray = createCalendarArray(numberOfDayContainers, year, month);
    
    calendarArray.forEach(element => {
        daysContainer.append(createSpan('day-container', element));
    });
}

function removeDayContainers(){
    const dayContainers =  document.getElementById('days-container');

    while (dayContainers.lastChild){
        dayContainers.removeChild(dayContainers.lastChild);
    }
}

function createSpan(className, content) {
    const span = document.createElement('span');

    span.className = className;
    span.textContent = content;

    return span;
}

function createCalendarArray(numberOfDayContainers, year, month){
    const calendarArray = [];
    let firstDay = new Date(year, month, 1).getDay() - 1;  // 0 = Sunday, 1 = Monday ...
    const monthLength = new Date(year, month + 1, 0).getDate();  // month: Jan = 1, Feb = 2 ...
    let counter = 1;

    if (firstDay == -1) firstDay = 6; 

    for(let i = 0; i < numberOfDayContainers; i++){
        if (i >= firstDay && counter <= monthLength){
            calendarArray[i] = counter;
            counter++
        } else {
            calendarArray[i] = 'x';
        }
    }

    return calendarArray;
}