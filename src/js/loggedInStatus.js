// src/js/loggedInStatus.js

document.addEventListener('DOMContentLoaded', () => {
    // Retrieve user data from local storage
    const usersData = JSON.parse(localStorage.getItem('usersData')) || [];
    const loggedInUser = getLoggedInUser(usersData);

    console.log(usersData);
    console.log(loggedInUser);

    // Update login status in the header if the element exists
    const loginStatus = document.getElementById('loginStatus');
    if (loginStatus && loggedInUser) {
        loginStatus.textContent = `Welcome, ${loggedInUser.username}, You are logged in!`;

        // Create a logout button
        const logoutButton = document.createElement('button');
        logoutButton.textContent = 'Logout';
        logoutButton.addEventListener('click', () => {
            // Clear the loggedInUsername from local storage
            localStorage.removeItem('loggedInUsername');
            // Redirect to the login page after logout
            window.location.href = '../index.html';
        });

        // Append the logout button to the login status
        loginStatus.appendChild(logoutButton);
    }
});

function getLoggedInUser(usersData) {
    // Retrieve the loggedInUsername from local storage
    const loggedInUsername = localStorage.getItem('loggedInUsername');
    // Check if there's a user with the stored username
    const loggedInUser = usersData.find(user => user.username === loggedInUsername);
    return loggedInUser || null;
}