class CalendarEvent {
    constructor(year, month, day) {
        this._start = new Date(year, month, day, 12, 0);
        this._finish = new Date(year, month, day, 12, 0);
        this._title = "";
        this._importance = "low";
    }

    get year() {
        return this._start.getFullYear();
    }

    get month() {
        return this._start.getMonth();
    }

    get day() {
        return this._start.getDate();
    }

    get time() {
        const time = `${this._start.getHours()}:${this._start.getMinutes()}`;
        return time;
    }

    get title() {
        return this._title;
    }

    get importance() {
        return this._importance;
    }

    setFinish(finishDate) {
        this._finish = finishDate;
    }

    setTitle(title) {
        this._title = title;
    }

    setImportance(importance) {
        this._importance = importance;
    }
}

const event1 = new CalendarEvent(2020, 1, 22);
event1.setTitle("Daily standup");
event1.setImportance("high");
const event2 = new CalendarEvent(2020, 1, 22);
event2.setTitle("Meeting with John");
event2.setImportance("low");
const event3 = new CalendarEvent(2020, 1, 22);
event3.setTitle("Take out trash");
event3.setImportance("medium");
const event4 = new CalendarEvent(2020, 2, 15);
event4.setTitle("Mown lawn");
event4.setImportance("medium");

let events = [];

events.push(event1);
events.push(event2);
events.push(event3);
events.push(event4);
console.log(events);

const monthString = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
]

