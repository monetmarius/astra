/* =========================================================
   ASTRA OS
   V2.0
========================================================= */


/* =========================================================
   ASTRA OS V6 — SYNCHRONISATION CLOUD
   Supabase + fallback localStorage
========================================================= */

const CLOUD_CONFIG_KEY = "astraSupabaseConfig";
const CLOUD_LAST_SYNC_KEY = "astraLastCloudSync";
let supabaseClient = null;
let cloudUser = null;
let cloudSyncTimer = null;
let cloudSyncBusy = false;

function getCloudConfig() {
    try { return JSON.parse(localStorage.getItem(CLOUD_CONFIG_KEY) || "null"); }
    catch { return null; }
}

function hasCloudConfig() {
    const cfg = getCloudConfig();
    return !!(cfg?.url && cfg?.anonKey && !cfg.url.includes("TON_PROJET"));
}

function initCloudClient() {
    if (!window.supabase || !hasCloudConfig()) return null;
    const cfg = getCloudConfig();
    if (!supabaseClient || supabaseClient.__astraUrl !== cfg.url) {
        supabaseClient = window.supabase.createClient(cfg.url, cfg.anonKey);
        supabaseClient.__astraUrl = cfg.url;
    }
    return supabaseClient;
}

function setCloudStatus(text, type="") {
    const badge = document.getElementById("cloudStatusBadge");
    if (badge) { badge.textContent = text; badge.className = `cloud-status-badge ${type}`; }
    const msg = document.getElementById("cloudSyncMessage");
    if (msg && type !== "connected") msg.textContent = text;
}

function setCloudAuthMessage(text) {
    const el = document.getElementById("cloudAuthMessage");
    if (el) el.textContent = text;
}

function formatCloudDate(iso) {
    if (!iso) return "Pas encore synchronisé";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "Pas encore synchronisé";
    return `Dernière synchronisation : ${d.toLocaleString("fr-FR", { dateStyle:"short", timeStyle:"short" })}`;
}

function meaningfulLocalData() {
    return !!(
        data.tasks?.length || data.events?.length || data.sessions?.length || data.journal?.length ||
        data.grades?.length || Object.values(data.chapters || {}).some(v => Array.isArray(v) && v.length)
    );
}

async function refreshCloudAuthUI() {
    const client = initCloudClient();
    const loggedOut = document.getElementById("cloudLoggedOut");
    const loggedIn = document.getElementById("cloudLoggedIn");
    const config = getCloudConfig();
    const urlInput = document.getElementById("supabaseUrl");
    const keyInput = document.getElementById("supabaseAnonKey");
    if (urlInput && config?.url) urlInput.value = config.url;
    if (keyInput && config?.anonKey) keyInput.value = config.anonKey;

    if (!client) {
        if (loggedOut) loggedOut.hidden = false;
        if (loggedIn) loggedIn.hidden = true;
        setCloudStatus(hasCloudConfig() ? "Configuration indisponible" : "Local uniquement");
        return;
    }

    const { data: authData } = await client.auth.getSession();
    cloudUser = authData?.session?.user || null;
    if (cloudUser) {
        if (loggedOut) loggedOut.hidden = true;
        if (loggedIn) loggedIn.hidden = false;
        const email = document.getElementById("cloudUserEmail");
        if (email) email.textContent = cloudUser.email || "Compte Astra";
        const last = localStorage.getItem(CLOUD_LAST_SYNC_KEY);
        const lastEl = document.getElementById("cloudLastSync");
        if (lastEl) lastEl.textContent = formatCloudDate(last);
        setCloudStatus("Connecté", "connected");
    } else {
        if (loggedOut) loggedOut.hidden = false;
        if (loggedIn) loggedIn.hidden = true;
        setCloudStatus("Prêt à se connecter");
    }
    refreshIcons();
}

function saveCloudConfig() {
    const url = document.getElementById("supabaseUrl")?.value.trim().replace(/\/$/, "");
    const anonKey = document.getElementById("supabaseAnonKey")?.value.trim();
    if (!url || !anonKey) { alert("Renseigne l'URL Supabase et la clé publique."); return; }
    try { new URL(url); } catch { alert("L'URL Supabase n'est pas valide."); return; }
    localStorage.setItem(CLOUD_CONFIG_KEY, JSON.stringify({ url, anonKey }));
    supabaseClient = null;
    setCloudAuthMessage("Configuration enregistrée.");
    refreshCloudAuthUI();
}

async function cloudSignUp() {
    const client = initCloudClient();
    if (!client) { alert("Configure Supabase avant de créer un compte."); return; }
    const email = document.getElementById("cloudEmail")?.value.trim();
    const password = document.getElementById("cloudPassword")?.value || "";
    if (!email || password.length < 6) { setCloudAuthMessage("Utilise un e-mail valide et un mot de passe d'au moins 6 caractères."); return; }
    setCloudAuthMessage("Création du compte…");
    const { data: result, error } = await client.auth.signUp({ email, password });
    if (error) { setCloudAuthMessage(error.message); return; }
    if (!result.session) setCloudAuthMessage("Compte créé. Vérifie ton e-mail si la confirmation est activée dans Supabase.");
    else { cloudUser = result.user; setCloudAuthMessage("Compte créé."); await cloudInitialSync(); }
    await refreshCloudAuthUI();
}

async function cloudLogin() {
    const client = initCloudClient();
    if (!client) { alert("Configure Supabase avant de te connecter."); return; }
    const email = document.getElementById("cloudEmail")?.value.trim();
    const password = document.getElementById("cloudPassword")?.value || "";
    if (!email || !password) { setCloudAuthMessage("Renseigne ton e-mail et ton mot de passe."); return; }
    setCloudAuthMessage("Connexion…");
    const { data: result, error } = await client.auth.signInWithPassword({ email, password });
    if (error) { setCloudAuthMessage(error.message); return; }
    cloudUser = result.user;
    await refreshCloudAuthUI();
    await cloudInitialSync();
}

async function cloudLogout() {
    const client = initCloudClient();
    if (client) await client.auth.signOut();
    cloudUser = null;
    setCloudStatus("Déconnecté");
    await refreshCloudAuthUI();
}

async function cloudFetch() {
    const client = initCloudClient();
    if (!client || !cloudUser) throw new Error("Compte Astra non connecté.");
    const { data: row, error } = await client
        .from("astra_data")
        .select("data, updated_at")
        .eq("user_id", cloudUser.id)
        .maybeSingle();
    if (error) throw error;
    return row || null;
}

async function cloudPush() {
    const client = initCloudClient();
    if (!client || !cloudUser) return false;
    const payload = { user_id: cloudUser.id, data, updated_at: new Date().toISOString() };
    const { error } = await client.from("astra_data").upsert(payload, { onConflict: "user_id" });
    if (error) throw error;
    const now = payload.updated_at;
    localStorage.setItem(CLOUD_LAST_SYNC_KEY, now);
    const lastEl = document.getElementById("cloudLastSync");
    if (lastEl) lastEl.textContent = formatCloudDate(now);
    return true;
}

async function cloudInitialSync() {
    if (!cloudUser) return;
    setCloudStatus("Synchronisation…", "syncing");
    try {
        const remote = await cloudFetch();
        if (remote?.data) {
            if (meaningfulLocalData()) {
                const useCloud = confirm("Astra a trouvé des données dans le cloud.\n\nOK = charger les données cloud sur cet appareil.\nAnnuler = envoyer les données de cet appareil vers le cloud.");
                if (useCloud) {
                    data = { ...createDefaultData(), ...remote.data, goals:{...createDefaultData().goals,...(remote.data.goals||{})}, subjects:{...createDefaultData().subjects,...(remote.data.subjects||{})} };
                    ensureV3Data();
                    ensureV5Data();
                    localStorage.setItem("astraData", JSON.stringify(data));
                } else {
                    await cloudPush();
                }
            } else {
                data = { ...createDefaultData(), ...remote.data, goals:{...createDefaultData().goals,...(remote.data.goals||{})}, subjects:{...createDefaultData().subjects,...(remote.data.subjects||{})} };
                ensureV3Data();
                ensureV5Data();
                localStorage.setItem("astraData", JSON.stringify(data));
                localStorage.setItem(CLOUD_LAST_SYNC_KEY, remote.updated_at || new Date().toISOString());
            }
        } else {
            await cloudPush();
        }
        renderAll();
        setCloudStatus("Synchronisé", "connected");
        const msg = document.getElementById("cloudSyncMessage");
        if (msg) msg.textContent = "PC et téléphone peuvent maintenant utiliser le même compte.";
    } catch (error) {
        console.error("Astra cloud sync:", error);
        setCloudStatus("Erreur de synchronisation");
        const msg = document.getElementById("cloudSyncMessage");
        if (msg) msg.textContent = error.message || "Impossible de synchroniser.";
    }
}

