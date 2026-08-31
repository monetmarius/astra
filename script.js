/* =========================================================
   ASTRA OS
   V1.1
========================================================= */


/* =========================================================
   DONNÉES
========================================================= */

const defaultData = {

    tasks: [],

    events: [],

    sessions: [],

    subjects: {

        Maths: 0,

        Physique: 0,

        Allemand: 0,

        Français: 0,

        Histoire: 0,

        Autre: 0

    }

};


let data =
    JSON.parse(
        localStorage.getItem("astraData")
    ) || structuredClone(defaultData);


/* =========================================================
   SAUVEGARDE
========================================================= */

function saveData() {

    localStorage.setItem(
        "astraData",
        JSON.stringify(data)
    );

}


/* =========================================================
   NAVIGATION
========================================================= */

const navButtons =
    document.querySelectorAll(".nav-button");


navButtons.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            openPage(
                button.dataset.page
            );

        }
    );

});


function openPage(pageName) {

    document
        .querySelectorAll(".page")
        .forEach(page => {

            page.classList.remove("active");

        });


    const target =
        document.getElementById(pageName);


    if (target) {

        target.classList.add("active");

    }


    navButtons.forEach(button => {

        button.classList.toggle(
            "active",
            button.dataset.page === pageName
        );

    });


    if (pageName === "stats") {

        updateStats();

    }


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


/* =========================================================
   DATE
========================================================= */

function updateDate() {

    const date =
        new Date();


    const formatted =
        date.toLocaleDateString(
            "fr-FR",
            {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric"
            }
        );


    document
        .getElementById("currentDate")
        .textContent =
        formatted.toUpperCase();

}


/* =========================================================
   TÂCHES
========================================================= */

function addTask() {

    const input =
        document.getElementById(
            "taskInput"
        );


    const subject =
        document.getElementById(
            "taskSubject"
        );


    const name =
        input.value.trim();


    if (!name) return;


    data.tasks.push({

        id: Date.now(),

        name: name,

        subject: subject.value,

        completed: false,

        date: getToday()

    });


    saveData();


    input.value = "";


    renderTasks();

}


function handleTaskEnter(event) {

    if (event.key === "Enter") {

        addTask();

    }

}


function toggleTask(id) {

    const task =
        data.tasks.find(
            task => task.id === id
        );


    if (!task) return;


    task.completed =
        !task.completed;


    saveData();


    renderTasks();

}


function deleteTask(id) {

    data.tasks =
        data.tasks.filter(
            task => task.id !== id
        );


    saveData();


    renderTasks();

}


function createTaskHTML(task) {

    return `

        <div class="task ${task.completed ? "completed" : ""}">

            <input
                class="task-checkbox"
                type="checkbox"
                ${task.completed ? "checked" : ""}
                onchange="toggleTask(${task.id})"
            >

            <div class="task-content">

                <div class="task-name">
                    ${escapeHTML(task.name)}
                </div>

                <div class="task-subject">
                    ${escapeHTML(task.subject)}
                </div>

            </div>


            <button
                class="delete-task"
                onclick="deleteTask(${task.id})"
                title="Supprimer"
            >

                <i data-lucide="trash-2"></i>

            </button>

        </div>

    `;

}


function renderTasks() {

    const allTasks =
        document.getElementById(
            "allTasks"
        );


    const dashboardTasks =
        document.getElementById(
            "dashboardTasks"
        );


    const todayTasks =
        data.tasks.filter(
            task =>
                task.date === getToday()
        );


    if (data.tasks.length === 0) {

        allTasks.innerHTML =
            `<p class="empty">
                Aucune tâche.
            </p>`;

    } else {

        allTasks.innerHTML =
            data.tasks
                .map(createTaskHTML)
                .join("");

    }


    if (todayTasks.length === 0) {

        dashboardTasks.innerHTML =
            `<p class="empty">
                Aucune tâche pour aujourd'hui.
            </p>`;

    } else {

        dashboardTasks.innerHTML =
            todayTasks
                .map(createTaskHTML)
                .join("");

    }


    updateQuickStats();


    refreshIcons();

}


/* =========================================================
   PLANNING
========================================================= */

function addEvent() {

    const name =
        document
            .getElementById("eventName")
            .value
            .trim();


    const date =
        document
            .getElementById("eventDate")
            .value;


    const type =
        document
            .getElementById("eventType")
            .value;


    if (!name || !date) return;


    data.events.push({

        id: Date.now(),

        name: name,

        date: date,

        type: type

    });


    data.events.sort(
        (a, b) =>
            a.date.localeCompare(b.date)
    );


    saveData();


    document
        .getElementById("eventName")
        .value = "";


    document
        .getElementById("eventDate")
        .value = "";


    renderEvents();

}


function deleteEvent(id) {

    data.events =
        data.events.filter(
            event => event.id !== id
        );


    saveData();


    renderEvents();

}


function createEventHTML(event) {

    return `

        <div class="event">

            <div class="event-date">
                ${formatDate(event.date)}
            </div>

            <div class="event-name">
                ${escapeHTML(event.name)}
            </div>

            <div class="event-type">
                ${escapeHTML(event.type)}
            </div>

            <button
                class="delete-event"
                onclick="deleteEvent(${event.id})"
                title="Supprimer"
            >

                <i data-lucide="trash-2"></i>

            </button>

        </div>

    `;

}


function renderEvents() {

    const container =
        document.getElementById(
            "eventsList"
        );


    const dashboard =
        document.getElementById(
            "dashboardEvents"
        );


    const today =
        getToday();


    const upcoming =
        data.events
            .filter(event =>
                event.date >= today
            )
            .sort(
                (a, b) =>
                    a.date.localeCompare(b.date)
            );


    if (data.events.length === 0) {

        container.innerHTML =
            `<p class="empty">
                Aucun événement enregistré.
            </p>`;

    } else {

        container.innerHTML =
            data.events
                .map(createEventHTML)
                .join("");

    }


    if (upcoming.length === 0) {

        dashboard.innerHTML =
            `<p class="empty">
                Aucun événement à venir.
            </p>`;

    } else {

        dashboard.innerHTML =
            upcoming
                .slice(0, 4)
                .map(createEventHTML)
                .join("");

    }


    refreshIcons();

}


/* =========================================================
   TIMER
========================================================= */

let timerInterval = null;

let remainingSeconds =
    25 * 60;

let timerRunning = false;

let timerStartedSeconds =
    25 * 60;


function updateTimerDisplay() {

    const minutes =
        Math.floor(
            remainingSeconds / 60
        );


    const seconds =
        remainingSeconds % 60;


    const formatted =
        `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;


    document
        .getElementById("timerDisplay")
        .textContent =
        formatted;

}


function startTimer() {

    if (timerRunning) return;


    const input =
        document.getElementById(
            "timerMinutes"
        );


    if (
        remainingSeconds ===
        timerStartedSeconds
    ) {

        const minutes =
            parseInt(input.value);


        if (
            !isNaN(minutes) &&
            minutes > 0
        ) {

            remainingSeconds =
                minutes * 60;

            timerStartedSeconds =
                remainingSeconds;

        }

    }


    timerRunning = true;


    document
        .getElementById("startTimer")
        .innerHTML = `

            <i data-lucide="play"></i>

            En cours…

        `;


    refreshIcons();


    timerInterval =
        setInterval(() => {

            remainingSeconds--;

            updateTimerDisplay();


            if (
                remainingSeconds <= 0
            ) {

                finishTimer();

            }

        }, 1000);

}


function pauseTimer() {

    clearInterval(
        timerInterval
    );


    timerRunning = false;


    document
        .getElementById("startTimer")
        .innerHTML = `

            <i data-lucide="play"></i>

            Continuer

        `;


    refreshIcons();

}


function resetTimer() {

    clearInterval(
        timerInterval
    );


    timerRunning = false;


    const minutes =
        parseInt(
            document
                .getElementById(
                    "timerMinutes"
                )
                .value
        ) || 25;


    remainingSeconds =
        minutes * 60;


    timerStartedSeconds =
        remainingSeconds;


    document
        .getElementById("startTimer")
        .innerHTML = `

            <i data-lucide="play"></i>

            Commencer

        `;


    updateTimerDisplay();


    refreshIcons();

}


function finishTimer() {

    clearInterval(
        timerInterval
    );


    timerRunning = false;


    const subject =
        document
            .getElementById(
                "timerSubject"
            )
            .value;


    const minutes =
        Math.round(
            timerStartedSeconds / 60
        );


    if (minutes > 0) {

        data.sessions.push({

            id: Date.now(),

            date: getToday(),

            duration: minutes,

            subject: subject

        });


        if (
            !data.subjects[subject]
        ) {

            data.subjects[subject] =
                0;

        }


        data.subjects[subject] +=
            minutes;

    }


    saveData();


    alert(
        `Session terminée !\n\n${minutes} minutes de ${subject}.`
    );


    resetTimer();


    renderAll();

}


/* =========================================================
   MATIÈRES
========================================================= */

const subjectDescriptions = {

    Maths:
        "Algèbre, analyse, probabilités et géométrie.",

    Physique:
        "Comprendre les phénomènes et savoir les modéliser.",

    Allemand:
        "Vocabulaire, expression et compréhension.",

    Français:
        "Littérature, analyse et expression.",

    Histoire:
        "Comprendre les événements et savoir les expliquer.",

    Autre:
        "Autres matières et projets."

};


function renderSubjects() {

    const container =
        document.getElementById(
            "subjectsGrid"
        );


    container.innerHTML =
        Object.entries(
            data.subjects
        )
        .map(
            ([name, minutes]) => {

                const percent =
                    Math.min(
                        100,
                        Math.round(
                            minutes / 3
                        )
                    );


                return `

                    <div class="subject-card">

                        <div class="subject-top">

                            <div class="subject-name">
                                ${name}
                            </div>

                            <div class="subject-percent">
                                ${percent}%
                            </div>

                        </div>


                        <div class="progress">

                            <div
                                class="progress-bar"
                                style="width:${percent}%"
                            ></div>

                        </div>


                        <div class="subject-description">

                            ${subjectDescriptions[name]}

                        </div>

                    </div>

                `;

            }
        )
        .join("");

}


/* =========================================================
   STATISTIQUES
========================================================= */

function updateStats() {

    const totalMinutes =
        data.sessions.reduce(
            (total, session) =>
                total + session.duration,
            0
        );


    document
        .getElementById("totalTime")
        .textContent =
        formatHours(totalMinutes);


    document
        .getElementById("totalSessions")
        .textContent =
        data.sessions.length;


    document
        .getElementById("totalDays")
        .textContent =
        getWorkedDays();


    const container =
        document.getElementById(
            "subjectStats"
        );


    container.innerHTML =
        Object.entries(
            data.subjects
        )
        .map(
            ([subject, minutes]) => {

                const percentage =
                    totalMinutes > 0
                        ? Math.round(
                            minutes /
                            totalMinutes *
                            100
                        )
                        : 0;


                return `

                    <div class="subject-stat">

                        <div class="subject-stat-header">

                            <span>
                                ${subject}
                            </span>

                            <span>
                                ${formatMinutes(minutes)}
                                · ${percentage}%
                            </span>

                        </div>


                        <div class="progress">

                            <div
                                class="progress-bar"
                                style="width:${percentage}%"
                            ></div>

                        </div>

                    </div>

                `;

            }
        )
        .join("");

}


/* =========================================================
   SÉRIE
========================================================= */

function calculateStreak() {

    const workedDates =
        new Set(
            data.sessions.map(
                session => session.date
            )
        );


    let streak = 0;

    const current =
        new Date();


    while (
        workedDates.has(
            getDateString(current)
        )
    ) {

        streak++;


        current.setDate(
            current.getDate() - 1
        );

    }


    return streak;

}


/* =========================================================
   JOURS TRAVAILLÉS
========================================================= */

function getWorkedDays() {

    return new Set(
        data.sessions.map(
            session => session.date
        )
    ).size;

}


/* =========================================================
   QUICK STATS
========================================================= */

function updateQuickStats() {

    const todaySessions =
        data.sessions.filter(
            session =>
                session.date ===
                getToday()
        );


    const todayMinutes =
        todaySessions.reduce(
            (total, session) =>
                total + session.duration,
            0
        );


    const completed =
        data.tasks.filter(
            task => task.completed
        ).length;


    const streak =
        calculateStreak();


    document
        .getElementById("todayTime")
        .textContent =
        formatMinutes(todayMinutes);


    document
        .getElementById("completedTasks")
        .textContent =
        completed;


    document
        .getElementById("streakValue")
        .textContent =
        `${streak} ${streak > 1 ? "jours" : "jour"}`;


    document
        .getElementById("dashboardStreak")
        .textContent =
        `${streak} ${streak > 1 ? "jours" : "jour"}`;

}


/* =========================================================
   UTILITAIRES
========================================================= */

function getToday() {

    return getDateString(
        new Date()
    );

}


function getDateString(date) {

    const year =
        date.getFullYear();


    const month =
        String(
            date.getMonth() + 1
        ).padStart(2, "0");


    const day =
        String(
            date.getDate()
        ).padStart(2, "0");


    return `${year}-${month}-${day}`;

}


function formatMinutes(minutes) {

    if (minutes < 60) {

        return `${minutes} min`;

    }


    const hours =
        Math.floor(
            minutes / 60
        );


    const remaining =
        minutes % 60;


    return `${hours}h ${String(remaining).padStart(2, "0")}`;

}


function formatHours(minutes) {

    const hours =
        Math.floor(
            minutes / 60
        );


    const remaining =
        minutes % 60;


    return `${hours}h ${String(remaining).padStart(2, "0")}`;

}


function formatDate(dateString) {

    const date =
        new Date(
            dateString +
            "T12:00:00"
        );


    return date.toLocaleDateString(
        "fr-FR",
        {
            day: "2-digit",
            month: "2-digit"
        }
    );

}


function escapeHTML(text) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent = text;


    return div.innerHTML;

}


/* =========================================================
   ICÔNES
========================================================= */

function refreshIcons() {

    if (
        typeof lucide !==
        "undefined"
    ) {

        lucide.createIcons();

    }

}


/* =========================================================
   EXPORT
========================================================= */

function exportData() {

    const file =
        new Blob(
            [
                JSON.stringify(
                    data,
                    null,
                    2
                )
            ],
            {
                type:
                    "application/json"
            }
        );


    const url =
        URL.createObjectURL(
            file
        );


    const link =
        document.createElement(
            "a"
        );


    link.href = url;


    link.download =
        `astra-backup-${getToday()}.json`;


    link.click();


    URL.revokeObjectURL(url);

}


/* =========================================================
   SUPPRESSION
========================================================= */

function clearData() {

    const confirmation =
        confirm(
            "Toutes tes données Astra seront supprimées. Continuer ?"
        );


    if (!confirmation) return;


    localStorage.removeItem(
        "astraData"
    );


    data =
        structuredClone(
            defaultData
        );


    renderAll();

}


/* =========================================================
   INITIALISATION
========================================================= */

function renderAll() {

    updateDate();

    renderTasks();

    renderEvents();

    renderSubjects();

    updateStats();

    updateQuickStats();

    updateTimerDisplay();

    refreshIcons();

}


renderAll();
