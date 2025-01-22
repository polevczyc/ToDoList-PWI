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
  e.preventDefault(); // Zapobiegaj przeładowaniu strony
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  try {
    const res = await fetch('http://localhost:3000/api/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (res.ok) {
      token = data.token;
      userEmail = data.email; // Zapisz email użytkownika
      document.getElementById('login-email').value = ''; // Wyczyść pola
      document.getElementById('login-password').value = ''; // Wyczyść pola
      updateUI();
      renderTasks();
    } else {
      alert('Login failed');
    }
  } catch (error) {
    console.error('Login error:', error);
  }
};

const register = async (e) => {
  e.preventDefault(); // Zapobiegaj przeładowaniu strony
  const email = document.getElementById('register-email').value;
  const password = document.getElementById('register-password').value;

  try {
    const res = await fetch('http://localhost:3000/api/users/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (res.ok) {
      alert('Registration successful! You can now log in.');
      document.getElementById('register-email').value = ''; // Wyczyść pola
      document.getElementById('register-password').value = ''; // Wyczyść pola
      showLoginForm();
    } else {
      const error = await res.json();
      alert('Error: ' + error.error);
    }
  } catch (error) {
    console.error('Registration error:', error);
  }
};



// Funkcja renderowania zadań
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
        <li class="${task.completed ? 'completed' : ''}">
          <span>${task.content}</span>
          <button onclick="completeTask('${task._id}')">Complete</button>
          <button onclick="deleteTask('${task._id}')">Delete</button>
        </li>
      `
      )
      .join('');
  } catch (error) {
    console.error('Error fetching tasks:', error);
  }
};

// Funkcja do ukończenia zadania
const completeTask = async (taskId) => {
  try {
    await fetch(`http://localhost:3000/api/tasks/${taskId}`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
    });
    renderTasks();
  } catch (error) {
    console.error('Error completing task:', error);
  }
};

// Funkcja do usuwania zadania
const deleteTask = async (taskId) => {
  try {
    await fetch(`http://localhost:3000/api/tasks/${taskId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    renderTasks();
  } catch (error) {
    console.error('Error deleting task:', error);
  }
};

// Funkcja do aktualizacji interfejsu
const updateUI = () => {
  const authButtons = document.getElementById('auth-buttons');
  const taskSection = document.getElementById('task-section');
  const logoutBtn = document.getElementById('logout-btn');
  const userInfo = document.getElementById('user-info');
  const userEmailSpan = document.getElementById('user-email');
  const loginForm = document.getElementById('login-form-container');
  const registerForm = document.getElementById('register-form-container');

  if (token) {
    authButtons.style.display = 'none'; // Ukryj przyciski logowania/rejestracji
    taskSection.style.display = 'block'; // Pokaż sekcję zadań
    logoutBtn.style.display = 'block'; // Pokaż przycisk wylogowania
    userInfo.style.display = 'block'; // Pokaż informacje o użytkowniku
    userEmailSpan.textContent = `Logged in as: ${userEmail}`; // Wyświetl email
    loginForm.style.display = 'none'; // Ukryj formularz logowania
    registerForm.style.display = 'none'; // Ukryj formularz rejestracji
  } else {
    authButtons.style.display = 'flex'; // Pokaż przyciski logowania/rejestracji
    taskSection.style.display = 'none'; // Ukryj sekcję zadań
    logoutBtn.style.display = 'none'; // Ukryj przycisk wylogowania
    userInfo.style.display = 'none'; // Ukryj informacje o użytkowniku
    userEmailSpan.textContent = ''; // Wyczyść email
    loginForm.style.display = 'none'; // Ukryj formularz logowania
    registerForm.style.display = 'none'; // Ukryj formularz rejestracji
  }
};


// Funkcja wylogowania
const logout = () => {
  token = null; // Resetuj token
  userEmail = null; // Resetuj email
  updateUI(); // Zresetuj interfejs
};

document.getElementById('task-form').addEventListener('submit', async (e) => {
  e.preventDefault(); // Zapobiegaj przeładowaniu strony
  const content = document.getElementById('task-input').value;

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
      document.getElementById('task-input').value = ''; // Wyczyść pole tekstowe
      renderTasks(); // Odśwież listę zadań
    } else if (response.status === 401) {
      alert('Session expired. Please log in again.');
      logout(); // Wyloguj użytkownika
    } else {
      alert('Error adding task.');
    }
  } catch (error) {
    console.error('Error adding task:', error);
  }
});


document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('login-btn').addEventListener('click', showLoginForm);
  document.getElementById('register-btn').addEventListener('click', showRegisterForm);
  document.getElementById('logout-btn').addEventListener('click', logout);

  document.getElementById('login-form').addEventListener('submit', login);
  document.getElementById('register-form').addEventListener('submit', register);

  updateUI(); // Inicjalizacja interfejsu
});