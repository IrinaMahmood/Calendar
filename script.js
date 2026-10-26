const monthYear = document.getElementById("monthYear");
const calendarDays = document.getElementById("calendarDays");

const todayBtn = document.getElementById("todayBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

const monthViewBtn = document.getElementById("monthViewBtn");
const weekViewBtn = document.getElementById("weekViewBtn");

const eventDialog = document.getElementById("eventDialog");
const eventForm = document.getElementById("eventForm");
const eventName = document.getElementById("eventName");
const selectedDateText = document.getElementById("selectedDate");
const cancelBtn = document.getElementById("cancelBtn");

// Remove the time portion so date comparisons are reliable.
function dateOnly(date) {
    return new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
    );
}

const today = dateOnly(new Date());

let currentDate = new Date(today);
let currentView = "month";
let selectedDate = null;

// Store events using YYYY-MM-DD date keys.
const events = {};

function dateKey(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function formatDate(date) {
    return date.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric"
    });
}

function renderCalendar() {
    calendarDays.innerHTML = "";

    if (currentView === "month") {
        renderMonth();
    } else {
        renderWeek();
    }

    monthViewBtn.classList.toggle(
        "active",
        currentView === "month"
    );

    weekViewBtn.classList.toggle(
        "active",
        currentView === "week"
    );
}

function renderMonth() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    monthYear.textContent = currentDate.toLocaleDateString(
        "en-US",
        { month: "long", year: "numeric" }
    );

    // First day of the month.
    const firstDay = new Date(year, month, 1);

    // Start the calendar on Sunday.
    const startDate = new Date(
        year,
        month,
        1 - firstDay.getDay()
    );

    // Six rows ensure a consistent 42-cell monthly grid.
    for (let i = 0; i < 42; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);

        createDayCell(date, date.getMonth() !== month);
    }
}

function renderWeek() {
    // Find Sunday of the selected date's week.
    const startDate = new Date(currentDate);
    startDate.setDate(
        currentDate.getDate() - currentDate.getDay()
    );

    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);

    const sameMonth =
        startDate.getMonth() === endDate.getMonth() &&
        startDate.getFullYear() === endDate.getFullYear();

    if (sameMonth) {
        monthYear.textContent = startDate.toLocaleDateString(
            "en-US",
            { month: "long", year: "numeric" }
        );
    } else {
        monthYear.textContent =
            startDate.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric"
            }) +
            " - " +
            endDate.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric"
            });
    }

    for (let i = 0; i < 7; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);

        createDayCell(date, false);
    }
}

function createDayCell(date, isOtherMonth) {
    const cell = document.createElement("div");
    cell.classList.add("day");

    if (isOtherMonth) {
        cell.classList.add("other-month");
    }

    if (dateKey(date) === dateKey(today)) {
        cell.classList.add("today");
    }

    const number = document.createElement("div");
    number.classList.add("day-number");
    number.textContent = date.getDate();

    cell.appendChild(number);

    // Display every event saved for this date.
    const dayEvents = events[dateKey(date)] || [];

    dayEvents.forEach(function (name) {
        const eventElement = document.createElement("div");
        eventElement.classList.add("event");
        eventElement.textContent = name;

        cell.appendChild(eventElement);
    });

    // Clicking a date opens the Add Event dialog.
    cell.addEventListener("click", function () {
        openEventDialog(date);
    });

    calendarDays.appendChild(cell);
}

function openEventDialog(date) {
    selectedDate = dateOnly(date);

    selectedDateText.textContent = formatDate(selectedDate);
    eventName.value = "";

    eventDialog.showModal();
    eventName.focus();
}

eventForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const name = eventName.value.trim();

    if (name === "" || !selectedDate) {
        return;
    }

    const key = dateKey(selectedDate);

    if (!events[key]) {
        events[key] = [];
    }

    events[key].push(name);

    eventDialog.close();
    renderCalendar();
});

cancelBtn.addEventListener("click", function () {
    eventDialog.close();
});

todayBtn.addEventListener("click", function () {
    currentDate = new Date(today);
    renderCalendar();
});

prevBtn.addEventListener("click", function () {
    if (currentView === "month") {
        currentDate.setDate(1);
        currentDate.setMonth(currentDate.getMonth() - 1);
    } else {
        currentDate.setDate(currentDate.getDate() - 7);
    }

    renderCalendar();
});

nextBtn.addEventListener("click", function () {
    if (currentView === "month") {
        currentDate.setDate(1);
        currentDate.setMonth(currentDate.getMonth() + 1);
    } else {
        currentDate.setDate(currentDate.getDate() + 7);
    }

    renderCalendar();
});

monthViewBtn.addEventListener("click", function () {
    currentView = "month";
    renderCalendar();
});

weekViewBtn.addEventListener("click", function () {
    currentView = "week";
    renderCalendar();
});

// Display the calendar when the page loads.
renderCalendar();