// src/js/registration.js

// Use local storage key
const localStorageKey = 'usersData';

// Retrieve existing user data from local storage or initialize an empty array
const usersData = JSON.parse(localStorage.getItem(localStorageKey)) || [];

document.addEventListener('DOMContentLoaded', () => {
    const registrationForm = document.getElementById('registrationForm');

    registrationForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // Perform validation here before proceeding to local storage
        // Call a function to handle user registration in local storage
        registerUser(username, password);
    });
});

function registerUser(username, password) {
    setTimeout(() => {
        // Check if the user already exists
        const userExists = usersData.some((user) => user.username === username);

        if (userExists) {
            console.log('Registration Failed: User already exists');
            // Display an error message to the user
            // For example, you could show an alert or update a message on the webpage
            alert('User already exists. Please choose a different username.');
        } else {
            const newUser = { username, password };
            usersData.push(newUser);

            // Save updated user data to local storage
            localStorage.setItem(localStorageKey, JSON.stringify(usersData));

            console.log('User Registration:', newUser);
        }
    }, 500);
}