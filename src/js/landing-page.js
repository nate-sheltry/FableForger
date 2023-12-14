// landing-page.js

document.addEventListener("DOMContentLoaded", function () {
  const beginButton = document.getElementById("begin");
  const smallButton = document.querySelector(".smallbutton");
  const backButton = document.querySelector(".backbutton");

  if (beginButton) {
    // Attach a click event listener to the Begin button
    beginButton.addEventListener("pointerdown", flipCover);
  }

  if (smallButton) {
    // Attach a click event listener to the small button
    smallButton.addEventListener("pointerdown", flipLogin);
  }

  if (backButton) {
    // Attach a click event listener to the Register button
    backButton.addEventListener("pointerdown", flipRegistration);
  }
});

function flipCover() {
  const cover = document.getElementById("cover");

  if (cover) {
    // Rotate the cover element
    cover.style.transform =
      cover.style.transform === "rotateY(-180deg)"
        ? "rotateY(0deg)"
        : "rotateY(-180deg)";
  }

  // Set a timeout to hide children after 600 milliseconds (0.6 seconds)
  setTimeout(() => {
    // Get all children elements of cover
    const children = cover.children;

    // Loop through children and toggle their display property
    for (let i = 0; i < children.length; i++) {
      children[i].style.display =
        children[i].style.display === "none" ? "block" : "none";
    }
  }, 600);
}

function flipLogin() {
  const login = document.getElementById("login");

  if (login) {
    // Rotate the login element
    login.style.transform =
      login.style.transform === "rotateY(-180deg)"
        ? "rotateY(0deg)"
        : "rotateY(-180deg)";
    // Update the z-index
    login.style.zIndex = login.style.zIndex === "3" ? "1" : "3";
  }

  // Set a timeout to hide children after 600 milliseconds (0.6 seconds)
  setTimeout(() => {
    // Get all children elements of login
    const children = login.children;

    // Loop through children and toggle their display property
    for (let i = 0; i < children.length; i++) {
      children[i].style.display =
        children[i].style.display === "none" ? "block" : "none";
    }
  }, 600);
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

document.addEventListener("DOMContentLoaded", function () {
  const welcomeText = document.getElementById("welcomeText");

  if (welcomeText) {
    const textContent = welcomeText.textContent;
    welcomeText.textContent = "";

    for (let i = 0; i < textContent.length; i++) {
      const span = document.createElement("span");
      span.textContent = textContent[i];
      welcomeText.appendChild(span);
    }
  }
});
