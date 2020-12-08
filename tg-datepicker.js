// SETTINGS START : PLEASE FEEL FREE TO CHANGE THE SETTINGS BELOW THIS LINE:
var weekStartsOn = 0; // 0 = Sunday, 1 = Monday
var localeString = 'en-GB'; //details:  https://www.w3schools.com/jsref/jsref_tolocalestring.asp
var dateFormatObj = {
    dateStyle: 'long'
}

//please change these settings to suit your language
var dayNames = [
    "Sunday",
    "Monday", 
    "Tuesday", 
    "Wednesday", 
    "Thursday", 
    "Friday", 
    "Saturday"
];

var monthNames = [
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
];

var makeInputDisabled = true;

// SETTINGS END : DO NOT EDIT BELOW THIS LINE!!!

function _(elRef) {
    var firstChar = elRef.substring(0, 1);
    
    if (firstChar == '.') {
        elRef = elRef.replace(/\./g, '');
        return document.getElementsByClassName(elRef);
    } else {
        return document.getElementById(elRef);
    }
}

var currentDate = new Date;
var datepickerCalendar;


// var datepickerTbl;
// var datepickerTopRow;
var datepickerTblTopRow = '';
var datepickerCanvas = 'large';

//build a top row for the datepickerCalendar
function buildTopRow() {


    if (weekStartsOn == 1) {
        var dayZero = dayNames[0];
        dayNames.shift();
        dayNames.push(dayZero);
    }

    datepickerTblTopRow = document.createElement("tr");
    datepickerTblTopRow.setAttribute("class", "tg-datepicker-row");

    for (var i = 0; i <= 6; i++) {
        var dayLabel = dayNames[i].substring(0, 2);
        var calendarTblTh = document.createElement("th");
        var calendarTblThTxt = document.createTextNode(dayLabel);
        calendarTblTh.appendChild(calendarTblThTxt);
        datepickerTblTopRow.appendChild(calendarTblTh);
    }

    return datepickerTblTopRow;

}

//listen for a datepicker input field getting clicked
var datepickers = _('.datepicker');
for (var i = 0; i < datepickers.length; i++) {
    datepickers[i].addEventListener("click", (ev) => {
        //build a datepickerCalendar and then add it to the page * (taking canvas size into account)
        buildDatepickerCalendar(ev.target);
    });
}

function buildDatepickerCalendar(clickedEl) {
    destroyDatepickerCalendars();

    datepickerCalendar = document.createElement("div");
    datepickerCalendar.setAttribute("class", "datepicker-calendar");

    if (datepickerCanvas == 'large') {
        clickedEl.parentNode.insertBefore(datepickerCalendar, clickedEl.nextSibling);
    } else {
        //create an overlay
    }

    var datepickerHead = buildDatepickerHead();
    datepickerCalendar.appendChild(datepickerHead);

    //build and populate calendar table
    var datepickerTbl = buildAndPopulateDatepickerTbl();
    datepickerCalendar.appendChild(datepickerTbl);

//         if (calendarCanvas == 'small') {
//             adjustCalendarHeight();
//         }

}

function destroyDatepickerCalendars() {
    var datepickerCalendars = _('.datepicker-calendar');
    
    if (datepickerCanvas == 'small') {

        if (datepickerCalendars.length>0) {
            document.getElementById("tg-calendar-overlay").remove();
        }
        
    } else {

        while(datepickerCalendars.length>0) {
            datepickerCalendars[0].remove();
        }

    }

}

function buildDatepickerHead() {

    var datepickerHead = document.createElement("div");
    datepickerHead.setAttribute("class", "datepicker-head");

    var datepickerHeadLeft = document.createElement("div");
    datepickerHead.appendChild(datepickerHeadLeft);

    var datepickerArrowDivLeft = document.createElement("div");
    datepickerArrowDivLeft.setAttribute("onclick", "changeMonth('down')");
    datepickerArrowDivLeft.setAttribute("class", "popup-arrow");

    var flipArrowSpan = document.createElement("span");
    flipArrowSpan.setAttribute("class", "flip-arrow");
    var datepickerNavArrowLeft = document.createTextNode("▸");
    flipArrowSpan.appendChild(datepickerNavArrowLeft);

    datepickerArrowDivLeft.appendChild(flipArrowSpan);
    datepickerHeadLeft.appendChild(datepickerArrowDivLeft);

    var datepickerHeadCenter = document.createElement("div");

    //javascript get month and year from date object

    var currentMonthNum = currentDate.getMonth(); //getMonth() returns month from 0-11 not 1-12
    var currentMonth = monthNames[currentMonthNum];
    var currentYear = currentDate.getFullYear();

    var datepickerHeadline = document.createTextNode(currentMonth + " " + currentYear);
    datepickerHeadCenter.appendChild(datepickerHeadline);
    
    datepickerHead.appendChild(datepickerHeadCenter);

    var datepickerHeadRight = document.createElement("div");
    var datepickerArrowDivRight = document.createElement("div");
    datepickerArrowDivRight.setAttribute("onclick", "changeMonth('up')");
    datepickerArrowDivRight.setAttribute("class", "popup-arrow");

    var datepickerNavArrowRight = document.createTextNode("▸");
    datepickerArrowDivRight.appendChild(datepickerNavArrowRight);
    datepickerHeadRight.appendChild(datepickerArrowDivRight);

    datepickerHead.appendChild(datepickerHeadRight);

    return datepickerHead;
}

