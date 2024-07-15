document.addEventListener('DOMContentLoaded', () => {
    if (Notification.permission !== 'granted') {
        Notification.requestPermission().then(permission => {
            console.log(`Notification permission: ${permission}`);
        });
    }
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

    setNotification(taskText, taskTime);
    console.log(`Task added: ${taskText} at ${taskTime}`);
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
}

function setNotification(taskText, taskTime) {
    const taskDate = new Date(taskTime);
    const now = new Date();
    const timeUntilTask = taskDate - now;

    if (timeUntilTask > 0) {
        console.log(`Notification for "${taskText}" set for ${taskTime}`);
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
        const audio = document.getElementById('notificationSound');
        audio.play();
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
    setTimeout(() => {
        alertBox.classList.remove('show');
    }, 7000); // Alert will disappear after 7 seconds
}