setYear();
setDateOnEvents();
appendDayContainers(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
addListenersToMonths();
addListenersToYearBtns();
selectCurrentMonth();


function setDateOnEvents(date = new Date()) {
    const yearMonthContainer = document.getElementById('events-header').children[0];
    const year = yearMonthContainer.children[0];
    const month = yearMonthContainer.children[1];
    const optionY = { year: 'numeric' };
    const optionM = { month: 'long', day: 'numeric' };

    year.textContent = new Intl.DateTimeFormat('en-US', optionY).format(date);
    month.textContent = new Intl.DateTimeFormat('en-US', optionM).format(date);
}

function setYear() {
    const year = document.getElementById('year').children[0];

    year.textContent = new Date().getFullYear();
}

function selectCurrentMonth() {
    const currentMonth = new Date().getMonth();
    const ul = document.getElementById('months-list-container').children[0];

    ul.children[currentMonth].className = "active";
}

function setCurrentYear() {
    const currentYear = new Date().getFullYear();
    const yearContainer = document.getElementById('year').children[0];

    yearContainer.textContent = currentYear;
}

function changeYear(valueChange) {
    const yearContainer = document.getElementById('year').children[0];
    const ul = document.getElementById('months-list-container').children[0];
    const eventYear = document.getElementById('event-year');
    let currentYear = parseInt(yearContainer.textContent);

    currentYear += valueChange;
    yearContainer.textContent = currentYear;
    eventYear.textContent = currentYear;

    addListenersToMonths();
    onMonthClicked(currentYear, 0, ul);
}

function addListenersToYearBtns() {
    const btns = document.getElementsByClassName('arrow-container');
    const leftBtn = btns[0].children[0];
    const rightBtn = btns[1].children[0];

    leftBtn.addEventListener('click', () => changeYear(-1));
    rightBtn.addEventListener('click', () => changeYear(1));
}

function addListenersToMonths() {
    const ul = document.getElementById('months-list-container').children[0];
    const liMonths = ul.children;
    const year = document.getElementById('year').children[0].textContent;

    for (let i = 0; i < liMonths.length; i++) {
        liMonths[i].addEventListener('click', () => onMonthClicked(year, i, ul));
    }
}

function onMonthClicked(year, month, ul) {
    const eventMonth = document.getElementById('event-month');
    const monthString = new Date(year, month);
    const options = { month: 'long', day: 'numeric' };
    const selectedDay = returnSlectedDay();
    const eventsToRender = returnEventsOnDay(findEventsInMonth(month), selectedDay);

    ul.getElementsByClassName('active')[0].className = "";
    ul.children[month].className = "active";

    eventMonth.textContent = new Intl.DateTimeFormat('en-US', options).format(monthString);

    removeDayContainers();
    appendDayContainers(year, month, selectedDay);
    renderEvents(eventsToRender);
}

function appendDayContainers(year, month, selectedDay) {
    const daysContainer = document.getElementById("days-container");
    const numberOfDayContainers = 42;
    let i = 0;

    const calendarArray = createCalendarArray(numberOfDayContainers, year, month);
    calendarArray.forEach(element => {
        let className = "";

        if (element === 'x') {
            className = 'out-of-month-day-container';
        } else if (element === parseInt(selectedDay)) {
            className = 'day-container day-selected';
        } else {
            className = 'day-container';
        }

        daysContainer.append(createDayElement(className, element, i));
        i++;
    });
}

function returnSlectedDay() {
    const daysContainer = document.getElementById("days-container");
    const children = daysContainer.children;
    const regDaySelected = /day-selected/;

    for (let i = 0; i < children.length; i++) {
        if (regDaySelected.test(children[i].className)) {
            console.log(children[i].children[0].textContent);
            return children[i].children[0].textContent;
        }
    }
}

function removeDayContainers() {
    const dayContainers = document.getElementById('days-container');

    while (dayContainers.lastChild) {
        dayContainers.removeChild(dayContainers.lastChild);
    }
}

function createDayElement(className, content, i) {
    const div = document.createElement('div');
    const spanNumber = document.createElement('span');
    const spanEvents = document.createElement('span');
    const eventsIndicator = document.createElement('div');
    const eventLow = document.createElement('span');
    const eventMedium = document.createElement('span');
    const eventHigh = document.createElement('span');
    const month = document.getElementById('event-month');
    const regex1 = /\d+/g;
    const regex2 = /\D+/g;
    const monthInteger = monthString.indexOf(month.textContent.match(regex2)[0].trim());

    div.className = className;
    div.id = i;
    spanNumber.className = "day-number";
    spanEvents.className = "day-events";
    spanNumber.textContent = content;

    eventsIndicator.className = "day-events-indicator-container";
    eventLow.className = "day-events-indicator low-importance";
    eventMedium.className = "day-events-indicator medium-importance";
    eventHigh.className = "day-events-indicator high-importance";

    if (isThereImportanceEvent(monthInteger, content, "low")) eventsIndicator.appendChild(eventLow);
    if (isThereImportanceEvent(monthInteger, content, "medium")) eventsIndicator.appendChild(eventMedium);
    if (isThereImportanceEvent(monthInteger, content, "high")) eventsIndicator.appendChild(eventHigh);

    if (content !== 'x') {
        div.addEventListener('click', function () {
            deselectDays();
            renderEventsOnDaySelect(content);
            month.textContent = month.textContent.replace(regex1, content);
            document.getElementById(i).className = `${className} day-selected`;
        });
    }

    spanEvents.appendChild(eventsIndicator);
    div.appendChild(spanNumber);
    div.appendChild(spanEvents);

    return div;
}

function renderEventsOnDaySelect(day) {
    const month = document.getElementById('event-month');
    const regex = /\D+/g;
    const monthInteger = monthString.indexOf(month.textContent.match(regex)[0].trim());
    const events = returnEventsOnDay(findEventsInMonth(parseInt(monthInteger)), parseInt(day));

    renderEvents(events);
}

function createCalendarArray(numberOfDayContainers, year, month) {
    const calendarArray = [
        {
            day: 0,
            low: false,
            medium: false,
            high: false,
        }
    ];
    let firstDay = new Date(year, month, 1).getDay() - 1;  // 0 = Sunday, 1 = Monday ...
    const monthLength = new Date(year, month + 1, 0).getDate();  // month: Jan = 1, Feb = 2 ...
    let counter = 1;

    if (firstDay == -1) firstDay = 6;

    for (let i = 0; i < numberOfDayContainers; i++) {
        if (i >= firstDay && counter <= monthLength) {
            calendarArray[i] = counter;
            counter++
        } else {
            calendarArray[i] = 'x';
        }
    }

    return calendarArray;
}

function createEventElement(event) {
    const outerContainer = document.createElement('div');
    const innerContainer = document.createElement('div');
    const time = document.createElement('p');
    const title = document.createElement('p');
    const importance = document.createElement('span');

    innerContainer.className = "orange-bc font-gray";

    time.textContent = event.time;

    title.textContent = event.title;

    importance.className = `importance-indicator ${event.importance}-importance`;

    innerContainer.appendChild(importance);
    innerContainer.appendChild(time);

    outerContainer.appendChild(innerContainer);
    outerContainer.appendChild(title);

    return outerContainer;
}

function renderEvents(events) {
    const eventsContainer = document.getElementById('events-container');

    removeEvents();

    events.forEach(event => {
        eventsContainer.appendChild(createEventElement(event));
    });
}

function removeEvents() {
    const eventsContainer = document.getElementById('events-container');

    while (eventsContainer.lastChild) {
        eventsContainer.lastChild.remove();
    }
}

function eventsSwimRight() {
    const events = document.getElementById("events").children[0];
    const cancelBtn = document.getElementById("create-event-btn");
    const acceptBtn = document.getElementById("accept-changes-btn");

    if (events.className === "swim-right") {
        events.className = "swim-static";
        acceptBtn.className = "events-creation-buttons";
        cancelBtn.style.transform = "";
        cancelBtn.style.backgroundColor = "";
    } else {
        events.className = "swim-right";
        acceptBtn.className = "events-creation-buttons accept-btn-visable";
        cancelBtn.style.transform = "rotate(0deg)";
        cancelBtn.style.backgroundColor = "rgb(231, 114, 114)";
    }
}

function changeImportanceSelection(clickedElement) {
    const importance = document.getElementById('importance-picker').children[1];

    importance.children[0].className = "importance-indicator low-importance"
    importance.children[1].className = "importance-indicator medium-importance"
    importance.children[2].className = "importance-indicator high-importance"

    clickedElement.className = `${clickedElement.className} selected-importance`;
}

function deselectDays() {
    const deselectFrom = document.getElementById('days-container');
    const selectedDay = deselectFrom.getElementsByClassName('day-selected');

    selectedDay[0].className = 'day-container';
}

function findEventsInMonth(month) {
    let eventsInMonth = [];

    events.forEach(event => {
        if (event.month === month) eventsInMonth.push(event);
    });

    //console.log("Events at month " + month + ": ");
    //console.log(eventsInMonth);

    return eventsInMonth;
}

function returnEventsOnDay(eventsInMonth, day) {
    let eventsOnDay = [];

    eventsInMonth.forEach(event => {
        if (event.day === day) eventsOnDay.push(event);
    });

    //console.log("Events at day " + day + ": ");
    //console.log(eventsOnDay);

    return eventsOnDay;
}

function isThereImportanceEvent(month, day, importance) {
    const eventsOnDay = returnEventsOnDay(findEventsInMonth(month), day);
    let isThereEvent = false;
    //console.log("[isThereImportanceEvent] eventsOnDay:");
    //console.log(eventsOnDay);

    //console.log("For " + importance + " :")

    eventsOnDay.forEach(event => {
        if (event.importance === importance) {
            console.log("return true");
            isThereEvent = true;
        }
    });
    //console.log("return flase");
    return isThereEvent;
}

function addEventClicked() {
    const eventTitle = document.getElementById("event-title");
    const eventDesc = document.getElementById("event-desc");
    const titleVal = eventTitle.value;
    const descVal = eventDesc.value;
    const year = document.getElementById('event-year').textContent;
    const monthDay = document.getElementById('event-month').textContent;
    const regDay = /\d+/g;
    const regMonth = /\D+/g;
    const month = monthDay.match(regMonth)[0].trim();
    const day = monthDay.match(regDay)[0];
    const importance = returnSelectedPrioity();

    //console.log(monthString.indexOf(month), day);
    const event = new CalendarEvent(year, monthString.indexOf(month), day);

    if (titleVal && descVal) {
        event.setTitle(titleVal);
        event.setImportance(importance);
        events.push(event);
        removeDayContainers();
        appendDayContainers(year, monthString.indexOf(month), day);
        clearEventForm();
    } else {

    }

    //console.log(event);
}

function clearEventForm() {
    const eventTitle = document.getElementById("event-title");
    const eventDesc = document.getElementById("event-desc");

    eventTitle.value = "";
    eventDesc.value = "";

    eventsSwimRight();
}

function returnSelectedPrioity() {
    const importanceContainer = document.getElementById('importance-picker').children[1].children;
    let importance = ['low', 'medium', 'high'];
    const regex = /selected-importance/;

    //console.log(importanceContainer);
    for (let i = 0; i < importanceContainer.length; i++) {
        //console.log(importanceContainer[i]);
        if (regex.test(importanceContainer[i].className)) {
            selected = importanceContainer[i];
            //console.log(importance[i]);
            return importance[i];
        }
    }
}