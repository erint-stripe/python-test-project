/**
 * Define your JavaScript methods and bind them to the DOM here.
 * This file is included in the index.html file.
 */

function listenToButton() {
  document.getElementById("button").addEventListener("click", function () {
    alert("Button clicked!");
  });
}

// Define your functions here

function init() {
  listenToButton();
  // Call your functions here
}
