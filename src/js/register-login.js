import { guid } from "./uid.js";

// Function to open or create the database
function openDatabase() {
  return new Promise((resolve, reject) => {
    const DBOpenReq = indexedDB.open("FableForger", 2);

    DBOpenReq.addEventListener("error", (err) => {
      console.warn(err);
      reject("Error opening database");
    });

    DBOpenReq.addEventListener("success", (ev) => {
      const db = ev.target.result;
      console.log("Database opened:", db);

      // Log object store names
      console.log("Object store names:", db.objectStoreNames);

      resolve(db);
    });

    DBOpenReq.addEventListener("upgradeneeded", (ev) => {
      const db = ev.target.result;
      console.log("Database upgrade needed:", db);

      // Log existing object store names
      console.log("Existing object store names:", db.objectStoreNames);

      // Handle database upgrade if necessary
      if (!db.objectStoreNames.contains("users")) {
        console.log("Creating users object store");
        const objectStore = db.createObjectStore("users", {
          keyPath: "userId",
        });
        objectStore.createIndex("username", "username", { unique: true });
      }
      // Create "projects" object store if it doesn't exist
      if (!db.objectStoreNames.contains("projects")) {
        console.log("Creating projects object store");
        const projectsObjectStore = db.createObjectStore("projects", {
          keyPath: "id",
        });
        // Add any additional configuration for the "projects" object store
      }

      // Create "userProjects" object store if it doesn't exist
      if (!db.objectStoreNames.contains("userProjects")) {
        console.log("Creating userProjects object store");
        const userProjectsObjectStore = db.createObjectStore("userProjects", {
          keyPath: "relationshipId",
          autoIncrement: true,
        });
        // Add any additional configuration for the "userProjects" object store
      }
    });
  });
}

// Function to hash a password
async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const buffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(buffer));
  const hashedPassword = hashArray
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
  return hashedPassword;
}

function flipRegistration() {
  const login = document.getElementById("login");
  const goRegister = document.querySelector(".goRegister");

  if (login) {
    // Reverse the rotation of the login element
    login.style.transform =
      login.style.transform === "rotateY(-180deg)"
        ? "rotateY(0deg)"
        : "rotateY(-180deg)";
    // Reverse the z-index change with an additional delay
    setTimeout(() => {
      login.style.zIndex = login.style.zIndex === "3" ? "1" : "3";
    }, 600);
  }

  // Set a timeout to show children after 600 milliseconds (0.6 seconds)
  setTimeout(() => {
    // Get all children elements of login
    const children = login.children;

    // Loop through children and toggle their display property
    for (let i = 0; i < children.length; i++) {
      children[i].style.display =
        children[i].style.display === "none" ? "block" : "none";
    }

    // Switch back the goRegister class
    if (goRegister) {
      goRegister.style.display = "flex";
      goRegister.style.flexDirection = "row";
    }
  }, 600);
}

// Function to show welcome message with slow writing effect
function showWelcomeMessage(element, message, duration = 1000) {
  element.textContent = "";

  let index = 0;

  function appendNextCharacter() {
    const span = document.createElement("span");
    span.textContent = message[index];
    span.style.transition = `opacity ${duration / 2}ms ease-in-out`;
    span.style.opacity = 1;

    element.appendChild(span);

    index++;

    if (index < message.length) {
      // Continue appending characters
      setTimeout(() => {
        requestAnimationFrame(appendNextCharacter);
      }, duration / message.length);
    } else {
      // Trigger any additional logic when all characters are appended
      // Add any additional logic here
    }
  }

  // Start the animation
  requestAnimationFrame(appendNextCharacter);
}

// Function to handle form submission for login
async function handleLoginFormSubmission(event) {
  event.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  openDatabase().then(async (db) => {
    const hashedPassword = await hashPassword(password);
    loginUser(db, username, hashedPassword);
  });
}

