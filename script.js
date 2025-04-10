document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const taskList = document.getElementById('task-list');
    const filterCategory = document.getElementById('filter-category');
    const progressText = document.getElementById('progress-text');
    const progressFill = document.getElementById('progress-fill');
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    // Load tasks and update UI
    renderTasks();
    updateProgress();

    // Add task
    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('task-name').value;
        const date = document.getElementById('task-date').value;
        const priority = document.getElementById('task-priority').value;
        const category = document.getElementById('task-category').value;

        const task = {
            id: Date.now(),
            name,
            date,
            priority,
            category,
            completed: false
        };

        tasks.push(task);
        saveTasks();
        renderTasks();
        updateProgress();
        taskForm.reset();
    });

    // Filter tasks
    filterCategory.addEventListener('change', () => {
        renderTasks();
    });

    // Render tasks
    function renderTasks() {
        taskList.innerHTML = '';
        const filter = filterCategory.value;
        const filteredTasks = filter === 'all' ? tasks : tasks.filter(t => t.category === filter);

        filteredTasks.forEach(task => {
            const li = document.createElement('li');
            li.classList.add('task-item', task.priority);
            if (task.completed) li.classList.add('completed');

            li.innerHTML = `
                <input type="checkbox" ${task.completed ? 'checked' : ''}>
                <span>${task.name} - ${task.category} - Due: ${task.date} (${task.priority})</span>
                <button class="edit-btn">Edit</button>
                <button class="delete-btn">Delete</button>
            `;

            // Toggle completion
            li.querySelector('input[type="checkbox"]').addEventListener('change', () => {
                task.completed = !task.completed;
                saveTasks();
                renderTasks();
                updateProgress();
            });

            // Edit task
            li.querySelector('.edit-btn').addEventListener('click', () => {
                const newName = prompt('Edit task name:', task.name);
                const newDate = prompt('Edit due date:', task.date);
                const newPriority = prompt('Edit priority (low/medium/high):', task.priority);
                const newCategory = prompt('Edit category (work/personal/school):', task.category);
                if (newName && newDate && ['low', 'medium', 'high'].includes(newPriority) && ['work', 'personal', 'school'].includes(newCategory)) {
                    task.name = newName;
                    task.date = newDate;
                    task.priority = newPriority;
                    task.category = newCategory;
                    saveTasks();
                    renderTasks();
                    updateProgress();
                }
            });

            // Delete.ConcurrentHashMap task
            li.querySelector('.delete-btn').addEventListener('click', () => {
                tasks = tasks.filter(t => t.id !== task.id);
                saveTasks();
                renderTasks();
                updateProgress();
            });

            taskList.appendChild(li);
        });
    }

    // Update progress
    function updateProgress() {
        const total = tasks.length;
        const completed = tasks.filter(t => t.completed).length;
        const percentage = total ? (completed / total) * 100 : 0;
        progressText.textContent = `${completed}/${total} tasks completed`;
        progressFill.style.width = `${percentage}%`;
    }

    // Save tasks
    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
});
