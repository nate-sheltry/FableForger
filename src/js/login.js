// src/js/login.js

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');

    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;
        loginUser(username, password);
    });
});

function loginUser(username, password) {
    // Simulate async operation (you would replace this with actual logic)
    setTimeout(() => {
        // Retrieve user data from local storage
        const usersData = JSON.parse(localStorage.getItem('usersData')) || [];
        
        const user = usersData.find((u) => u.username === username && u.password === password);
        if (user) {
            console.log('User Login Successful:', user);
            // Set the logged-in username in local storage
            localStorage.setItem('loggedInUsername', username);
            // Redirect to the editor page after successful login
            window.location.href = 'editor/index.html';
            // Update login status in the header if the element exists
            const loginStatus = document.getElementById('loginStatus');
            if (loginStatus) {
                loginStatus.textContent = `Welcome, ${user.username}!`;
            }
        } else {
            console.log('Login Failed: Invalid username or password');
            // Display an error message to the user
        }
    }, 500);
}