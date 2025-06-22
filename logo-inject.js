// This script injects the website logo into the element with id 'logo'.
window.addEventListener("DOMContentLoaded", function () {
  var logoContainer = document.getElementById("logo");
  if (logoContainer) {
    logoContainer.innerHTML =
      '<img src="weblogo.png" alt="Website Logo" style="height:60px;">';
  }
});