async function cloudSyncNow() {
    if (!cloudUser || cloudSyncBusy) return;
    cloudSyncBusy = true;
    setCloudStatus("Synchronisation…", "syncing");
    try {
        await cloudPush();
        setCloudStatus("Synchronisé", "connected");
        const msg = document.getElementById("cloudSyncMessage");
        if (msg) msg.textContent = "Les données locales ont été envoyées dans le cloud.";
    } catch (error) {
        console.error("Astra cloud sync:", error);
        setCloudStatus("Erreur de synchronisation");
        const msg = document.getElementById("cloudSyncMessage");
        if (msg) msg.textContent = error.message || "Impossible de synchroniser.";
    } finally { cloudSyncBusy = false; }
}

function scheduleCloudPush() {
    if (!cloudUser) return;
    clearTimeout(cloudSyncTimer);
    cloudSyncTimer = setTimeout(async () => {
        if (cloudSyncBusy) return;
        try { await cloudPush(); setCloudStatus("Synchronisé", "connected"); }
        catch (error) { console.error("Astra cloud auto-sync:", error); }
    }, 1200);
}

window.addEventListener("load", async () => {
    try { await refreshCloudAuthUI(); } catch (e) { console.error(e); }
});

/* =========================================================
   STRUCTURE DES DONNÉES
========================================================= */

const defaultData = {

    tasks: [],

    events: [],

    sessions: [],

    journal: [],

    goals: {

        weeklyHours: 0

    },

    subjects: {

        Maths: 0,

        Physique: 0,

        Allemand: 0,

        Français: 0,

        Histoire: 0,

        Autre: 0

    }

};


function createDefaultData() {

    return JSON.parse(
        JSON.stringify(defaultData)
    );

}


/* =========================================================
   CHARGEMENT / MIGRATION
========================================================= */

let data =
    loadData();


function loadData() {

    const saved =
        localStorage.getItem(
            "astraData"
        );


    if (!saved) {

        return createDefaultData();

    }


    try {

        const parsed =
            JSON.parse(saved);


        return {

            ...createDefaultData(),

            ...parsed,

            goals: {

                ...createDefaultData().goals,

                ...(parsed.goals || {})

            },

            subjects: {

                ...createDefaultData().subjects,

                ...(parsed.subjects || {})

            }

        };

    } catch {

        return createDefaultData();

    }

}


/* =========================================================
   SAUVEGARDE
========================================================= */

function saveData() {

    localStorage.setItem(
        "astraData",
        JSON.stringify(data)
    );

    scheduleCloudPush();

}


/* =========================================================
   NAVIGATION
========================================================= */

const navButtons =
    document.querySelectorAll(
        ".nav-button"
    );


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

            page.classList.remove(
                "active"
            );

        });


    const target =
        document.getElementById(
            pageName
        );


    if (!target) return;


    target.classList.add("active");


    navButtons.forEach(button => {

        button.classList.toggle(
            "active",
            button.dataset.page ===
                pageName
        );

    });


    if (pageName === "stats") {

        renderStats();

    }


    if (pageName === "journal") {

        renderJournal();

    }


    if (pageName === "goals") {

        renderGoals();

    }


    if (pageName === "timer") {

        updateTimerTaskList();

        renderRecentSessions();

    }


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


/* =========================================================
   DATE
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
        .getElementById(
            "currentDate"
        )
        .textContent =
        formatted.toUpperCase();


    document
        .getElementById(
            "journalDate"
        )
        .textContent =
        date.toLocaleDateString(
            "fr-FR",
            {
                weekday: "long",
                day: "numeric",
                month: "long"
            }
        );

}


/* =========================================================
   TÂCHES
========================================================= */

let currentTaskFilter =
    "all";


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

        date: getToday(),

        createdAt:
            new Date().toISOString()

    });


    saveData();


    input.value = "";


    renderTasks();

}


function handleTaskEnter(event) {

    if (
        event.key ===
        "Enter"
    ) {

        addTask();

    }

}


function toggleTask(id) {

    const task =
        data.tasks.find(
            task =>
                task.id === id
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
            task =>
                task.id !== id
        );


    saveData();


    renderTasks();

}


function setTaskFilter(
    filter,
    button
) {

    currentTaskFilter =
        filter;


    document
        .querySelectorAll(
            ".filter-button"
        )
        .forEach(
            element =>
                element.classList.remove(
                    "active"
                )
        );


    button.classList.add(
        "active"
    );


    renderTasks();

}


function getFilteredTasks() {

    switch (
        currentTaskFilter
    ) {

        case "today":

            return data.tasks.filter(
                task =>
                    task.date ===
                    getToday()
            );


        case "pending":

            return data.tasks.filter(
                task =>
                    !task.completed
            );


        case "done":

            return data.tasks.filter(
                task =>
                    task.completed
            );


        default:

            return data.tasks;

    }

}


