document.addEventListener('DOMContentLoaded', () => {
  const taskInput = document.getElementById('taskInput');
  const prioritySelect = document.getElementById('prioritySelect');
  const addTaskButton = document.getElementById('addTask');
  const taskList = document.getElementById('taskList');
  const filterSelect = document.getElementById('filterSelect');

  let tasks = [];

  loadTasks();

  addTaskButton.addEventListener('click', addTask);
  filterSelect.addEventListener('change', renderTasks);

  function loadTasks() {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      tasks = JSON.parse(savedTasks);
      renderTasks();
    }
  }

  function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText) {
      const task = {
        id: Date.now(),
        text: taskText,
        priority: prioritySelect.value,
        completed: false
      };
      tasks.push(task);
      saveTasks();
      renderTasks();
      taskInput.value = '';
    }
  }

  function filterTasks() {
    const filter = filterSelect.value;
    switch (filter) {
      case 'active':
        return tasks.filter(t => !t.completed);
      case 'completed':
        return tasks.filter(t => t.completed);
      default:
        return tasks;
    }
  }

  function toggleComplete(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
      task.completed = !task.completed;
      saveTasks();
      renderTasks();
    }
  }

  function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    saveTasks();
    renderTasks();
  }

  function renderTasks() {
    taskList.innerHTML = '';
    const filteredTasks = filterTasks();
    filteredTasks.forEach(task => {
      const li = document.createElement('li');
      li.className = task.priority + (task.completed ? ' completed' : '');
      li.innerHTML = `
        <span>${task.text}</span>
        <button onclick="toggleComplete(${task.id})" class="${task.completed ? 'undo' : 'complete'}">${task.completed ? '↺' : '✓'}</button>
        <button onclick="deleteTask(${task.id})" class="delete">✕</button>
      `;
      taskList.appendChild(li);
    });
  }

  // Adiciona as funções ao escopo global para que possam ser chamadas inline
  window.toggleComplete = toggleComplete;
  window.deleteTask = deleteTask;
});