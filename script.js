// ==================== THEME MANAGEMENT ====================
const body = document.body;

function initTheme() {
  const savedTheme = localStorage.getItem("theme") || "light";
  applyTheme(savedTheme);
}

// ==================== AUTH MANAGEMENT ====================
function getUsers() {
  try {
    return JSON.parse(localStorage.getItem("users")) || [];
  } catch (error) {
    console.error("Error retrieving users:", error);
    return [];
  }
}

function saveUsers(users) {
  try {
    localStorage.setItem("users", JSON.stringify(users));
  } catch (error) {
    console.error("Error saving users:", error);
  }
}

function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem("currentUser")) || null;
  } catch (error) {
    console.error("Error retrieving current user:", error);
    return null;
  }
}

function setCurrentUser(user) {
  try {
    if (user) {
      localStorage.setItem("currentUser", JSON.stringify(user));
    } else {
      localStorage.removeItem("currentUser");
    }
  } catch (error) {
    console.error("Error setting current user:", error);
  }
}

function findUserByEmail(email) {
  const users = getUsers();
  return users.find(u => u.email.toLowerCase() === email.toLowerCase());
}

function handleLogin(e) {
  e.preventDefault();
  
  const emailInput = document.getElementById("login-email");
  const passwordInput = document.getElementById("login-password");
  const errorDiv = document.getElementById("login-error");
  
  if (!emailInput || !passwordInput) return;
  
  const email = emailInput.value.trim();
  const password = passwordInput.value;
  
  const user = findUserByEmail(email);
  
  if (!user) {
    errorDiv.textContent = "No account found with this email";
    return;
  }
  
  if (user.password !== password) {
    errorDiv.textContent = "Incorrect password";
    return;
  }
  
  errorDiv.textContent = "";
  setCurrentUser(user);
  closeAuthModal();
  updateAuthUI();
  e.target.reset();
}

function handleSignup(e) {
  e.preventDefault();
  
  const nameInput = document.getElementById("signup-name");
  const emailInput = document.getElementById("signup-email");
  const passwordInput = document.getElementById("signup-password");
  const confirmPasswordInput = document.getElementById("signup-confirm-password");
  const errorDiv = document.getElementById("signup-error");
  
  if (!nameInput || !emailInput || !passwordInput || !confirmPasswordInput) return;
  
  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const password = passwordInput.value;
  const confirmPassword = confirmPasswordInput.value;
  
  if (!name || !email || !password) {
    errorDiv.textContent = "All fields are required";
    return;
  }
  
  if (password.length < 6) {
    errorDiv.textContent = "Password must be at least 6 characters";
    return;
  }
  
  if (password !== confirmPassword) {
    errorDiv.textContent = "Passwords do not match";
    return;
  }
  
  if (findUserByEmail(email)) {
    errorDiv.textContent = "An account with this email already exists";
    return;
  }
  
  const newUser = { name, email, password, createdAt: new Date().toISOString() };
  const users = getUsers();
  users.push(newUser);
  saveUsers(users);
  
  setCurrentUser(newUser);
  closeAuthModal();
  updateAuthUI();
  e.target.reset();
}

function handleLogout() {
  setCurrentUser(null);
  updateAuthUI();
}

function switchAuthTab(tab) {
  const loginForm = document.getElementById("login-form");
  const signupForm = document.getElementById("signup-form");
  const modalTitle = document.getElementById("auth-modal-title");
  const switchText = document.getElementById("auth-switch-text-span");
  const switchBtn = document.getElementById("auth-switch-btn");
  const tabs = document.querySelectorAll(".auth-tab");
  
  tabs.forEach(t => t.classList.remove("active"));
  tabs.forEach(t => {
    if (t.dataset.tab === tab) t.classList.add("active");
  });
  
  if (tab === "login") {
    loginForm.classList.remove("hidden");
    signupForm.classList.add("hidden");
    modalTitle.textContent = "Login";
    switchText.textContent = "Don't have an account?";
    switchBtn.textContent = "Sign Up";
  } else {
    loginForm.classList.add("hidden");
    signupForm.classList.remove("hidden");
    modalTitle.textContent = "Sign Up";
    switchText.textContent = "Already have an account?";
    switchBtn.textContent = "Login";
  }
}

