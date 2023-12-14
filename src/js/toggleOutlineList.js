document
  .getElementById("toggleOutlineBtn")
  .addEventListener("pointerdown", function () {
    document.querySelector(".toggleoutline").classList.toggle("show");
  });

document.getElementById("toggleListBtn").addEventListener("pointerdown", function () {
  document.querySelector(".togglelist").classList.toggle("show");
});
