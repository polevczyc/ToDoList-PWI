let token = null;
let userEmail = null;

const showLoginForm = () => {
  document.getElementById('login-form-container').style.display = 'block';
  document.getElementById('register-form-container').style.display = 'none';
};

const showRegisterForm = () => {
  document.getElementById('login-form-container').style.display = 'none';
  document.getElementById('register-form-container').style.display = 'block';
};

const login = async (e) => {
  e.preventDefault();
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  if (!email || !password) {
    alert('Please enter both email and password.');
    return;
  }

  try {
    const res = await fetch('http://localhost:3000/api/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (res.ok) {
      token = data.token;
      userEmail = data.email;
      document.getElementById('login-email').value = '';
      document.getElementById('login-password').value = '';
      updateUI();
      renderTasks();
    } else {
      alert(`Login failed: ${data.error || 'Unknown error'}`);
    }
  } catch (error) {
    console.error('Login error:', error);
    alert('An error occurred during login. Please try again later.');
  }
};

const register = async (e) => {
  e.preventDefault();
  const email = document.getElementById('register-email').value;
  const password = document.getElementById('register-password').value;

  if (!email || !password) {
    alert('Please fill out all fields.');
    return;
  }

  try {
    const res = await fetch('http://localhost:3000/api/users/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      alert('Registration successful! You can now log in.');
      document.getElementById('register-email').value = '';
      document.getElementById('register-password').value = '';
      showLoginForm();
    } else {
      const error = await res.json();
      alert(`Error: ${error.error || 'Unknown error'}`);
    }
  } catch (error) {
    console.error('Registration error:', error);
    alert('An error occurred during registration. Please try again later.');
  }
};

const renderTasks = async () => {
  if (!token) return;

  try {
    const response = await fetch('http://localhost:3000/api/tasks', {
      headers: { Authorization: `Bearer ${token}` },
    });

    const tasks = await response.json();
    const list = document.getElementById('task-list');

    list.innerHTML = tasks
      .map(
        (task) => `
      <li class="task-item ${task.completed ? 'completed' : ''}">
          <span>${task.content}</span>
          <div class="task-buttons">
            <button onclick="completeTask('${task._id}')">${task.completed ? 'Undo' : 'Complete'}</button>
            <button onclick="confirmDeleteTask('${task._id}')">Delete</button>
          </div>
        </li>
      `
      )
      .join('');
  } catch (error) {
    console.error('Error fetching tasks:', error);
    alert('Failed to load tasks. Please try again later.');
  }
};

const completeTask = async (taskId) => {
  try {
    await fetch(`http://localhost:3000/api/tasks/${taskId}`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
    });
    renderTasks();
  } catch (error) {
    console.error('Error completing task:', error);
    alert('Failed to update task. Please try again.');
  }
};

const confirmDeleteTask = (taskId) => {
  if (confirm('Are you sure you want to delete this task?')) {
    deleteTask(taskId);
  }
};

const deleteTask = async (taskId) => {
  try {
    await fetch(`http://localhost:3000/api/tasks/${taskId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    renderTasks();
  } catch (error) {
    console.error('Error deleting task:', error);
    alert('Failed to delete task. Please try again.');
  }
};

const updateUI = () => {
  const authButtons = document.getElementById('auth-buttons');
  const taskSection = document.getElementById('task-section');
  const logoutBtn = document.getElementById('logout-btn');
  const userInfo = document.getElementById('user-info');
  const userEmailSpan = document.getElementById('user-email');
  const loginForm = document.getElementById('login-form-container');
  const registerForm = document.getElementById('register-form-container');

  if (token) {
    authButtons.style.display = 'none';
    taskSection.style.display = 'block';
    logoutBtn.style.display = 'block';
    userInfo.style.display = 'block';
    userEmailSpan.textContent = `Logged in as: ${userEmail}`;
    loginForm.style.display = 'none';
    registerForm.style.display = 'none';
  } else {
    authButtons.style.display = 'flex';
    taskSection.style.display = 'none';
    logoutBtn.style.display = 'none';
    userInfo.style.display = 'none';
    userEmailSpan.textContent = '';
    loginForm.style.display = 'none';
    registerForm.style.display = 'none';
  }
};

const logout = () => {
  if (confirm('Are you sure you want to log out?')) {
    token = null;
    userEmail = null;
    updateUI();
  }
};

document.getElementById('task-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const content = document.getElementById('task-input').value.trim();

  if (!content) {
    alert('Task content cannot be empty.');
    return;
  }

  try {
    const response = await fetch('http://localhost:3000/api/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ content }),
    });

    if (response.ok) {
      document.getElementById('task-input').value = '';
      renderTasks();
    } else if (response.status === 401) {
      alert('Session expired. Please log in again.');
      logout();
    } else {
      alert('Error adding task.');
    }
  } catch (error) {
    console.error('Error adding task:', error);
    alert('Failed to add task. Please try again later.');
  }
});

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('login-btn').addEventListener('click', showLoginForm);
  document.getElementById('register-btn').addEventListener('click', showRegisterForm);
  document.getElementById('logout-btn').addEventListener('click', logout);

  document.getElementById('login-form').addEventListener('submit', login);
  document.getElementById('register-form').addEventListener('submit', register);

  updateUI();
});