function initAuth() {
  const authBtn = document.getElementById("auth-btn");
  const authModal = document.getElementById("auth-modal");
  const closeAuthModalBtn = document.getElementById("close-auth-modal");
  const loginForm = document.getElementById("login-form");
  const signupForm = document.getElementById("signup-form");
  const authSwitchBtn = document.getElementById("auth-switch-btn");
  const logoutBtn = document.getElementById("logout-btn");
  const authTabs = document.querySelectorAll(".auth-tab");
  
  if (authBtn && authModal) {
    authBtn.addEventListener("click", () => {
      authModal.classList.add("show");
    });
  }
  
  if (closeAuthModalBtn) {
    closeAuthModalBtn.addEventListener("click", closeAuthModal);
  }
  
  window.addEventListener("click", (e) => {
    if (e.target === authModal) {
      closeAuthModal();
    }
  });
  
  if (loginForm) {
    loginForm.addEventListener("submit", handleLogin);
  }
  
  if (signupForm) {
    signupForm.addEventListener("submit", handleSignup);
  }
  
  if (authSwitchBtn) {
    authSwitchBtn.addEventListener("click", () => {
      const currentTab = document.querySelector(".auth-tab.active").dataset.tab;
      switchAuthTab(currentTab === "login" ? "signup" : "login");
    });
  }
  
  authTabs.forEach(tab => {
    tab.addEventListener("click", () => {
      switchAuthTab(tab.dataset.tab);
    });
  });
  
  if (logoutBtn) {
    logoutBtn.addEventListener("click", handleLogout);
  }
  
  updateAuthUI();
}

function closeAuthModal() {
  const authModal = document.getElementById("auth-modal");
  if (authModal) {
    authModal.classList.remove("show");
  }
  const loginForm = document.getElementById("login-form");
  const signupForm = document.getElementById("signup-form");
  const loginError = document.getElementById("login-error");
  const signupError = document.getElementById("signup-error");
  if (loginForm) loginForm.reset();
  if (signupForm) signupForm.reset();
  if (loginError) loginError.textContent = "";
  if (signupError) signupError.textContent = "";
}

function updateAuthUI() {
  const authBtn = document.getElementById("auth-btn");
  const userMenu = document.getElementById("user-menu");
  const userName = document.getElementById("user-name");
  
  const currentUser = getCurrentUser();
  
  if (currentUser) {
    if (authBtn) authBtn.classList.add("hidden");
    if (userMenu) userMenu.classList.remove("hidden");
    if (userName) userName.textContent = currentUser.name;
  } else {
    if (authBtn) authBtn.classList.remove("hidden");
    if (userMenu) userMenu.classList.add("hidden");
  }
}

function applyTheme(theme) {
  try {
    if (theme === "dark") {
      body.classList.add("dark");
      updateThemeIcon("☀️");
    } else {
      body.classList.remove("dark");
      updateThemeIcon("🌙");
    }
    localStorage.setItem("theme", theme);
  } catch (error) {
    console.error("Error saving theme:", error);
  }
}

function updateThemeIcon(icon) {
  const toggleIcon = document.querySelector(".toggle-icon");
  if (toggleIcon) {
    toggleIcon.textContent = icon;
  }
}

function toggleTheme() {
  const isDark = body.classList.contains("dark");
  applyTheme(isDark ? "light" : "dark");
}

// ==================== STORAGE MANAGEMENT ====================
function getStoredGoals() {
  try {
    return JSON.parse(localStorage.getItem("visionGoals")) || [];
  } catch (error) {
    console.error("Error retrieving goals:", error);
    return [];
  }
}

function saveGoals(goals) {
  try {
    localStorage.setItem("visionGoals", JSON.stringify(goals));
  } catch (error) {
    console.error("Error saving goals:", error);
  }
}