function buildAndPopulateDatepickerTbl() {

    var datepickerTbl = document.createElement("table");
    datepickerTbl.appendChild(datepickerTblTopRow);

    var monthStartDayNum = getMonthStartDayNum();
    var numDaysInMonth = getNumDaysInMonth();
    var numWeeksThisMonth = Math.ceil(numDaysInMonth/7);

    if (weekStartsOn == 1) {
        var boxCounter = 0;
    } else {
        var boxCounter = -1;
    }
    
    var dayCounter = 0;

    var i = 1;

    do {
        //create a week row
        calendarWeekRow = document.createElement("tr");
        calendarWeekRow.setAttribute("class", "tg-datepicker-row");

        for (var colNum = 0; colNum < 7; colNum++) {
            boxCounter++; 
            var calendarTblTd = document.createElement("td");

            if ((boxCounter<monthStartDayNum) || (dayCounter>=numDaysInMonth)) {
                calendarTblTd.setAttribute("class", "empty-day");
                var boxText = ' ';
            } else {
                dayCounter++;
                var boxText = dayCounter;
            }

            var calendarTblTdTxt = document.createTextNode(boxText);
            calendarTblTd.appendChild(calendarTblTdTxt);
            calendarWeekRow.appendChild(calendarTblTd);
        }

        datepickerTbl.appendChild(calendarWeekRow);

      i++;
    }
    while (i <= numWeeksThisMonth);  

    // console.log(`The month start day number is ${monthStartDayNum}`);
    // console.log(`The numDaysInMonth is ${numDaysInMonth}`);
    // console.log(`The number of weeks this month is ${numWeeksThisMonth}`);

    return datepickerTbl;

}

function buildTopRow() {


    if (weekStartsOn == 1) {
        var dayZero = dayNames[0];
        dayNames.shift();
        dayNames.push(dayZero);
    }

    datepickerTblTopRow = document.createElement("tr");
    datepickerTblTopRow.setAttribute("class", "tg-datepicker-row");

    for (var i = 0; i <= 6; i++) {
        var dayLabel = dayNames[i].substring(0, 2);
        var calendarTblTh = document.createElement("th");
        var calendarTblThTxt = document.createTextNode(dayLabel);
        calendarTblTh.appendChild(calendarTblThTxt);
        datepickerTblTopRow.appendChild(calendarTblTh);
    }

    return datepickerTblTopRow;

}

function refreshDatepickerHead() {
    var baseElement = document.querySelector(".datepicker-head");
    var targetDiv = baseElement.querySelector("div:nth-child(2)");
    var currentMonthNum = currentDate.getMonth(); // getMonth() returns month from 0-11 not 1-12
    var currentMonth = monthNames[currentMonthNum];
    var currentYear = currentDate.getFullYear();
    var datepickerHeadline = currentMonth + ' ' + currentYear;
    targetDiv.innerHTML = datepickerHeadline;
}

function changeMonth(direction) {

    var m = currentDate.getMonth();

    if (direction == 'down') {
        var newM = m-1;
        currentDate.setMonth(newM);
    } else {
        var newM = m+1;
        currentDate.setMonth(newM);
    }

    refreshDatepickerHead();
    var childNodes = datepickerCalendar.childNodes;
    childNodes[i].remove();

    //build and populate calendar table   
    var datepickerTbl = buildAndPopulateDatepickerTbl();
    datepickerCalendar.appendChild(datepickerTbl); 
}

function getMonthStartDayNum() {
    var y = currentDate.getFullYear(); 
    var m = currentDate.getMonth();
    var firstDay = new Date(y, m, 1); 
    var monthStartDayNum = firstDay.getDay();
    return monthStartDayNum;
}

function getNumDaysInMonth() {
    var theMonth = currentDate.getMonth()+1; // Here January is 0 based
    var theYear = currentDate.getFullYear();
    return new Date(theYear, theMonth, 0).getDate();
}
































buildTopRow();