function createTaskHTML(task) {

    return `

        <div class="task ${
            task.completed
                ? "completed"
                : ""
        }">

            <input
                class="task-checkbox"
                type="checkbox"
                ${
                    task.completed
                        ? "checked"
                        : ""
                }
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

    const container =
        document.getElementById(
            "allTasks"
        );


    const dashboard =
        document.getElementById(
            "dashboardTasks"
        );


    const filtered =
        getFilteredTasks();


    const todayTasks =
        data.tasks.filter(
            task =>
                task.date ===
                getToday()
        );


    if (
        filtered.length === 0
    ) {

        container.innerHTML =
            `
                <p class="empty">
                    Aucune tâche ici.
                </p>
            `;

    } else {

        container.innerHTML =
            filtered
                .map(createTaskHTML)
                .join("");

    }


    if (
        todayTasks.length === 0
    ) {

        dashboard.innerHTML =
            `
                <p class="empty">
                    Aucune tâche pour aujourd'hui.
                </p>
            `;

    } else {

        dashboard.innerHTML =
            todayTasks
                .slice(0, 6)
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
            .getElementById(
                "eventName"
            )
            .value
            .trim();


    const date =
        document
            .getElementById(
                "eventDate"
            )
            .value;


    const type =
        document
            .getElementById(
                "eventType"
            )
            .value;


    if (!name || !date) {

        alert(
            "Ajoute un nom et une date."
        );

        return;

    }


    data.events.push({

        id: Date.now(),

        name: name,

        date: date,

        type: type

    });


    saveData();


    document
        .getElementById(
            "eventName"
        )
        .value = "";


    document
        .getElementById(
            "eventDate"
        )
        .value = "";


    renderEvents();

}


function deleteEvent(id) {

    data.events =
        data.events.filter(
            event =>
                event.id !== id
        );


    saveData();


    renderEvents();

}


function createEventHTML(
    event
) {

    return `

        <div class="event">

            <div class="event-date">

                ${formatDate(
                    event.date
                )}

            </div>

            <div class="event-name">

                ${escapeHTML(
                    event.name
                )}

            </div>

            <div class="event-type">

                ${escapeHTML(
                    event.type
                )}

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

            .filter(
                event =>
                    event.date >=
                    today
            )

            .sort(
                (a,b) =>
                    a.date.localeCompare(
                        b.date
                    )
            );


    if (
        data.events.length === 0
    ) {

        container.innerHTML =
            `
                <p class="empty">
                    Aucun événement enregistré.
                </p>
            `;

    } else {

        const sorted =
            [...data.events]
                .sort(
                    (a,b) =>
                        a.date.localeCompare(
                            b.date
                        )
                );


        container.innerHTML =
            sorted
                .map(
                    createEventHTML
                )
                .join("");

    }


    if (
        upcoming.length === 0
    ) {

        dashboard.innerHTML =
            `
                <p class="empty">
                    Aucun événement à venir.
                </p>
            `;

    } else {

        dashboard.innerHTML =
            upcoming
                .slice(0,4)
                .map(
                    createEventHTML
                )
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

let timerStartedSeconds =
    25 * 60;

let timerRunning =
    false;


function updateTimerDisplay() {

    const minutes =
        Math.floor(
            remainingSeconds /
            60
        );


    const seconds =
        remainingSeconds %
        60;


    document
        .getElementById(
            "timerDisplay"
        )
        .textContent =
        `${String(minutes).padStart(2,"0")}:${String(seconds).padStart(2,"0")}`;

}


function startTimer() {

    if (timerRunning)
        return;


    const input =
        document.getElementById(
            "timerMinutes"
        );


    if (
        remainingSeconds ===
        timerStartedSeconds
    ) {

        const minutes =
            parseInt(
                input.value
            );


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


    timerRunning =
        true;


    document
        .getElementById(
            "startTimer"
        )
        .innerHTML = `
            <i data-lucide="play"></i>
            En cours…
        `;


    refreshIcons();


    timerInterval =
        setInterval(
            () => {

                remainingSeconds--;

                updateTimerDisplay();


                if (
                    remainingSeconds <= 0
                ) {

                    finishTimer();

                }

            },
            1000
        );

}


function pauseTimer() {

    clearInterval(
        timerInterval
    );


    timerRunning =
        false;


    document
        .getElementById(
            "startTimer"
        )
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


    timerRunning =
        false;


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
        .getElementById(
            "startTimer"
        )
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


    timerRunning =
        false;


    const subject =
        document
            .getElementById(
                "timerSubject"
            )
            .value;


    const taskId =
        document
            .getElementById(
                "timerTask"
            )
            .value;


    const minutes =
        Math.round(
            timerStartedSeconds /
            60
        );


    if (
        minutes > 0
    ) {

        data.sessions.push({

            id: Date.now(),

            date: getToday(),

            duration: minutes,

            subject: subject,

            taskId:
                taskId
                    ? Number(taskId)
                    : null

        });


        if (
            !data.subjects[subject]
        ) {

            data.subjects[subject] =
                0;

        }


        data.subjects[subject] +=
            minutes;


        saveData();

    }


    alert(
        `Session terminée !\n\n${minutes} minutes de ${subject}.`
    );


    resetTimer();


    renderAll();

}


function updateTimerTaskList() {

    const select =
        document.getElementById(
            "timerTask"
        );


    const subject =
        document
            .getElementById(
                "timerSubject"
            )
            .value;


    const tasks =
        data.tasks.filter(
            task =>
                !task.completed &&
                task.subject === subject
        );


    select.innerHTML = `

        <option value="">
            Session générale
        </option>

        ${
            tasks
                .map(
                    task => `
                        <option value="${task.id}">
                            ${escapeHTML(
                                task.name
                            )}
                        </option>
                    `
                )
                .join("")
        }

    `;

}


/* =========================================================
   HISTORIQUE DES SESSIONS
========================================================= */

function renderRecentSessions() {

    const container =
        document.getElementById(
            "recentSessions"
        );


    const sessions =
        [...data.sessions]
            .reverse()
            .slice(0,8);


    if (
        sessions.length === 0
    ) {

        container.innerHTML =
            `
                <p class="empty">
                    Aucune session terminée.
                </p>
            `;

        return;

    }


    container.innerHTML =
        sessions
            .map(
                session => {

                    const task =
                        data.tasks.find(
                            task =>
                                task.id ===
                                session.taskId
                        );


                    return `

                        <div class="session-row">

                            <div class="session-row-main">

                                <strong>
                                    ${escapeHTML(
                                        session.subject
                                    )}
                                </strong>

                                <small>
                                    ${formatDate(
                                        session.date
                                    )}
                                    ${
                                        task
                                            ? " · " +
                                              escapeHTML(
                                                  task.name
                                              )
                                            : ""
                                    }
                                </small>

                            </div>

                            <div class="session-duration">

                                ${session.duration} min

                            </div>

                        </div>

                    `;

                }
            )
            .join("");

}


/* =========================================================
   OBJECTIFS
========================================================= */

function saveWeeklyGoal() {

    const input =
        document.getElementById(
            "weeklyGoalInput"
        );


    const hours =
        parseFloat(
            input.value
        );


    if (
        isNaN(hours) ||
        hours < 0
    ) {

        return;

    }


    data.goals.weeklyHours =
        hours;


    saveData();


    renderGoals();

    updateWeeklyGoal();

}


function getStartOfWeek(date) {

    const result =
        new Date(date);


    const day =
        result.getDay();


    const difference =
        day === 0
            ? -6
            : 1 - day;


    result.setDate(
        result.getDate() +
        difference
    );


    result.setHours(
        0,0,0,0
    );


    return result;

}


function getEndOfWeek(date) {

    const result =
        getStartOfWeek(date);


    result.setDate(
        result.getDate() + 6
    );


    return result;

}


function getSessionsBetween(
    start,
    end
) {

    return data.sessions.filter(
        session => {

            const date =
                new Date(
                    session.date +
                    "T12:00:00"
                );


            return (
                date >= start &&
                date <= end
            );

        }
    );

}


function getCurrentWeekSessions() {

    return getSessionsBetween(
        getStartOfWeek(
            new Date()
        ),
        getEndOfWeek(
            new Date()
        )
    );

}


function getPreviousWeekSessions() {

    const start =
        getStartOfWeek(
            new Date()
        );


    start.setDate(
        start.getDate() - 7
    );


    const end =
        new Date(start);


    end.setDate(
        end.getDate() + 6
    );


    return getSessionsBetween(
        start,
        end
    );

}


function sumSessionMinutes(
    sessions
) {

    return sessions.reduce(
        (total, session) =>
            total +
            Number(
                session.duration
            ),
        0
    );

}


function updateWeeklyGoal() {

    const goal =
        Number(
            data.goals.weeklyHours
        ) || 0;


    const minutes =
        sumSessionMinutes(
            getCurrentWeekSessions()
        );


    const targetMinutes =
        goal * 60;


    const percentage =
        targetMinutes > 0
            ? Math.min(
                100,
                Math.round(
                    minutes /
                    targetMinutes *
                    100
                )
            )
            : 0;


    const text =
        `${formatHours(minutes)} / ${goal}h`;


    document
        .getElementById(
            "weeklyGoalText"
        )
        .textContent =
        text;


    document
        .getElementById(
            "weeklyGoalBar"
        )
        .style.width =
        `${percentage}%`;


    const message =
        document.getElementById(
            "weeklyGoalMessage"
        );


    if (goal === 0) {

        message.textContent =
            "Définis un objectif hebdomadaire pour commencer.";

    } else if (
        percentage >= 100
    ) {

        message.textContent =
            "Objectif atteint. Le reste est du bonus.";

    } else {

        const remaining =
            targetMinutes -
            minutes;


        message.textContent =
            `Il te reste ${formatMinutes(remaining)} pour atteindre ton objectif.`;

    }

}


function renderGoals() {

    const input =
        document.getElementById(
            "weeklyGoalInput"
        );


    input.value =
        data.goals.weeklyHours || "";


    const goal =
        Number(
            data.goals.weeklyHours
        ) || 0;


    const sessions =
        getCurrentWeekSessions();


    const total =
        sumSessionMinutes(
            sessions
        );


    const target =
        goal * 60;


    const percentage =
        target > 0
            ? Math.min(
                100,
                Math.round(
                    total /
                    target *
                    100
                )
            )
            : 0;


    document
        .getElementById(
            "goalDisplay"
        )
        .textContent =
        `${formatHours(total)} / ${goal}h`;


    document
        .getElementById(
            "goalPageBar"
        )
        .style.width =
        `${percentage}%`;


    document
        .getElementById(
            "goalPageMessage"
        )
        .textContent =
        goal === 0
            ? "Aucun objectif défini."
            : percentage >= 100
                ? "Objectif atteint."
                : `Progression : ${percentage}%`;


    renderWeeklySubjectGoals();

}


function renderWeeklySubjectGoals() {

    const container =
        document.getElementById(
            "weeklySubjectGoals"
        );


    const sessions =
        getCurrentWeekSessions();


    const totals = {};


    Object.keys(
        data.subjects
    ).forEach(
        subject => {
            totals[subject] = 0;
        }
    );


    sessions.forEach(
        session => {

            if (
                totals[
                    session.subject
                ] === undefined
            ) {

                totals[
                    session.subject
                ] = 0;

            }


            totals[
                session.subject
            ] += session.duration;

        }
    );


    const max =
        Math.max(
            ...Object.values(
                totals
            ),
            60
        );


    container.innerHTML =
        Object.entries(
            totals
        )
        .map(
            ([subject, minutes]) => {

                const percentage =
                    Math.round(
                        minutes /
                        max *
                        100
                    );


                return `

                    <div class="weekly-subject-row">

                        <div class="weekly-subject-header">

                            <span>
                                ${subject}
                            </span>

                            <span>
                                ${formatMinutes(
                                    minutes
                                )}
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
   JOURNAL
========================================================= */

let selectedMood = null;


function selectMood(mood) {

    selectedMood =
        mood;


    document
        .querySelectorAll(
            ".mood-button"
        )
        .forEach(
            button => {

                button.classList.toggle(
                    "active",
                    Number(
                        button.dataset.mood
                    ) === mood
                );

            }
        );

}


function getMoodLabel(mood) {

    const labels = {

        1: "Très mauvaise",

        2: "Mauvaise",

        3: "Moyenne",

        4: "Bien",

        5: "Très bien"

    };


    return (
        labels[mood] ||
        "Non renseignée"
    );

}


function saveJournal() {

    const date =
        getToday();


    const done =
        document
            .getElementById(
                "journalDone"
            )
            .value
            .trim();


    const blocked =
        document
            .getElementById(
                "journalBlocked"
            )
            .value
            .trim();


    const improve =
        document
            .getElementById(
                "journalImprove"
            )
            .value
            .trim();


    const existing =
        data.journal.find(
            entry =>
                entry.date === date
        );


    if (existing) {

        existing.mood =
            selectedMood;

        existing.done =
            done;

        existing.blocked =
            blocked;

        existing.improve =
            improve;

    } else {

        data.journal.push({

            id: Date.now(),

            date: date,

            mood: selectedMood,

            done: done,

            blocked: blocked,

            improve: improve

        });

    }


    saveData();


    renderJournal();


    alert(
        "Ta journée a été sauvegardée."
    );

}


function loadTodayJournal() {

    const entry =
        data.journal.find(
            entry =>
                entry.date ===
                getToday()
        );


    document
        .getElementById(
            "journalDone"
        )
        .value =
        entry?.done || "";


    document
        .getElementById(
            "journalBlocked"
        )
        .value =
        entry?.blocked || "";


    document
        .getElementById(
            "journalImprove"
        )
        .value =
        entry?.improve || "";


    selectedMood =
        entry?.mood || null;


    document
        .querySelectorAll(
            ".mood-button"
        )
        .forEach(
            button => {

                button.classList.toggle(
                    "active",
                    Number(
                        button.dataset.mood
                    ) === selectedMood
                );

            }
        );

}


function deleteJournal(id) {

    data.journal =
        data.journal.filter(
            entry =>
                entry.id !== id
        );


    saveData();


    renderJournal();

}


function renderJournal() {

    loadTodayJournal();


    const container =
        document.getElementById(
            "journalHistory"
        );


    const entries =
        [...data.journal]
            .sort(
                (a,b) =>
                    b.date.localeCompare(
                        a.date
                    )
            );


    if (
        entries.length === 0
    ) {

        container.innerHTML =
            `
                <p class="empty">
                    Ton journal est encore vide.
                </p>
            `;

        return;

    }


    container.innerHTML =
        entries
            .map(
                entry => `

                    <div class="journal-entry">

                        <div class="journal-entry-header">

                            <div>

                                <span class="card-label">
                                    ${formatDateLong(
                                        entry.date
                                    )}
                                </span>

                                <h3>
                                    ${escapeHTML(
                                        getMoodLabel(
                                            entry.mood
                                        )
                                    )}
                                </h3>

                            </div>


                            <button
                                class="delete-task"
                                style="opacity:1"
                                onclick="deleteJournal(${entry.id})"
                            >

                                <i data-lucide="trash-2"></i>

                            </button>

                        </div>


                        ${
                            entry.done
                                ? `
                                    <div class="journal-entry-section">

                                        <strong>
                                            Ce que j'ai fait
                                        </strong>

                                        <p>
                                            ${escapeHTML(
                                                entry.done
                                            )}
                                        </p>

                                    </div>
                                `
                                : ""
                        }


                        ${
                            entry.blocked
                                ? `
                                    <div class="journal-entry-section">

                                        <strong>
                                            Ce qui m'a bloqué
                                        </strong>

                                        <p>
                                            ${escapeHTML(
                                                entry.blocked
                                            )}
                                        </p>

                                    </div>
                                `
                                : ""
                        }


                        ${
                            entry.improve
                                ? `
                                    <div class="journal-entry-section">

                                        <strong>
                                            À améliorer
                                        </strong>

                                        <p>
                                            ${escapeHTML(
                                                entry.improve
                                            )}
                                        </p>

                                    </div>
                                `
                                : ""
                        }

                    </div>

                `
            )
            .join("");


    refreshIcons();

}


/* =========================================================
   STATISTIQUES
========================================================= */

function renderStats() {

    const currentSessions =
        getCurrentWeekSessions();


    const previousSessions =
        getPreviousWeekSessions();


    const currentMinutes =
        sumSessionMinutes(
            currentSessions
        );


    const previousMinutes =
        sumSessionMinutes(
            previousSessions
        );


    const average =
        currentSessions.length > 0
            ? Math.round(
                currentMinutes /
                currentSessions.length
            )
            : 0;


    document
        .getElementById(
            "statsWeekTime"
        )
        .textContent =
        formatHours(
            currentMinutes
        );


    document
        .getElementById(
            "statsWeekSessions"
        )
        .textContent =
        currentSessions.length;


    document
        .getElementById(
            "statsAverage"
        )
        .textContent =
        formatMinutes(
            average
        );


    document
        .getElementById(
            "previousWeekTime"
        )
        .textContent =
        formatHours(
            previousMinutes
        );


    document
        .getElementById(
            "currentWeekTime"
        )
        .textContent =
        formatHours(
            currentMinutes
        );


    const evolution =
        document.getElementById(
            "weekEvolution"
        );


    if (
        previousMinutes === 0
    ) {

        evolution.textContent =
            currentMinutes > 0
                ? "+100 %"
                : "—";

    } else {

        const change =
            Math.round(
                (
                    currentMinutes -
                    previousMinutes
                ) /
                previousMinutes *
                100
            );


        evolution.textContent =
            `${
                change >= 0
                    ? "+"
                    : ""
            }${change} %`;

    }


    renderSubjectStats();


    renderBestDay();


    document
        .getElementById(
            "totalDays"
        )
        .textContent =
        getWorkedDays();


    refreshIcons();

}


function renderSubjectStats() {

    const container =
        document.getElementById(
            "subjectStats"
        );


    const totals = {};


    Object.keys(
        data.subjects
    ).forEach(
        subject => {
            totals[subject] = 0;
        }
    );


    data.sessions.forEach(
        session => {

            if (
                totals[
                    session.subject
                ] === undefined
            ) {

                totals[
                    session.subject
                ] = 0;

            }


            totals[
                session.subject
            ] +=
                session.duration;

        }
    );


    const totalMinutes =
        Object.values(
            totals
        )
        .reduce(
            (a,b) =>
                a + b,
            0
        );


    container.innerHTML =
        Object.entries(
            totals
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
                                ${formatMinutes(
                                    minutes
                                )}
                                ·
                                ${percentage}%
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


function renderBestDay() {

    const totals = {};


    data.sessions.forEach(
        session => {

            if (
                !totals[
                    session.date
                ]
            ) {

                totals[
                    session.date
                ] = 0;

            }


            totals[
                session.date
            ] +=
                session.duration;

        }
    );


    const entries =
        Object.entries(
            totals
        );


    if (
        entries.length === 0
    ) {

        document
            .getElementById(
                "bestDay"
            )
            .textContent =
            "0 min";


        document
            .getElementById(
                "bestDayDate"
            )
            .textContent =
            "Pas encore de données.";


        return;

    }


    entries.sort(
        (a,b) =>
            b[1] - a[1]
    );


    const [
        date,
        minutes
    ] =
        entries[0];


    document
        .getElementById(
            "bestDay"
        )
        .textContent =
        formatMinutes(
            minutes
        );


    document
        .getElementById(
            "bestDayDate"
        )
        .textContent =
        formatDateLong(
            date
        );

}


function getWorkedDays() {

    return new Set(
        data.sessions.map(
            session =>
                session.date
        )
    ).size;

}


/* =========================================================
   SÉRIE
========================================================= */

function calculateStreak() {

    const workedDates =
        new Set(
            data.sessions.map(
                session =>
                    session.date
            )
        );


    let streak = 0;


    const current =
        new Date();


    while (
        workedDates.has(
            getDateString(
                current
            )
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
        sumSessionMinutes(
            todaySessions
        );


    const completed =
        data.tasks.filter(
            task =>
                task.completed
        ).length;


    const totalTasks =
        data.tasks.length;


    const streak =
        calculateStreak();


    document
        .getElementById(
            "todayTime"
        )
        .textContent =
        formatMinutes(
            todayMinutes
        );


    document
        .getElementById(
            "completedTasks"
        )
        .textContent =
        `${completed} / ${totalTasks}`;


    document
        .getElementById(
            "streakValue"
        )
        .textContent =
        `${streak} ${
            streak > 1
                ? "jours"
                : "jour"
        }`;


    document
        .getElementById(
            "dashboardStreak"
        )
        .textContent =
        `${streak} ${
            streak > 1
                ? "jours"
                : "jour"
        }`;

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


    const totals = {};


    Object.keys(
        data.subjects
    ).forEach(
        subject => {
            totals[subject] = 0;
        }
    );


    data.sessions.forEach(
        session => {

            if (
                totals[
                    session.subject
                ] === undefined
            ) {

                totals[
                    session.subject
                ] = 0;

            }


            totals[
                session.subject
            ] +=
                session.duration;

        }
    );


    const max =
        Math.max(
            ...Object.values(
                totals
            ),
            1
        );


    container.innerHTML =
        Object.entries(
            totals
        )
        .map(
            ([name, minutes]) => {

                const percentage =
                    Math.round(
                        minutes /
                        max *
                        100
                    );


                return `

                    <div class="subject-card">

                        <div class="subject-top">

                            <div class="subject-name">
                                ${name}
                            </div>

                            <div class="subject-percent">
                                ${percentage}%
                            </div>

                        </div>


                        <div class="progress">

                            <div
                                class="progress-bar"
                                style="width:${percentage}%"
                            ></div>

                        </div>


                        <div class="subject-time">

                            ${formatMinutes(
                                minutes
                            )}
                            travaillées

                        </div>


                        <div class="subject-description">

                            ${
                                subjectDescriptions[
                                    name
                                ]
                            }

                        </div>

                    </div>

                `;

            }
        )
        .join("");

}


/* =========================================================
   UTILITAIRES D'AFFICHAGE
========================================================= */

function formatMinutes(minutes) {

    minutes =
        Math.round(
            Number(minutes) || 0
        );


    if (
        minutes < 60
    ) {

        return `${minutes} min`;

    }


    const hours =
        Math.floor(
            minutes / 60
        );


    const remaining =
        minutes % 60;


    return `${hours}h ${String(
        remaining
    ).padStart(2,"0")}`;

}


function formatHours(minutes) {

    return formatMinutes(
        minutes
    );

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


function formatDateLong(
    dateString
) {

    const date =
        new Date(
            dateString +
            "T12:00:00"
        );


    return date.toLocaleDateString(
        "fr-FR",
        {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
        }
    );

}


function escapeHTML(text) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        text ?? "";


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


    link.href =
        url;


    link.download =
        `astra-backup-${getToday()}.json`;


    document.body.appendChild(
        link
    );


    link.click();


    link.remove();


    URL.revokeObjectURL(
        url
    );

}


/* =========================================================
   IMPORT
========================================================= */

function importData(event) {

    const file =
        event.target.files[0];


    if (!file) return;


    const reader =
        new FileReader();


    reader.onload =
        function () {

            try {

                const imported =
                    JSON.parse(
                        reader.result
                    );


                if (
                    !imported ||
                    typeof imported !==
                        "object"
                ) {

                    throw new Error();

                }


                data = {

                    ...createDefaultData(),

                    ...imported,

                    goals: {

                        ...createDefaultData()
                            .goals,

                        ...(imported.goals || {})

                    },

                    subjects: {

                        ...createDefaultData()
                            .subjects,

                        ...(imported.subjects || {})

                    }

                };


                saveData();


                renderAll();


                alert(
                    "Sauvegarde importée avec succès."
                );


            } catch {

                alert(
                    "Impossible de lire cette sauvegarde."
                );

            }

        };


    reader.readAsText(
        file
    );

}


/* =========================================================
   SUPPRESSION DES DONNÉES
========================================================= */

function clearData() {

    const confirmation =
        confirm(
            "Toutes tes données Astra seront supprimées. Cette action est irréversible.\n\nContinuer ?"
        );


    if (!confirmation)
        return;


    localStorage.removeItem(
        "astraData"
    );


    data =
        createDefaultData();


    saveData();


    renderAll();

}


/* =========================================================
   MESSAGE DU JOUR
========================================================= */

function updateDailyMessage() {

    const messages = [

        "La régularité bat la motivation.",

        "Une bonne session vaut mieux qu'une journée parfaite imaginée.",

        "Travaille sur ce qui est devant toi.",

        "Chaque heure réellement travaillée s'additionne.",

        "Tu n'as pas besoin de tout réussir aujourd'hui.",

        "Comprendre vaut mieux que simplement terminer.",

        "Commence petit. Continue longtemps."

    ];


    const index =
        Math.floor(
            new Date()
                .getDate() %
            messages.length
        );


    document
        .getElementById(
            "dailyMessage"
        )
        .textContent =
        messages[index];

}


/* =========================================================
   RENDU GLOBAL
========================================================= */

function renderAll() {

    updateDate();

    renderTasks();

    renderEvents();

    renderSubjects();

    updateQuickStats();

    updateWeeklyGoal();

    renderGoals();

    renderRecentSessions();

    renderJournal();

    renderStats();

    updateDailyMessage();

    updateTimerTaskList();

    updateTimerDisplay();

    refreshIcons();

}



/* =========================================================
   ASTRA OS V3 — JOURNAL / MATIÈRES / GRAPHIQUES
========================================================= */

function ensureV3Data() {
    if (!data.chapters || typeof data.chapters !== "object" || Array.isArray(data.chapters)) {
        data.chapters = {};
    }
    Object.keys(data.subjects || {}).forEach(subject => {
        if (!Array.isArray(data.chapters[subject])) data.chapters[subject] = [];
    });
    saveData();
}

let currentSubjectName = null;
let currentChapterId = null;
let journalMoodFilter = "all";
let journalSort = "date-desc";

function setJournalFilters() {
    journalMoodFilter = document.getElementById("journalMoodFilter")?.value || "all";
    journalSort = document.getElementById("journalSort")?.value || "date-desc";
    renderJournal();
}

function getJournalEntriesSorted() {
    let entries = [...data.journal];
    if (journalMoodFilter !== "all") {
        entries = entries.filter(entry => Number(entry.mood) === Number(journalMoodFilter));
    }
    entries.sort((a, b) => {
        if (journalSort === "mood-desc" || journalSort === "mood-asc") {
            const moodA = Number(a.mood || 0);
            const moodB = Number(b.mood || 0);
            if (moodA !== moodB) return journalSort === "mood-desc" ? moodB - moodA : moodA - moodB;
            return journalSort === "mood-desc"
                ? b.date.localeCompare(a.date)
                : a.date.localeCompare(b.date);
        }
        return journalSort === "date-desc"
            ? b.date.localeCompare(a.date)
            : a.date.localeCompare(b.date);
    });
    return entries;
}

function moodIcon(mood) {
    return ({1:"😞",2:"😕",3:"😐",4:"🙂",5:"😄"})[Number(mood)] || "—";
}

function renderJournal() {
    loadTodayJournal();
    const moodSelect = document.getElementById("journalMoodFilter");
    const sortSelect = document.getElementById("journalSort");
    if (moodSelect) moodSelect.value = journalMoodFilter;
    if (sortSelect) sortSelect.value = journalSort;

    const container = document.getElementById("journalHistory");
    if (!container) return;
    const entries = getJournalEntriesSorted();

    if (!entries.length) {
        container.innerHTML = `<p class="empty">Aucune journée ne correspond à ces filtres.</p>`;
        return;
    }

    container.innerHTML = entries.map(entry => `
        <article class="journal-entry journal-day-card">
            <div class="journal-entry-header">
                <div>
                    <span class="journal-day-date">${escapeHTML(formatDateLong(entry.date))}</span>
                    <h3>${moodIcon(entry.mood)} ${escapeHTML(getMoodLabel(entry.mood))}</h3>
                </div>
                <div class="journal-day-actions">
                    <span class="mood-score">${entry.mood ? `${entry.mood}/5` : "—"}</span>
                    <button class="delete-task" style="opacity:1" onclick="deleteJournal(${entry.id})" title="Supprimer">
                        <i data-lucide="trash-2"></i>
                    </button>
                </div>
            </div>
            <div class="journal-day-meta">
                <span><i data-lucide="clock-3"></i> ${formatMinutes(getMinutesForDate(entry.date))}</span>
                <span><i data-lucide="check-circle-2"></i> ${getCompletedTasksForDate(entry.date)} tâche${getCompletedTasksForDate(entry.date) > 1 ? "s" : ""} terminée${getCompletedTasksForDate(entry.date) > 1 ? "s" : ""}</span>
            </div>
            ${entry.done ? `<div class="journal-entry-section"><strong>Ce que j'ai fait</strong><p>${escapeHTML(entry.done)}</p></div>` : ""}
            ${entry.blocked ? `<div class="journal-entry-section"><strong>Ce qui m'a bloqué</strong><p>${escapeHTML(entry.blocked)}</p></div>` : ""}
            ${entry.improve ? `<div class="journal-entry-section"><strong>À améliorer</strong><p>${escapeHTML(entry.improve)}</p></div>` : ""}
        </article>
    `).join("");
    refreshIcons();
}

function getMinutesForDate(date) {
    return data.sessions.filter(s => s.date === date).reduce((sum, s) => sum + Number(s.duration || 0), 0);
}

function getCompletedTasksForDate(date) {
    return data.tasks.filter(t => t.date === date && t.completed).length;
}

function renderSubjects() {
    ensureV3Data();
    const grid = document.getElementById("subjectsGrid");
    const detail = document.getElementById("subjectDetail");
    if (!grid || !detail) return;
    if (currentSubjectName) {
        renderSubjectDetail(currentSubjectName);
        return;
    }
    grid.hidden = false;
    detail.hidden = true;

    const totals = {};
    Object.keys(data.subjects).forEach(subject => totals[subject] = 0);
    data.sessions.forEach(session => totals[session.subject] = (totals[session.subject] || 0) + Number(session.duration || 0));
    const max = Math.max(...Object.values(totals), 1);

    grid.innerHTML = Object.entries(totals).map(([name, minutes]) => {
        const chapters = data.chapters[name] || [];
        const mastered = chapters.length ? Math.round(chapters.reduce((sum, c) => sum + Number(c.mastery || 0), 0) / chapters.length) : 0;
        const percentage = Math.round(minutes / max * 100);
        return `
            <button class="subject-card subject-card-button" onclick="openSubject('${escapeAttr(name)}')">
                <div class="subject-top"><div class="subject-name">${escapeHTML(name)}</div><div class="subject-percent">${percentage}%</div></div>
                <div class="progress"><div class="progress-bar" style="width:${percentage}%"></div></div>
                <div class="subject-time">${formatMinutes(minutes)} travaillées</div>
                <div class="subject-description">${escapeHTML(subjectDescriptions[name] || "Matière et notes personnelles.")}</div>
                <div class="subject-chapters-preview">${chapters.length} chapitre${chapters.length > 1 ? "s" : ""} · ${mastered}% de maîtrise moyenne</div>
            </button>`;
    }).join("");
    refreshIcons();
}

function escapeAttr(text) {
    return String(text).replace(/\\/g, "\\\\").replace(/'/g, "\\'").replace(/"/g, "&quot;");
}

function openSubject(name) {
    currentSubjectName = name;
    currentChapterId = null;
    renderSubjects();
    window.scrollTo({top:0, behavior:"smooth"});
}

function closeSubject() {
    currentSubjectName = null;
    currentChapterId = null;
    renderSubjects();
}

function addChapter() {
    if (!currentSubjectName) return;
    const title = prompt("Titre du chapitre :");
    if (!title || !title.trim()) return;
    ensureV3Data();
    const chapter = { id: Date.now(), title: title.trim(), notes: "", mastery: 0, createdAt: new Date().toISOString() };
    data.chapters[currentSubjectName].push(chapter);
    saveData();
    currentChapterId = chapter.id;
    renderSubjectDetail(currentSubjectName);
}

function deleteChapter(id) {
    if (!currentSubjectName) return;
    if (!confirm("Supprimer ce chapitre et toutes ses notes ?")) return;
    data.chapters[currentSubjectName] = (data.chapters[currentSubjectName] || []).filter(c => c.id !== id);
    currentChapterId = null;
    saveData();
    renderSubjectDetail(currentSubjectName);
}

function openChapter(id) {
    currentChapterId = id;
    renderSubjectDetail(currentSubjectName);
}

function saveChapter() {
    const chapter = (data.chapters[currentSubjectName] || []).find(c => c.id === currentChapterId);
    if (!chapter) return;
    const title = document.getElementById("chapterTitle")?.value.trim();
    const notes = document.getElementById("chapterNotes")?.value || "";
    const mastery = Math.min(100, Math.max(0, Number(document.getElementById("chapterMastery")?.value || 0)));
    if (!title) return;
    chapter.title = title;
    chapter.notes = notes;
    chapter.mastery = mastery;
    saveData();
    renderSubjectDetail(currentSubjectName);
}

function renderSubjectDetail(name) {
    const grid = document.getElementById("subjectsGrid");
    const detail = document.getElementById("subjectDetail");
    if (!grid || !detail) return;
    grid.hidden = true;
    detail.hidden = false;
    const chapters = data.chapters[name] || [];
    const selected = chapters.find(c => c.id === currentChapterId);
    const totalMastery = chapters.length ? Math.round(chapters.reduce((s,c) => s + Number(c.mastery || 0),0) / chapters.length) : 0;

    detail.innerHTML = `
        <button class="back-button" onclick="closeSubject()"><i data-lucide="arrow-left"></i> Retour aux matières</button>
        <div class="subject-detail-header">
            <div><span class="card-label">APPRENTISSAGE</span><h2>${escapeHTML(name)}</h2><p>${escapeHTML(subjectDescriptions[name] || "")}</p></div>
            <button class="primary-button" onclick="addChapter()"><i data-lucide="plus"></i> Nouveau chapitre</button>
        </div>
        <div class="subject-detail-layout">
            <div class="card chapter-list-card">
                <div class="card-header"><div><span class="card-label">CHAPITRES</span><h2>${chapters.length} chapitre${chapters.length > 1 ? "s" : ""}</h2></div><strong>${totalMastery}%</strong></div>
                ${chapters.length ? chapters.map(c => `
                    <button class="chapter-item ${selected?.id === c.id ? "active" : ""}" onclick="openChapter(${c.id})">
                        <div><strong>${escapeHTML(c.title)}</strong><small>${Number(c.mastery || 0)}% maîtrisé</small></div>
                        <div class="chapter-arrow">›</div>
                    </button>`).join("") : `<p class="empty">Crée ton premier chapitre.</p>`}
            </div>
            <div class="card chapter-editor-card">
                ${selected ? `
                    <div class="card-header"><div><span class="card-label">CHAPITRE</span><h2>Modifier le chapitre</h2></div><button class="delete-chapter" onclick="deleteChapter(${selected.id})" title="Supprimer"><i data-lucide="trash-2"></i></button></div>
                    <div class="chapter-form">
                        <label>Titre</label><input id="chapterTitle" value="${escapeAttr(selected.title)}" />
                        <label>Maîtrise <strong id="masteryValue">${Number(selected.mastery || 0)}%</strong></label>
                        <input id="chapterMastery" type="range" min="0" max="100" value="${Number(selected.mastery || 0)}" oninput="document.getElementById('masteryValue').textContent=this.value+'%'" />
                        <label>Notes personnelles</label>
                        <textarea id="chapterNotes" class="chapter-notes" placeholder="Définitions, méthodes, exemples, erreurs à éviter..."></textarea>
                        <button class="primary-button" onclick="saveChapter()"><i data-lucide="save"></i> Enregistrer</button>
                    </div>` : `<div class="chapter-empty"><i data-lucide="book-open"></i><h2>Sélectionne un chapitre</h2><p>Crée un chapitre puis écris tes propres notes, méthodes et explications.</p></div>`}
            </div>
        </div>`;
    if (selected) document.getElementById("chapterNotes").value = selected.notes || "";
    refreshIcons();
}

function renderStats() {
    const currentSessions = getCurrentWeekSessions();
    const previousSessions = getPreviousWeekSessions();
    const currentMinutes = sumSessionMinutes(currentSessions);
    const previousMinutes = sumSessionMinutes(previousSessions);
    const average = currentSessions.length ? Math.round(currentMinutes / currentSessions.length) : 0;

    const set = (id, value) => { const el=document.getElementById(id); if(el) el.textContent=value; };
    set("statsWeekTime", formatHours(currentMinutes));
    set("statsWeekSessions", currentSessions.length);
    set("statsAverage", formatMinutes(average));
    set("previousWeekTime", formatHours(previousMinutes));
    set("currentWeekTime", formatHours(currentMinutes));
    const evolution=document.getElementById("weekEvolution");
    if(evolution) evolution.textContent = previousMinutes===0 ? (currentMinutes>0?"+100 %":"—") : `${currentMinutes>=previousMinutes?"+":""}${Math.round((currentMinutes-previousMinutes)/previousMinutes*100)} %`;
    renderSubjectStats();
    renderBestDay();
    set("totalDays", getWorkedDays());
    drawWorkCharts();
    refreshIcons();
}

function aggregateDaily(days) {
    const out=[];
    for(let i=days-1;i>=0;i--){
        const d=new Date(); d.setHours(12,0,0,0); d.setDate(d.getDate()-i);
        const key=getDateString(d); out.push({date:key,minutes:getMinutesForDate(key)});
    }
    return out;
}

function getWeekStart(date) {
    const d=new Date(date+"T12:00:00");
    const day=(d.getDay()+6)%7; d.setDate(d.getDate()-day); return getDateString(d);
}

function aggregateWeekly(weeks=8) {
    const out=[]; const now=new Date(); now.setHours(12,0,0,0);
    for(let i=weeks-1;i>=0;i--){
        const d=new Date(now); d.setDate(d.getDate()-i*7);
        const start=getWeekStart(getDateString(d));
        let total=0;
        for(let j=0;j<7;j++){ const x=new Date(start+"T12:00:00"); x.setDate(x.getDate()+j); total+=getMinutesForDate(getDateString(x)); }
        out.push({start,minutes:total});
    }
    return out;
}

function drawChart(canvasId, values, labels, formatter) {
    const canvas=document.getElementById(canvasId); if(!canvas) return;
    const rect=canvas.getBoundingClientRect(); const ratio=window.devicePixelRatio||1;
    const width=Math.max(320, rect.width||canvas.clientWidth||600); const height=250;
    canvas.width=width*ratio; canvas.height=height*ratio; canvas.style.height=height+"px";
    const ctx=canvas.getContext("2d"); ctx.setTransform(ratio,0,0,ratio,0,0);
    ctx.clearRect(0,0,width,height);
    const pad={l:42,r:18,t:18,b:38}; const plotW=width-pad.l-pad.r; const plotH=height-pad.t-pad.b;
    const max=Math.max(...values,1); const steps=4;
    ctx.font="12px DM Sans, sans-serif"; ctx.textAlign="right"; ctx.textBaseline="middle"; ctx.fillStyle="#77766e";
    for(let i=0;i<=steps;i++){ const y=pad.t+plotH-(plotH*i/steps); ctx.beginPath(); ctx.moveTo(pad.l,y); ctx.lineTo(width-pad.r,y); ctx.strokeStyle="rgba(41,42,39,.10)"; ctx.stroke(); ctx.fillText(formatter(max*i/steps),pad.l-8,y); }
    const points=values.map((v,i)=>({x:values.length===1?pad.l+plotW/2:pad.l+(plotW*i/(values.length-1)),y:pad.t+plotH-(v/max*plotH)}));
    ctx.beginPath(); points.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y)); ctx.strokeStyle="#29483c"; ctx.lineWidth=2.5; ctx.stroke();
    ctx.fillStyle="#29483c"; points.forEach(p=>{ctx.beginPath();ctx.arc(p.x,p.y,4,0,Math.PI*2);ctx.fill();});
    ctx.fillStyle="#77766e"; ctx.textAlign="center"; ctx.textBaseline="top";
    labels.forEach((label,i)=>{ if(labels.length>12 && i%2!==0) return; ctx.fillText(label,points[i].x,height-pad.b+12); });
}

function drawWorkCharts() {
    const daily=aggregateDaily(14); drawChart("dailyWorkChart",daily.map(x=>x.minutes),daily.map(x=>formatDate(x.date)),v=>formatMinutes(v));
    const weekly=aggregateWeekly(8); drawChart("weeklyWorkChart",weekly.map(x=>x.minutes),weekly.map(x=>formatDate(x.start)),v=>formatHours(v));
}

window.addEventListener("resize",()=>{ if(document.getElementById("stats")?.classList.contains("active")) drawWorkCharts(); });

ensureV3Data();

renderAll();
/* =========================================================
   ASTRA OS V5 — NOTES SCOLAIRES
   Moyenne générale + moyenne par matière uniquement.
   Pas de moyenne par chapitre ni par type d'évaluation.
========================================================= */

function ensureV5Data() {
    if (!Array.isArray(data.grades)) data.grades = [];
    saveData();
}

function getSubjectGradeAverage(subject) {
    const grades = (data.grades || []).filter(g => g.subject === subject);
    if (!grades.length) return null;
    const weightedTotal = grades.reduce((sum, g) => sum + Number(g.grade || 0) * Number(g.coef || 1), 0);
    const coefTotal = grades.reduce((sum, g) => sum + Number(g.coef || 1), 0);
    return coefTotal ? weightedTotal / coefTotal : null;
}

function getGlobalGradeAverage() {
    const grades = data.grades || [];
    if (!grades.length) return null;
    const weightedTotal = grades.reduce((sum, g) => sum + Number(g.grade || 0) * Number(g.coef || 1), 0);
    const coefTotal = grades.reduce((sum, g) => sum + Number(g.coef || 1), 0);
    return coefTotal ? weightedTotal / coefTotal : null;
}

function formatGrade(value) {
    if (value === null || value === undefined || Number.isNaN(Number(value))) return "—";
    return Number(value).toLocaleString("fr-FR", { minimumFractionDigits: 1, maximumFractionDigits: 2 }) + "/20";
}

function formatGradeDate(date) {
    if (!date) return "—";
    const d = new Date(date + "T12:00:00");
    return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function addGrade() {
    if (!currentSubjectName) return;
    ensureV5Data();

    const chapter = document.getElementById("gradeChapter")?.value.trim() || "";
    const type = document.getElementById("gradeType")?.value.trim() || "";
    const grade = Number(document.getElementById("gradeValue")?.value);
    const coef = Number(document.getElementById("gradeCoef")?.value);
    const date = document.getElementById("gradeDate")?.value || getDateString(new Date());

    if (!Number.isFinite(grade) || grade < 0 || grade > 20) {
        alert("Entre une note comprise entre 0 et 20.");
        return;
    }

    if (!Number.isFinite(coef) || coef <= 0) {
        alert("Le coefficient doit être supérieur à 0.");
        return;
    }

    data.grades.push({
        id: Date.now(),
        subject: currentSubjectName,
        chapter,
        type,
        grade,
        coef,
        date
    });

    saveData();
    renderSubjectDetail(currentSubjectName);
}

function deleteGrade(id) {
    const grade = (data.grades || []).find(g => g.id === id);
    if (!grade) return;
    if (!confirm(`Supprimer la note de ${formatGrade(grade.grade)} ?`)) return;

    data.grades = data.grades.filter(g => g.id !== id);
    saveData();
    renderSubjectDetail(currentSubjectName);
}

function renderSubjectGrades(subject) {
    ensureV5Data();
    const grades = data.grades
        .filter(g => g.subject === subject)
        .sort((a, b) => String(b.date || "").localeCompare(String(a.date || "")));

    const average = getSubjectGradeAverage(subject);

    return `
        <div class="card subject-grades-card">
            <div class="card-header">
                <div>
                    <span class="card-label">RÉSULTATS</span>
                    <h2>Mes notes</h2>
                </div>
                <div class="grades-average">
                    <strong>${formatGrade(average)}</strong>
                    <span>${grades.length} évaluation${grades.length > 1 ? "s" : ""}</span>
                </div>
            </div>

            <div class="grade-form">
                <div class="grade-field">
                    <label for="gradeChapter">Chapitre</label>
                    <input id="gradeChapter" type="text" placeholder="Ex. Suites">
                </div>

                <div class="grade-field">
                    <label for="gradeType">Type d'évaluation</label>
                    <input id="gradeType" type="text" placeholder="Ex. DS, contrôle, oral...">
                </div>

                <div class="grade-field">
                    <label for="gradeValue">Note /20</label>
                    <input id="gradeValue" type="number" min="0" max="20" step="0.25" placeholder="15,5">
                </div>

                <div class="grade-field">
                    <label for="gradeCoef">Coef.</label>
                    <input id="gradeCoef" type="number" min="0.1" step="0.1" value="1">
                </div>

                <div class="grade-field">
                    <label for="gradeDate">Date</label>
                    <input id="gradeDate" type="date" value="${getDateString(new Date())}">
                </div>

                <button class="primary-button" onclick="addGrade()">
                    <i data-lucide="plus"></i>
                    Ajouter
                </button>
            </div>

            <div class="grades-table-wrap">
                ${grades.length ? `
                    <table class="grades-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Chapitre</th>
                                <th>Type</th>
                                <th>Note</th>
                                <th>Coef.</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            ${grades.map(g => `
                                <tr>
                                    <td>${formatGradeDate(g.date)}</td>
                                    <td>${escapeHTML(g.chapter || "—")}</td>
                                    <td>${escapeHTML(g.type || "—")}</td>
                                    <td class="grade-value">${formatGrade(g.grade)}</td>
                                    <td class="grade-coef">×${Number(g.coef || 1).toLocaleString("fr-FR")}</td>
                                    <td>
                                        <button class="grade-delete" onclick="deleteGrade(${g.id})" title="Supprimer">
                                            <i data-lucide="trash-2"></i>
                                        </button>
                                    </td>
                                </tr>
                            `).join("")}
                        </tbody>
                    </table>
                ` : `
                    <p class="empty">Aucune note enregistrée pour cette matière.</p>
                `}
            </div>
        </div>
    `;
}

function renderGlobalGrades() {
    ensureV5Data();
    const container = document.getElementById("globalGrades");
    if (!container) return;

    const average = getGlobalGradeAverage();
    const subjects = Object.keys(data.subjects || {});
    const withGrades = subjects.filter(subject => (data.grades || []).some(g => g.subject === subject));

    container.innerHTML = `
        <div class="card grades-global-card">
            <div class="card-header">
                <div>
                    <span class="card-label">SCOLARITÉ</span>
                    <h2>Moyennes</h2>
                </div>
                <div class="grades-average">
                    <strong>${formatGrade(average)}</strong>
                    <span>${(data.grades || []).length} note${(data.grades || []).length > 1 ? "s" : ""} au total</span>
                </div>
            </div>
            <div class="global-grades-grid">
                ${withGrades.length ? withGrades.map(subject => `
                    <div class="global-grade-item">
                        <small>${escapeHTML(subject)}</small>
                        <strong>${formatGrade(getSubjectGradeAverage(subject))}</strong>
                    </div>
                `).join("") : `<p class="empty">Ajoute tes premières notes depuis une matière.</p>`}
            </div>
        </div>
    `;
    refreshIcons();
}

/* Remplace le rendu des matières V3 pour intégrer les notes. */
function renderSubjects() {
    ensureV3Data();
    ensureV5Data();

    const grid = document.getElementById("subjectsGrid");
    const detail = document.getElementById("subjectDetail");
    if (!grid || !detail) return;

    if (currentSubjectName) {
        renderSubjectDetail(currentSubjectName);
        return;
    }

    grid.hidden = false;
    detail.hidden = true;

    const totals = {};
    Object.keys(data.subjects).forEach(subject => totals[subject] = 0);
    data.sessions.forEach(session => {
        totals[session.subject] = (totals[session.subject] || 0) + Number(session.duration || 0);
    });

    const max = Math.max(...Object.values(totals), 1);

    grid.innerHTML = Object.entries(totals).map(([name, minutes]) => {
        const chapters = data.chapters[name] || [];
        const mastered = chapters.length
            ? Math.round(chapters.reduce((sum, c) => sum + Number(c.mastery || 0), 0) / chapters.length)
            : 0;
        const percentage = Math.round(minutes / max * 100);
        const average = getSubjectGradeAverage(name);

        return `
            <button class="subject-card subject-card-button" onclick="openSubject('${escapeAttr(name)}')">
                <div class="subject-top">
                    <div class="subject-name">${escapeHTML(name)}</div>
                    <div class="subject-percent">${percentage}%</div>
                </div>
                <div class="progress"><div class="progress-bar" style="width:${percentage}%"></div></div>
                <div class="subject-time">${formatMinutes(minutes)} travaillées</div>
                <div class="subject-description">${escapeHTML(subjectDescriptions[name] || "Matière et notes personnelles.")}</div>
                <div class="subject-chapters-preview">
                    ${chapters.length} chapitre${chapters.length > 1 ? "s" : ""} · ${mastered}% de maîtrise moyenne
                    ${average !== null ? ` · ${formatGrade(average)}` : ""}
                </div>
            </button>`;
    }).join("");

    if (!document.getElementById("globalGrades")) {
        grid.insertAdjacentHTML("afterend", `<div id="globalGrades"></div>`);
    }
    renderGlobalGrades();
    refreshIcons();
}

/* Étend le détail V3 avec la gestion des notes. */
const renderSubjectDetailV3 = renderSubjectDetail;
renderSubjectDetail = function(name) {
    renderSubjectDetailV3(name);
    const detail = document.getElementById("subjectDetail");
    if (!detail) return;
    detail.insertAdjacentHTML("beforeend", renderSubjectGrades(name));
    refreshIcons();
};

ensureV5Data();
