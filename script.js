document.addEventListener('DOMContentLoaded', () => {
    if (Notification.permission !== 'granted') {
        Notification.requestPermission().then(permission => {
            console.log(`Notification permission: ${permission}`);
        });
    }
    loadTasks();
});

function addTask() {
    const taskInput = document.getElementById('taskInput');
    const taskDateTime = document.getElementById('taskDateTime');
    const taskText = taskInput.value.trim();
    const taskTime = taskDateTime.value;

    if (taskText === '' || taskTime === '') return;

    const taskList = document.getElementById('taskList');

    const li = document.createElement('li');
    li.innerHTML = `<span>${taskText} - ${new Date(taskTime).toLocaleString()}</span>
                    <input type="checkbox" onchange="toggleTask(this)">
                    <input type="hidden" value="${taskTime}">`;
    
    taskList.appendChild(li);
    taskInput.value = '';
    taskDateTime.value = '';

    console.log(`Task added: ${taskText} at ${taskTime}`);
    setNotification(taskText, taskTime);
    saveTasks();
}

function toggleTask(checkbox) {
    const li = checkbox.parentElement;
    if (checkbox.checked) {
        li.classList.add('finished');
        document.getElementById('finishedTaskList').appendChild(li);
    } else {
        li.classList.remove('finished');
        document.getElementById('taskList').appendChild(li);
    }
    saveTasks();
}

function setNotification(taskText, taskTime) {
    const taskDate = new Date(taskTime);
    const now = new Date();
    const timeUntilTask = taskDate - now;

    console.log(`Setting notification for "${taskText}" in ${timeUntilTask} milliseconds.`);

    if (timeUntilTask > 0) {
        setTimeout(() => {
            showNotification(taskText);
        }, timeUntilTask);
    } else {
        console.log(`Task time for "${taskText}" is in the past.`);
    }
}

function showNotification(taskText) {
    if (Notification.permission === 'granted') {
        const notification = new Notification('Chikku Todo', {
            body: `Time to complete your task: ${taskText}`,
            icon: 'icon.png' // Ensure this path is correct or change it to a valid path
        });
        notification.onclick = () => {
            window.focus();
        };
        const audio = document.getElementById('notificationSound');
        audio.play().then(() => {
            console.log('Notification sound played.');
        }).catch(error => {
            console.error('Error playing sound:', error);
        });
        displayAppAlert(`Time to complete your task: ${taskText}`);
        console.log(`Notification shown for task: ${taskText}`);
    } else {
        console.log('Notification permission not granted.');
    }
}

function displayAppAlert(message) {
    const alertBox = document.getElementById('appAlert');
    alertBox.textContent = message;
    alertBox.classList.add('show');
    console.log('Alert displayed:', message);
    setTimeout(() => {
        alertBox.classList.remove('show');
        console.log('Alert hidden.');
    }, 7000); // Alert will disappear after 7 seconds
}

function saveTasks() {
    const tasks = [];
    document.querySelectorAll('#taskList li').forEach(li => {
        const span = li.querySelector('span').innerText;
        const taskTime = li.querySelector('input[type="hidden"]').value;
        tasks.push({ text: span, time: taskTime, finished: li.classList.contains('finished') });
    });
    document.querySelectorAll('#finishedTaskList li').forEach(li => {
        const span = li.querySelector('span').innerText;
        const taskTime = li.querySelector('input[type="hidden"]').value;
        tasks.push({ text: span, time: taskTime, finished: true });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const taskList = document.getElementById('taskList');
    const finishedTaskList = document.getElementById('finishedTaskList');
    tasks.forEach(task => {
        const li = document.createElement('li');
        li.innerHTML = `<span>${task.text}</span>
                        <input type="checkbox" onchange="toggleTask(this)" ${task.finished ? 'checked' : ''}>
                        <input type="hidden" value="${task.time}">`;
        if (task.finished) {
            li.classList.add('finished');
            finishedTaskList.appendChild(li);
        } else {
            taskList.appendChild(li);
            setNotification(task.text, task.time);
        }
    });
}