// Function to register a user
async function registerUser(db, username, password) {
  const hashedPassword = await hashPassword(password);

  const transaction = db.transaction(["users"], "readwrite");
  transaction.oncomplete = () => {
    console.log("Registration successful!");
  };
  transaction.onerror = (error) => {
    console.error("Error registering user:", error);
  };

  const usersStore = transaction.objectStore("users");

  // Check if the username already exists
  const usernameIndex = usersStore.index("username");
  const usernameCheck = usernameIndex.get(username);

  usernameCheck.onsuccess = (event) => {
    const existingUser = event.target.result;
    if (existingUser) {
      console.error("Username already exists. Please choose a different one.");
    } else {
      // If username doesn't exist, proceed with registration
      const newUser = {
        userId: guid(),
        username: username,
        password: hashedPassword, // Use the hashed password
      };

      const addUserRequest = usersStore.add(newUser);

      addUserRequest.onsuccess = () => {
        console.log("User registered successfully:", newUser);

        // Display welcome message with the new username
        showWelcomeMessage(welcomeText, `${username}`);
        // Wait for a couple of seconds
        setTimeout(() => {
          // set WelcomeText back
          showWelcomeMessage(welcomeText, ` registered `);
          // Add logic to clear the registration fields if needed
        }, 1000);
        // Wait for a couple of seconds
        setTimeout(() => {
          // set WelcomeText back
          showWelcomeMessage(welcomeText, `successfully`);
          // Add logic to clear the registration fields if needed
        }, 2500);

        // Wait for a couple of seconds
        setTimeout(() => {
          // set WelcomeText back
          showWelcomeMessage(welcomeText, ` W  e  l  c  o  m  e `);
          // Add logic to clear the registration fields if needed

          // Flip the page
          flipRegistration();
        }, 4000);
      };

      addUserRequest.onerror = (error) => {
        console.error("Error adding user:", error);
      };
    }
  };
}

// Function to log in a user
function loginUser(db, username, password) {
  const transaction = db.transaction(["users"], "readonly");
  transaction.oncomplete = () => {
    console.log("Login successful!");
  };
  transaction.onerror = (error) => {
    console.error("Error logging in:", error);
  };

  const usersStore = transaction.objectStore("users");

  console.log("Attempting to log in with username:", username);

  // Retrieve the user by username to get the userId
  const usernameIndex = usersStore.index("username");
  const getUserRequest = usernameIndex.get(username);

  getUserRequest.onsuccess = (event) => {
    const user = event.target.result;

    console.log("User retrieved from the database:", user);

    if (user) {
      // Now that we have the userId, retrieve the user by userId
      const userId = user.userId;
      const userByKeyRequest = usersStore.get(userId);

      userByKeyRequest.onsuccess = (event) => {
        const userByKey = event.target.result;

        if (userByKey && userByKey.password === password) {
          console.log("User logged in successfully:", userByKey);

          // Set a session variable or use local storage to indicate the user is logged in
          sessionStorage.setItem("loggedIn", true);
          sessionStorage.setItem("userId", userByKey.userId);
          // Update the key to "username" instead of "userByKey.username"
          sessionStorage.setItem("username", userByKey.username);
          console.log("session storage username is:", userByKey.username);

          window.location.href = "./editor/index.html";
        } else {
          console.error("Invalid username or password.");
        }
      };
    } else {
      let userNotFound = document.createElement("p");
      userNotFound.textContent =
        "Please check your username and password, and then try again!";
      let paper = document.querySelector(".paper");
      userNotFound.className = "userNotFound";
      paper.append(userNotFound);
      console.warn(
        "User not found for the provided username. Please register or check your username and password and then try again!"
      );
    }
  };
}

// Function to handle form submission for registration
function handleRegisterFormSubmission(event) {
  event.preventDefault();
  const username = document.getElementById("newUsername").value;
  const password = document.getElementById("newPassword").value;

  openDatabase().then((db) => {
    registerUser(db, username, password);
  });
}

// Event listeners for form submissions
document
  .getElementById("registerForm")
  .addEventListener("submit", handleRegisterFormSubmission);
document
  .getElementById("loginForm")
  .addEventListener("submit", handleLoginFormSubmission);
