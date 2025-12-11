

const calendarBody = document.getElementById("calendarBody");
const monthYear = document.getElementById("monthYear");
const prevMonthBtn = document.getElementById("prevMonth");
const nextMonthBtn = document.getElementById("nextMonth");
const userButton = document.getElementById("userButton");
const currentUserSpan = document.getElementById("currentUser");

let currentDate = new Date();
let currentUser = null;
let events = {};

function renderCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    monthYear.textContent = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

    calendarBody.innerHTML = '';

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    let row = document.createElement('tr');

    for (let i = 0; i < firstDay; i++) {
        const emptyCell = document.createElement('td');
        emptyCell.classList.add('empty');
        row.appendChild(emptyCell);
    }

    for (let day = 1; day <= daysInMonth; day++) {
        if (row.children.length === 7) {
            calendarBody.appendChild(row);
            row = document.createElement('tr');
        }

        const cell = document.createElement('td');
        cell.textContent = day;
        const dateKey = `${year}-${month + 1}-${day}`;
        cell.dataset.date = dateKey;

       
        if (events[dateKey]) {
            events[dateKey].forEach((event, index) => {
                const eventDiv = document.createElement('span');
                eventDiv.classList.add('event');
                eventDiv.textContent = `${event.time} - ${event.name} (${event.user})`;

                eventDiv.setAttribute("title", `${event.time} - ${event.name} (${event.user})`);

                const deleteBtn = document.createElement('button');
                deleteBtn.textContent = 'x';
                deleteBtn.style.marginLeft = '5px';
                deleteBtn.style.fontSize = '10px';
                deleteBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    events[dateKey].splice(index, 1);
                    if (events[dateKey].length === 0) delete events[dateKey];
                    renderCalendar();
                });

                eventDiv.appendChild(deleteBtn);
                cell.appendChild(eventDiv);
            });
        }


        cell.addEventListener('click', () => {
            if (!currentUser) {
                alert('No users logged in. Please add a user.');
                addUser();
                return;
            }

            if (!cell.querySelector('.addEventButton')) {
                const addBtn = document.createElement('button');
                addBtn.textContent = 'Add Event';
                addBtn.classList.add('addEventButton');
                addBtn.addEventListener('click', e => {
                    e.stopPropagation();
                    showEventForm(cell);
                    addBtn.remove();
                });
                cell.appendChild(addBtn);
            }
        });

        row.appendChild(cell);
    }

    calendarBody.appendChild(row);
}

function addUser() {
    const name = prompt('Enter user name:');
    const idInput = prompt('Enter user ID:');

    if (/^\d+$/.test(idInput)) {
        const id = Number(idInput);
        currentUser = { name, id };
        currentUserSpan.textContent = `Current User: ${name}`;
        userButton.textContent = `Change User`;
    } else {
        alert('Incorrect ID format. Please enter an integer.');
        addUser();
    }
}


userButton.addEventListener('click', () => {
    if (!currentUser) {
        addUser();
    } else {
        alert(`Current user: ${currentUser.name} (ID: ${currentUser.id}). Change user?`);
        addUser();
    }
});

function showEventForm(cell) {
    const eventName = prompt('Enter event name:');
    const eventTime = prompt('Enter event time:');
    if (!eventName || !eventTime) return;

    const dateKey = cell.dataset.date;
    if (!events[dateKey]) events[dateKey] = [];

    events[dateKey].push({ name: eventName, time: eventTime, user: currentUser.name });
    renderCalendar();
}

prevMonthBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
});

nextMonthBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
});

renderCalendar();
