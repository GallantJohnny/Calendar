class CalendarEvent {
    constructor(year, month, day, start, finish) {
        this._year = year;
        this._month = month;
        this._day = day;
        this._start = start;
        this._finish = finish;
        this._title = "";
        this._importance = "low";
    }

    get year() {
        return this._year;
    }

    get month() {
        return this._month;
    }

    get day() {
        return this._day;
    }

    get start() {
        return this._start;
    }

    get finish() {
        return this._finish;
    }

    get title() {
        return this._title;
    }

    get importance() {
        return this._importance;
    }

    setTitle(title) {
        this._title = title;
    }

    setImportance(importance) {
        this._importance = importance;
    }
}

const event1 = new CalendarEvent(2020, 1, 22, 8, 9);
event1.setTitle("Daily standup");
event1.setImportance("high");
const event2 = new CalendarEvent(2020, 1, 22, 10, 11);
event2.setTitle("Meeting with John");
event2.setImportance("low");
const event3 = new CalendarEvent(2020, 1, 22, 17, 18);
event3.setTitle("Take out trash");
event3.setImportance("medium");

let events = [];

events.push(event1);
events.push(event2);
events.push(event3);

appendDayContainers(96, 2);
addListenersToMonths();
addListenersToYearBtns();
selectCurrentMonth();
renderEvents(events);

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
    const year = document.getElementById('year').firstChild.textContent;

    for (let i = 0; i < liMonths.length; i++) {
        liMonths[i].addEventListener('click', () => onMonthClicked(year, i, ul));
    }
}

function onMonthClicked(year, month, ul) {
    const eventMonth = document.getElementById('event-month');
    const monthString = new Date(year, month);
    const options = { month: 'long', day: 'numeric'};

    ul.getElementsByClassName('active')[0].className = "";
    ul.children[month].className = "active";

    console.log(month);
    console.log(options);
    eventMonth.textContent = new Intl.DateTimeFormat('en-US', options).format(monthString);

    removeDayContainers();
    appendDayContainers(year, month);
}

function appendDayContainers(year, month) {
    const daysContainer = document.getElementById("days-container");
    const numberOfDayContainers = 42;

    const calendarArray = createCalendarArray(numberOfDayContainers, year, month);

    calendarArray.forEach(element => {
        daysContainer.append(createSpan('day-container', element));
    });
}

function removeDayContainers() {
    const dayContainers = document.getElementById('days-container');

    while (dayContainers.lastChild) {
        dayContainers.removeChild(dayContainers.lastChild);
    }
}

function createSpan(className, content) {
    const span = document.createElement('span');

    span.className = className;
    span.textContent = content;

    return span;
}

function createCalendarArray(numberOfDayContainers, year, month) {
    const calendarArray = [];
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

    time.textContent = `${event.start} - ${event.finish}`;

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

    events.forEach(event => {
        eventsContainer.appendChild(createEventElement(event));
    });
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
    console.log(importance);

    importance.children[0].className = "importance-indicator low-importance"
    importance.children[1].className = "importance-indicator medium-importance"
    importance.children[2].className = "importance-indicator high-importance"

    clickedElement.className = `${clickedElement.className} selected-importance`;
}