let tasks = []; // Array to store tasks

// Executes when the window is loaded
window.onload = () => {
  fetchTasks(); // Fetches tasks from the server upon window load
};

// Renders tasks to the UI
function renderTasks() {
  // Retrieves the task list element
  const taskList = document.getElementById('taskList');
  taskList.innerHTML = ''; // Clears the existing task list

  // Loops through tasks to create HTML elements for each task
  tasks.forEach(task => {
    // Creates elements for displaying task details
    const taskItem = document.createElement('li'); // Task item container
    taskItem.classList.add('task-item'); // Adds a class for styling

    // Checkbox for marking task completion
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.completed; // Sets checkbox state
    checkbox.addEventListener('change', () => markTaskCompleted(task.id, checkbox.checked)); // Handles checkbox change

    // Elements for task details (title, description, delete icon)
    const taskDetails = document.createElement('div');
    taskDetails.classList.add('task-details'); // Adds a class for styling

    const taskTitle = document.createElement('h3');
    taskTitle.textContent = task.name; // Displays task name

    const taskDesc = document.createElement('p');
    taskDesc.textContent = task.description; // Displays task description

    const deleteIcon = document.createElement('span');
    deleteIcon.classList.add('delete-icon');
    deleteIcon.innerHTML = '&#x1F5D1;'; // Unicode for delete icon
    deleteIcon.addEventListener('click', () => deleteTask(task.id)); // Handles task deletion on click

    // Appending elements to display task details
    taskDetails.appendChild(taskTitle);
    if (task.description) {
      taskDetails.appendChild(taskDesc); // Adds description if available
    }

    // Appending elements to the task item container
    taskItem.appendChild(checkbox);
    taskItem.appendChild(taskDetails);
    taskItem.appendChild(deleteIcon);

    // Appending the task item to the task list
    taskList.appendChild(taskItem);
  });
}

// Fetches tasks from the server
function fetchTasks() {
  fetch('http://localhost:3000/tasks')
    .then(response => response.json()) // Parses response as JSON
    .then(data => {
      tasks = data; // Updates the tasks array with fetched data
      renderTasks(); // Renders tasks to the UI
    })
    .catch(error => console.error('Error fetching tasks:', error)); // Handles errors
}

// Adds a new task
function addTask() {
  // Retrieves task input values
  const taskNameInput = document.getElementById('taskNameInput');
  const taskDescInput = document.getElementById('taskDescInput');
  const taskName = taskNameInput.value.trim();
  const taskDesc = taskDescInput.value.trim();

  // Validates task name input
  if (taskName !== '') {
    // Constructs a new task object
    const newTask = {
      name: taskName,
      description: taskDesc,
      completed: false,
    };

    // Sends a POST request to add the new task
    fetch('http://localhost:3000/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newTask), // Converts task object to JSON
    })
      .then(response => response.json()) // Parses response as JSON
      .then(data => {
        tasks.push(data); // Adds the new task to the tasks array
        taskNameInput.value = ''; // Clears task name input field
        taskDescInput.value = ''; // Clears task description input field
        renderTasks(); // Renders updated tasks to the UI
      })
      .catch(error => console.error('Error adding task:', error)); // Handles errors
  } else {
    alert('Please enter a task name.'); // Shows an alert for empty task name
  }
}

// Marks a task as completed or incomplete
function markTaskCompleted(id, completed) {
  const task = tasks.find(task => task.id === id); // Finds the task by ID
  if (task) {
    // Sends a PUT request to update task completion status
    fetch(`http://localhost:3000/tasks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...task, completed }), // Updates task completion status
    })
      .then(response => response.json()) // Parses response as JSON
      .then(data => {
        const taskIndex = tasks.findIndex(task => task.id === id);
        tasks[taskIndex] = data; // Updates task status in the tasks array
        renderTasks(); // Renders updated tasks to the UI
      })
      .catch(error => console.error('Error updating task:', error)); // Handles errors
  }
}

// Deletes a task
function deleteTask(id) {
  // Sends a DELETE request to remove the task
  fetch(`http://localhost:3000/tasks/${id}`, {
    method: 'DELETE',
  })
    .then(response => {
      if (response.ok) {
        tasks = tasks.filter(task => task.id !== id); // Filters out the deleted task
        renderTasks(); // Renders updated tasks to the UI
      } else {
        console.error('Error deleting task:', response.status); // Handles errors
      }
    })
    .catch(error => console.error('Error deleting task:', error)); // Handles errors
}
