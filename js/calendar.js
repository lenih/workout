// Calendar functions

let currentDate = new Date();
const workoutDays = []; // Will fetch from Supabase

function renderCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const monthYearEl = document.getElementById('month-year');
    const calendarEl = document.getElementById('calendar');
    
    const monthName = new Date(year, month).toLocaleDateString('default', { month: 'long', year: 'numeric' });
    monthYearEl.textContent = monthName;
    
    calendarEl.innerHTML = '';
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    // Add empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
        calendarEl.appendChild(document.createElement('div'));
    }
    
    // Add day cells
    for (let day = 1; day <= daysInMonth; day++) {
        const dayEl = document.createElement('div');
        dayEl.className = 'calendar-day';
        dayEl.textContent = day;
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        
        if (workoutDays.includes(dateStr)) {
            dayEl.classList.add('workout');
        }
        
        dayEl.addEventListener('click', () => selectDay(dateStr));
        calendarEl.appendChild(dayEl);
    }
}

function selectDay(dateStr) {
    if (workoutDays.includes(dateStr)) {
        workoutDays.splice(workoutDays.indexOf(dateStr), 1);
    } else {
        workoutDays.push(dateStr);
    }
    renderCalendar();
}

document.addEventListener('DOMContentLoaded', () => {
    renderCalendar();
    
    document.getElementById('prev-month')?.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    });
    
    document.getElementById('next-month')?.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    });
});

export { renderCalendar, workoutDays };
