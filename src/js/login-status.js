// login-status.js

document.addEventListener("DOMContentLoaded", function () {
    const loggedIn = sessionStorage.getItem("loggedIn");
    const userStatusElement = document.getElementById("userStatus");
    const logoutBtn = document.getElementById("logoutBtn");
  
    if (loggedIn) {
      const username = sessionStorage.getItem("username");
      userStatusElement.textContent = `Welcome ${username}!`;
    } else {
      // Redirect to the landing page if not logged in
      window.location.href = "../index.html";
    }
  
    // Add logout functionality
    logoutBtn.addEventListener("click", function () {
      // Clear session storage
      sessionStorage.removeItem("loggedIn");
      sessionStorage.removeItem("userId");
      sessionStorage.removeItem("username");
  
      // Redirect to the landing page
      window.location.href = "../index.html";
    });
  });