// ==================== GOAL MANAGEMENT ====================
function createGoalCard(goal, appendToEnd = false) {
  if (!goal.title || !goal.category) {
    console.error("Invalid goal data:", goal);
    return;
  }

  const card = document.createElement("article");
  card.className = "card";
  card.setAttribute("data-category", goal.category);

  const imgSrc = isValidImageUrl(goal.image) ? goal.image : "https://via.placeholder.com/400x250?text=No+Image";
  
  card.innerHTML = `
    <img 
      src="${imgSrc}" 
      alt="${goal.title}"
      class="card-image"
      onerror="this.src='https://via.placeholder.com/400x250?text=Image+Error'"
    >
    <div class="card-content">
      <span class="card-tag">${escapeHtml(goal.category)}</span>
      <h3>${escapeHtml(goal.title)}</h3>
      <p>${escapeHtml(goal.description)}</p>
    </div>
  `;

  const boardContainer = document.getElementById("board-container");
  if (boardContainer) {
    if (appendToEnd) {
      boardContainer.appendChild(card);
    } else {
      boardContainer.prepend(card);
    }
  }
}

function loadGoals() {
  const boardContainer = document.getElementById("board-container");
  if (!boardContainer) return;

  const goals = getStoredGoals();
  goals.forEach((goal) => createGoalCard(goal, true));
}

// ==================== FILTERING ====================
function applyFilter(filter) {
  const cards = document.querySelectorAll(".card");
  cards.forEach((card) => {
    const category = card.getAttribute("data-category");
    const shouldShow = filter === "all" || category === filter;
    card.style.display = shouldShow ? "block" : "none";
  });
}

// ==================== MODAL MANAGEMENT ====================
function initModal() {
  const openModalBtn = document.getElementById("open-modal");
  const closeModalBtn = document.getElementById("close-modal");
  const modal = document.getElementById("goal-modal");
  const goalForm = document.getElementById("goal-form");

  if (!modal) return;

  if (openModalBtn) {
    openModalBtn.addEventListener("click", () => {
      modal.classList.add("show");
      modal.focus();
    });
  }

  if (closeModalBtn) {
    closeModalBtn.addEventListener("click", () => {
      modal.classList.remove("show");
    });
  }

  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.remove("show");
    }
  });

  if (goalForm) {
    goalForm.addEventListener("submit", handleGoalSubmit);
  }
}

function handleGoalSubmit(e) {
  e.preventDefault();

  const titleInput = document.getElementById("goal-title");
  const descriptionInput = document.getElementById("goal-description");
  const categoryInput = document.getElementById("goal-category");
  const imageInput = document.getElementById("goal-image");

  if (!titleInput || !descriptionInput || !categoryInput || !imageInput) return;

  const title = titleInput.value.trim();
  const description = descriptionInput.value.trim();
  const category = categoryInput.value;
  const image = imageInput.value.trim();

  // Validation
  if (!title) {
    showValidationError("Goal title is required");
    return;
  }
  if (!description) {
    showValidationError("Description is required");
    return;
  }
  if (!category) {
    showValidationError("Category is required");
    return;
  }
  if (!image || !isValidImageUrl(image)) {
    showValidationError("Valid image URL is required");
    return;
  }

  const newGoal = { title, description, category, image };
  createGoalCard(newGoal);

  const goals = getStoredGoals();
  goals.unshift(newGoal);
  saveGoals(goals);

  e.target.reset();
  const modal = document.getElementById("goal-modal");
  if (modal) {
    modal.classList.remove("show");
  }

  const activeFilter = document.querySelector(".filter-btn.active")?.dataset.filter || "all";
  applyFilter(activeFilter);
}

function showValidationError(message) {
  alert(message); // Replace with toast notification if preferred
}

// ==================== FILTER BUTTONS ====================
function initFilters() {
  const filterButtons = document.querySelectorAll(".filter-btn");
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      filterButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");
      applyFilter(button.dataset.filter);
    });
  });
}

// ==================== UTILITIES ====================
function isValidImageUrl(url) {
  try {
    new URL(url);
    return /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url) || url.includes('picsum') || url.includes('placeholder') || url.includes('via.placeholder');
  } catch {
    return false;
  }
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// ==================== INITIALIZATION ====================
document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initModal();
  initFilters();
  initAuth();
  loadGoals();
  attachThemeToggle();
});

function attachThemeToggle() {
  const toggleBtn = document.getElementById("theme-toggle");
  if (toggleBtn) {
    toggleBtn.addEventListener("click", toggleTheme);
  }
}