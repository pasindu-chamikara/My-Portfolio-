// Role text cycling animation (slide up + fade + scale)
const roles = [
  "I'm Building the Future",
  "I'm a Problem Solver",
  "I'm a Stronger Every Day",
  "I'm Turning Ideas into Reality",
  "I'm Fast Learner"
];

const roleElement = document.getElementById("roleText");

// Only run if the element exists
if (roleElement) {
  let roleIndex = 0;
  let isFirstLoad = true;

  function changeRole() {
    // Remove visible class to start fade-out
    roleElement.classList.remove("visible");

    // Wait for fade-out to finish before changing text
    setTimeout(() => {
      // Update text
      roleElement.textContent = roles[roleIndex];

      // Trigger fade-in
      roleElement.classList.add("visible");

      // Move to next phrase
      roleIndex = (roleIndex + 1) % roles.length;

      // After first change, set normal interval
      if (isFirstLoad) {
        isFirstLoad = false;
        clearInterval(intervalId); // stop the fast first interval
        intervalId = setInterval(changeRole, 5000); // normal 5-second cycle
      }
    }, 900); // must match CSS transition duration
  }

  // Start the animation
  setTimeout(() => {
    roleElement.classList.add("visible");
    // First change happens faster to avoid showing default HTML text too long
    changeRole();
    // Then start normal cycling
    let intervalId = setInterval(changeRole, 5000);
  }, 800);
}

// Theme toggle (unchanged)
const toggleBtn = document.getElementById("theme-toggle");
const html = document.documentElement;

if (toggleBtn) {
  toggleBtn.addEventListener("click", () => {
    if (html.getAttribute("data-theme") === "dark") {
      html.setAttribute("data-theme", "light");
      toggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
      html.setAttribute("data-theme", "dark");
      toggleBtn.innerHTML = '<i class="fas fa-moon"></i>';
    }
  });
}