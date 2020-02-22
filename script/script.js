appendDayContainers(2019, 1);

function appendDayContainers(year, month){
    const daysContainer = document.getElementById("days-container");
    const numberOfDayContainers = 42;

    const calendarArray = createCalendarArray(numberOfDayContainers, year, month);
    
    calendarArray.forEach(element => {
        daysContainer.append(createSpan('day-container', element));
    });
}

function createSpan(className, content) {
    const span = document.createElement('span');

    span.className = className;
    span.textContent = content;

    return span;
}

function createCalendarArray(numberOfDayContainers, year, month){
    const calendarArray = [];
    const firstDay = new Date(year, month, 1).getDay() - 1;  // 0 = Sunday, 1 = Monday
    const monthLength = new Date(year, month, 0).getDate();
    let counter = 1;

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