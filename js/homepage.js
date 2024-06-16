document.addEventListener('DOMContentLoaded', function() {
    loadNews();
    loadMembers();
    loadEvents();
    initCarousel();
    initCalendar();
    displayCurrentDate();
});

function loadNews() {
    const newsArticles = [
        { title: "News 1", content: "Content for news 1" },
        { title: "News 2", content: "Content for news 2" }
    ];
    const newsContainer = document.getElementById('news-articles');
    newsArticles.forEach(article => {
        const articleElement = document.createElement('div');
        articleElement.innerHTML = `<h3>${article.title}</h3><p>${article.content}</p>`;
        newsContainer.appendChild(articleElement);
    });
}

function loadMembers() {
    const members = [
        { name: "Member 1", role: "Role 1" },
        { name: "Member 2", role: "Role 2" }
    ];
    const membersContainer = document.getElementById('members-list');
    members.forEach(member => {
        const memberElement = document.createElement('div');
        memberElement.innerHTML = `<h3>${member.name}</h3><p>${member.role}</p>`;
        membersContainer.appendChild(memberElement);
    });
}

function loadEvents() {
    const events = [
        { title: "Event 1", date: "Date 1" },
        { title: "Event 2", date: "Date 2" }
    ];
    const eventsContainer = document.getElementById('events-list');
    events.forEach(event => {
        const eventElement = document.createElement('div');
        eventElement.innerHTML = `<h3>${event.title}</h3><p>${event.date}</p>`;
        eventsContainer.appendChild(eventElement);
    });
}

function initCarousel() {
    const carousel = document.getElementById('carousel');
    const carouselInner = carousel.querySelector('.carousel-inner');
    const carouselIndicators = carousel.querySelectorAll('.carousel-disc');
    const prevButton = carousel.querySelector('.prev');
    const nextButton = carousel.querySelector('.next');
    let index = 0;
    const intervalTime = 4000;
    let interval;

    function goToSlide(slideIndex) {
        index = slideIndex;
        carouselInner.style.transform = `translateX(-${index * 100}%)`;
        updateIndicators();
    }

    function nextSlide() {
        index = (index + 1) % carouselInner.children.length;
        goToSlide(index);
        resetInterval();
    }

    function prevSlide() {
        index = (index - 1 + carouselInner.children.length) % carouselInner.children.length;
        goToSlide(index);
        resetInterval();
    }

    function updateIndicators() {
        carouselIndicators.forEach((indicator, i) => {
            indicator.classList.toggle('active', i === index);
        });
    }

    function resetInterval() {
        clearInterval(interval);
        interval = setInterval(nextSlide, intervalTime);
    }

    carouselIndicators.forEach((indicator, i) => {
        indicator.addEventListener('click', () => {
            goToSlide(i);
            resetInterval();
        });
    });

    prevButton.addEventListener('click', () => {
        prevSlide();
    });

    nextButton.addEventListener('click', () => {
        nextSlide();
    });

    carouselInner.addEventListener('mousedown', resetInterval);
    carouselInner.addEventListener('touchstart', resetInterval);

    interval = setInterval(nextSlide, intervalTime);
}

function initCalendar() {
    const calendarContainer = document.getElementById('calendar-container');
    const currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();

    function renderCalendar(month, year) {
        const calendar = document.createElement('div');
        calendar.className = 'calendar';
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDay = new Date(year, month, 1).getDay();
        const today = new Date();

        const monthYearHeader = document.createElement('h3');
        monthYearHeader.textContent = `${getMonthName(month)} ${year}`;
        calendar.appendChild(monthYearHeader);

        for (let i = 0; i < firstDay; i++) {
            const emptyCell = document.createElement('div');
            emptyCell.className = 'other-month';
            calendar.appendChild(emptyCell);
        }

        for (let i = 1; i <= daysInMonth; i++) {
            const dayCell = document.createElement('div');
            dayCell.textContent = i;
            dayCell.className = 'current-month';
            if (month !== today.getMonth() || year !== today.getFullYear()) {
                dayCell.classList.add('other-month');
            } else if (i === today.getDate()) {
                dayCell.classList.add('today');
            }
            calendar.appendChild(dayCell);
        }

        calendarContainer.innerHTML = '';
        calendarContainer.appendChild(calendar);
    }

    renderCalendar(currentMonth, currentYear);
}

function displayCurrentDate() {
    const currentDate = new Date();
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const dateString = `${dayNames[currentDate.getDay()]}, ${currentDate.getDate()} ${getMonthName(currentDate.getMonth())} ${currentDate.getFullYear()}`;
    const currentDateElement = document.getElementById('current-date');
    currentDateElement.textContent = dateString;
}

function getMonthName(monthIndex) {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return monthNames[monthIndex];
}
