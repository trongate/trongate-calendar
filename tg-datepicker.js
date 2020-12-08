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


var unavailableBefore = new Date(2020, 11, 4);
var unavailableAfter = new Date(2021, 2, 12);


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
var todayDate = new Date;
var datepickerCalendar;
var clickedEl;

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
        clickedEl = ev.target;
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

    if ((monthStartDayNum>0) && (numWeeksThisMonth<5)) {
        numWeeksThisMonth = 5;
    }

    if (weekStartsOn == 1) {
        var boxCounter = 0;
    } else {
        var boxCounter = -1;
    }
    
    var dayCounter = 0;

    var i = 1;
    var isCurrentDay = false;
    var isAvailable = false;

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

                //test to see if this box is clickable (available)
                isAvailable = testForIsAvailable(dayCounter);

                if (isAvailable == false) {
                    calendarTblTd.setAttribute("class", "unavailable-day");
                } else {

                    if (isCurrentDay !== true) {
                        isCurrentDay = testForCurrentDay(dayCounter);
                    }
                    
                    if (isCurrentDay == true) {
                        calendarTblTd.setAttribute("class", "current-day");
                        isCurrentDay = false;
                    }

                    calendarTblTd.setAttribute("onclick", "clickDay('" + boxText + "')")

                }


            }

            var calendarTblTdTxt = document.createTextNode(boxText);
            calendarTblTd.appendChild(calendarTblTdTxt);
            calendarWeekRow.appendChild(calendarTblTd);
        }

        datepickerTbl.appendChild(calendarWeekRow);

      i++;
    }
    while (i <= numWeeksThisMonth);  

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

function changeYear(newYear) {
    refreshDatepickerHead();
    var childNodes = datepickerCalendar.childNodes;
    childNodes[i].remove();

    //build and populate calendar table   
    var datepickerTbl = buildAndPopulateDatepickerTbl();
    datepickerCalendar.appendChild(datepickerTbl);
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

function childOf( node, ancestor ) {
    var child = node;
    while (child !== null) {
        if (child === ancestor) return true;
        child = child.parentNode;
    }
    return false;   
}

var pageBody = document.getElementsByTagName("body")[0];
pageBody.addEventListener("click", (ev) => {


    var datepickerCalendars = _(".datepicker-calendar");

    if (datepickerCalendars.length>0) {

        var clickedEl = ev.target;

        //does the clickedEl contain the datepicker class?
        if (clickedEl.classList.contains("datepicker")) {
            return;
        }

        var targetAncestor = datepickerCalendars[0];
        var isChild = childOf(clickedEl, targetAncestor);

        if (isChild !== true) {
            destroyCalendars();
        }
    }

});

function destroyCalendars() {

    var datepickerCalendars = _(".datepicker-calendar");

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

function createNiceDate(targetDateObj) {
    // Ref:  https://www.w3schools.com/jsref/jsref_tolocalestring.asp
    // var niceDate = window.navigator.language;

    if (typeof(dateFormatObj) !== 'undefined') {
        var niceDate = targetDateObj.toLocaleString(localeString, dateFormatObj);
    } else {
       
        var m = targetDateObj.getMonth()+1;
        var d =  targetDateObj.getDate();

        if (m < 10) {
            m = '0' + m
        }

        if (d < 10) {
            d = '0' + d
        }

        var niceDate = m + '/' + d + '/' + targetDateObj.getFullYear();

    }
    
    return niceDate;
}

function clickDay(dayNum) {
    var clickedDay = currentDate;
    clickedDay.setDate(dayNum);
    var niceDate = createNiceDate(clickedDay);
    
    //update the textfield so that it has the nice date
    clickedEl.value = niceDate;
    destroyDatepickerCalendars(); 
}


//make the input fields (for datepickers) 'disabled'
var datepickerInputs = document.getElementsByClassName("datepicker");
var originalValue;
for (var i = 0; i < datepickerInputs.length; i++) {

    var targetEl = datepickerInputs[i];
    var pressedKey;

    // javascript get character that was pressed
 
    var originalValue = '';
    datepickerInputs[i].addEventListener("mousedown", (ev) => {
        originalValue = targetEl.value;
    });

    datepickerInputs[i].addEventListener("blur", (ev) => {

        var isNumber = /^[0-9]$/i.test(pressedKey);

        if (isNumber !== true) {
            targetEl.value = originalValue;
        } else {
            //attempt to extract the year from the form input field
            var extractedYear = attemptExtractYear(targetEl.value);

            if (extractedYear !== false) {
                //we have a valid year in the form input field
                currentDate.setYear(extractedYear);
                changeYear(extractedYear);
            }

        }

    });

    datepickerInputs[i].addEventListener("keyup", (ev) => {
        pressedKey = ev.key;

        var isNumber = /^[0-9]$/i.test(pressedKey);

        if (isNumber !== true) {
            targetEl.value = originalValue;
        } else {

            //attempt to extract the year from the form input field
            var extractedYear = attemptExtractYear(targetEl.value);

            if (extractedYear !== false) {
                //we have a valid year in the form input field
                currentDate.setYear(extractedYear);
                changeYear(extractedYear);
            }


        }
        
    });

}




function attemptExtractYear(text) {
    var score = 0;
    var extractedYear = '';

    for (var x = 0; x < text.length; x++) {
        var c = text.charAt(x);
        var isNumber = /^[0-9]$/i.test(c);

        if (isNumber == true) {
            score++;
            extractedYear+= c;
        } else {
            score = 0;
            extractedYear = '';
        }

        if (score == 4) {
            return extractedYear;
        }

    }

    return false;
}

function testForIsAvailable(dayCounter) {

    //unavailableBefore  unavailableAfter

    //turn the day (to be tested) into a date object
    var boxDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), dayCounter);

    if ((boxDate<=unavailableBefore) || (boxDate>=unavailableAfter)) {
        return false;
    } else {
        return true;
    }

}

function testForCurrentDay(dayCounter) {

    var todayStr = todayDate.getDate() + ' ' + todayDate.getMonth() + ' ' + todayDate.getFullYear();
    var currentDateStr = dayCounter + ' ' + currentDate.getMonth() + ' ' + currentDate.getFullYear();

    if (todayStr == currentDateStr) {
        return true;
    } else {
        return false;
    }

}

buildTopRow();