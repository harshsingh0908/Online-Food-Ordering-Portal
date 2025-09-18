const container = document.getElementById("container");
const registerBtn = document.getElementById("register");
const loginBtn = document.getElementById("login");
const signUpForm = document.getElementById("signUpForm");
const loginForm = document.getElementById("loginForm");
const forgotLink = document.getElementById("forgotLink");
const rememberMe = document.getElementById("rememberMe");

// If already logged in, go to app
window.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("loggedInUser") || "null");
  if (user) {
    window.location.href = "index.html";
  }
});

// Switch panels
registerBtn.addEventListener("click", () => container.classList.add("active"));
loginBtn.addEventListener("click", () => container.classList.remove("active"));

// Clear inputs on page load/visit
window.addEventListener("pageshow", () => {
  document.querySelectorAll("input").forEach(input => {
    if (input.type !== "checkbox") input.value = "";
  });
});

// Show/Hide passwords
document.querySelectorAll(".show-pass").forEach(btn => {
  btn.addEventListener("click", () => {
    const scope = btn.dataset.for;
    const input = btn.closest(".pass-wrap").querySelector('input[type="password"], input[type="text"]');
    if (input.type === "password") {
      input.type = "text"; btn.textContent = "Hide";
    } else {
      input.type = "password"; btn.textContent = "Show";
    }
  });
});

// ========== SIGN UP ==========
signUpForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const [nameEl, emailEl, passEl, confirmEl, phoneEl] = signUpForm.querySelectorAll("input");
  const name = nameEl.value.trim();
  const email = emailEl.value.trim();
  const password = passEl.value;
  const confirmPass = confirmEl.value;
  const phone = phoneEl.value.trim();

  if (!name || !email || !password || !confirmPass || !phone) {
    alert("Please fill in all fields!");
    return;
  }
  if (password.length < 6) {
    alert("Password must be at least 6 characters.");
    return;
  }
  if (password !== confirmPass) {
    alert("Passwords do not match!");
    return;
  }

  let users = JSON.parse(localStorage.getItem("users")) || [];
  if (users.some(user => user.email === email)) {
    alert("Email already registered! Please login.");
    return;
  }

  const newUser = { name, email, password, phone };
  users.push(newUser);
  localStorage.setItem("users", JSON.stringify(users));

  alert("Sign up successful! You can now login.");
  signUpForm.reset();
  container.classList.remove("active");
});

// ========== LOGIN ==========
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const [emailEl, passWrap] = loginForm.querySelectorAll("input, .pass-wrap");
  const email = loginForm.querySelector("input[placeholder='Email']").value.trim();
  const password = loginForm.querySelector(".pass-wrap input").value;

  let users = JSON.parse(localStorage.getItem("users")) || [];
  const matchedUser = users.find(user => user.email === email && user.password === password);

  if (matchedUser) {
    alert(`Welcome back, ${matchedUser.name}!`);
    localStorage.setItem("loggedInUser", JSON.stringify(matchedUser));
    if (rememberMe.checked) {
      localStorage.setItem("rememberEmail", email);
    } else {
      localStorage.removeItem("rememberEmail");
    }
    window.location.href = "index.html";
  } else {
    alert("Invalid email or password!");
  }
});

// Prefill remembered email
window.addEventListener("DOMContentLoaded", () => {
  const saved = localStorage.getItem("rememberEmail");
  if (saved) {
    loginForm.querySelector("input[placeholder='Email']").value = saved;
    rememberMe.checked = true;
  }
});

// ========== FORGOT PASSWORD ==========
forgotLink.addEventListener("click", (e) => {
  e.preventDefault();
  const email = prompt("Enter your registered email:");
  if (!email) return;

  let users = JSON.parse(localStorage.getItem("users")) || [];
  const user = users.find(u => u.email === email);

  if (user) {
    const mode = confirm("Click OK to show your current password.\nClick Cancel to set a new one.");
    if (mode) {
      alert(`Your password is: ${user.password}`);
    } else {
      const newPass = prompt("Enter your new password (min 6 chars):");
      if (newPass && newPass.length >= 6) {
        user.password = newPass;
        localStorage.setItem("users", JSON.stringify(users));
        alert("Password reset successful! You can now login with your new password.");
      } else {
        alert("Password not changed.");
      }
    }
  } else {
    alert("No account found with that email.");
  }
});
