document.addEventListener("DOMContentLoaded", () => {
  const USERS_KEY = "fashionHubUsers";
  const CURRENT_USER_KEY = "fashionHubCurrentUser";

  const path = window.location.pathname.toLowerCase();
  const isLoginPage = path.includes("login.html");
  const isRegisterPage = path.includes("register.html");

  function preventNumbers(input) {
    // Block number keys while typing
    input.addEventListener("keydown", (e) => {
      if (/[0-9]/.test(e.key)) {
        e.preventDefault();
      }
    });

    // Remove numbers if pasted or typed
    input.addEventListener("input", () => {
      input.value = input.value.replace(/[0-9]/g, "");
    });

    // Handle paste specifically
    input.addEventListener("paste", (e) => {
      e.preventDefault();
      let pasted = (e.clipboardData || window.clipboardData).getData("text");
      pasted = pasted.replace(/[0-9]/g, "");
      document.execCommand("insertText", false, pasted);
    });
  }

  // Apply to all name fields (works for both pages)
  const nameInputs = document.querySelectorAll(
    'input[placeholder="First name"], input[placeholder="Last name"], input[placeholder="Enter first name"], input[placeholder="Enter last name"]'
  );

  nameInputs.forEach(preventNumbers);

  const getUsers = () => JSON.parse(localStorage.getItem(USERS_KEY)) || [];

  const saveUsers = (users) => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  };

  const saveCurrentUser = (user) => {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  };

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  };

  const createMessageBox = (form) => {
    let messageBox = form.querySelector(".auth-message");

    if (!messageBox) {
      messageBox = document.createElement("div");
      messageBox.className =
        "auth-message hidden rounded-lg px-4 py-3 text-sm font-medium";
      form.prepend(messageBox);
    }

    return messageBox;
  };

  const showMessage = (form, message, type = "error") => {
    const messageBox = createMessageBox(form);

    messageBox.textContent = message;
    messageBox.classList.remove(
      "hidden",
      "bg-red-100",
      "text-red-700",
      "bg-green-100",
      "text-green-700"
    );

    if (type === "success") {
      messageBox.classList.add("bg-green-100", "text-green-700");
    } else {
      messageBox.classList.add("bg-red-100", "text-red-700");
    }
  };

  const clearMessage = (form) => {
    const messageBox = form.querySelector(".auth-message");
    if (messageBox) {
      messageBox.textContent = "";
      messageBox.classList.add("hidden");
    }
  };

  const initRegister = () => {
    const form = document.querySelector("form");
    if (!form) return;

    const firstNameInput = form.querySelector(
      'input[placeholder="First name"]'
    );
    const lastNameInput = form.querySelector(
      'input[placeholder="Last name"]'
    );
    const emailInput = form.querySelector('input[type="email"]');
    const passwordInputs = form.querySelectorAll('input[type="password"]');
    const passwordInput = passwordInputs[0];
    const confirmPasswordInput = passwordInputs[1];
    const termsCheckbox = form.querySelector('input[type="checkbox"]');

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      clearMessage(form);

      const firstName = firstNameInput.value.trim();
      const lastName = lastNameInput.value.trim();
      const email = emailInput.value.trim().toLowerCase();
      const password = passwordInput.value.trim();
      const confirmPassword = confirmPasswordInput.value.trim();
      const acceptedTerms = termsCheckbox.checked;

      if (!firstName || !lastName || !email || !password || !confirmPassword) {
        showMessage(form, "Please fill in all fields.");
        return;
      }

      if (!isValidEmail(email)) {
        showMessage(form, "Please enter a valid email address.");
        return;
      }

      if (password.length < 8) {
        showMessage(form, "Password must be at least 8 characters.");
        return;
      }

      if (password !== confirmPassword) {
        showMessage(form, "Passwords do not match.");
        return;
      }

      if (!acceptedTerms) {
        showMessage(form, "You must agree to the Terms and Privacy Policy.");
        return;
      }

      const users = getUsers();
      const userExists = users.some((user) => user.email === email);

      if (userExists) {
        showMessage(form, "An account with this email already exists.");
        return;
      }

      const newUser = {
        id: Date.now().toString(),
        firstName,
        lastName,
        email,
        password,
        createdAt: new Date().toISOString(),
      };

      users.push(newUser);
      saveUsers(users);

      showMessage(form, "Account created! Redirecting to login...", "success");
      form.reset();

      setTimeout(() => {
        window.location.href = "login.html";
      }, 1500);
    });
  };

  const initLogin = () => {
    const form = document.querySelector("form");
    if (!form) return;

    const emailInput = form.querySelector('input[type="email"]');
    const passwordInput = form.querySelector('input[type="password"]');
    const rememberMeCheckbox = form.querySelector('input[type="checkbox"]');

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      clearMessage(form);

      const email = emailInput.value.trim().toLowerCase();
      const password = passwordInput.value.trim();
      const rememberMe = rememberMeCheckbox.checked;

      if (!email || !password) {
        showMessage(form, "Please enter your email and password.");
        return;
      }

      if (!isValidEmail(email)) {
        showMessage(form, "Please enter a valid email address.");
        return;
      }

      if (password.length < 8) {
        showMessage(form, "Password must be at least 8 characters.");
        return;
      }

      const users = getUsers();
      const foundUser = users.find(
        (user) => user.email === email && user.password === password
      );

      if (!foundUser) {
        showMessage(
          form,
          "You don't have an account or entered wrong credentials."
        );
        return;
      }

      const loggedInUser = {
        id: foundUser.id,
        firstName: foundUser.firstName,
        lastName: foundUser.lastName,
        email: foundUser.email,
        rememberMe,
      };

      saveCurrentUser(loggedInUser);

      showMessage(form, "Login successful! Redirecting to home...", "success");
      form.reset();

      setTimeout(() => {
        window.location.href = "../index.html";
      }, 1500);
    });
  };

  if (isRegisterPage) initRegister();
  if (isLoginPage) initLogin();
});


// tooglepassword
const passwordInput = document.getElementById("passwordInput");
  const togglePassword = document.getElementById("togglePassword");

  togglePassword.addEventListener("click", () => {
    if (passwordInput.type === "password") {
      passwordInput.type = "text";
      togglePassword.classList.remove("fa-eye");
      togglePassword.classList.add("fa-eye-slash");
    } else {
      passwordInput.type = "password";
      togglePassword.classList.remove("fa-eye-slash");
      togglePassword.classList.add("fa-eye");
    }
  });