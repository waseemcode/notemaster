"use strict";

const toggleTheme = function () {
  const currentTheme = document.documentElement.getAttribute("data-theme") || "light";
  const newTheme = currentTheme === "light" ? "dark" : "light";
  document.documentElement.setAttribute("data-theme", newTheme);

  // Store in Local Storage
  localStorage.setItem("theme", newTheme);
};

// Initialize theme acc to local storage
const /** {string | null} */ storedTheme = localStorage.getItem("theme");
const /** {Boolean} */ systemThemeIsDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
const /** {string} */ initialTheme = storedTheme ?? (systemThemeIsDark ? "dark" : "light");
document.documentElement.setAttribute("data-theme", initialTheme);

window.addEventListener("DOMContentLoaded", function () {
  const themeBtn = document.querySelector("[data-theme-btn]");
  if (themeBtn) themeBtn.addEventListener("click", toggleTheme);
});
