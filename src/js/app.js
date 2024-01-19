"use strict";

import { addEventOnElements, getGreetingMsg, activeNotebook, makeElemEditable } from "./utils.js";
import { Tooltip } from "./components/Tooltip.js";
import { db } from "./db.js";
import { client } from "./client.js";
import { NoteModal } from "./components/Modal.js";

//////////////////////////////////
// Toggle sidebar in small screens
const sidebar = document.querySelector(".sidebar");
const sidebarToggler = document.querySelectorAll("[data-sidebar-toggler]");
const sidebarOverlay = document.querySelector(".sidebar-overlay");
addEventOnElements(sidebarToggler, "click", function () {
  sidebar.classList.toggle("active");
  sidebarOverlay.classList.toggle("active");
});

//////////////////////////////////
// Initialize tooltip behavior for all DOM elements with 'data-tooltip' attribute.
const tooltipElements = document.querySelectorAll("[data-tooltip]");
tooltipElements.forEach((element) => Tooltip(element));

//////////////////////////////////
// Show greeting message on homepage
const greetingEl = document.querySelector("[data-greeting]");
const currentHour = new Date().getHours();
greetingEl.textContent = getGreetingMsg(currentHour);

//////////////////////////////////
// Show current date on homepage
const dateEl = document.querySelector("[data-current-date]");
dateEl.textContent = new Date().toDateString().replace(" ", ", ");

//////////////////////////////////
// Notebook create field
const sidebarList = document.querySelector("[data-sidebar-list]");
const addNotebookBtn = document.querySelector("[data-add-notebook]");

const showNotebookField = function () {
  const navItem = document.createElement("div");
  navItem.classList.add("sidebar__nav--item");

  navItem.innerHTML = `
  <span class="sidebar__nav--item-text" data-notebook-field></span>
  <div class="state-layer"></div>
  `;
  sidebarList.appendChild(navItem);

  const navItemField = navItem.querySelector("[data-notebook-field]");

  activeNotebook.call(navItem);

  makeElemEditable(navItemField);

  navItemField.addEventListener("keydown", createNotebook);
};

addNotebookBtn.addEventListener("click", showNotebookField);

//////////////////////////////////
// Create New NoteBook
const createNotebook = function (event) {
  if (event.key === "Enter") {
    // Store new Notebook in DB
    const notebookData = db.post.notebook(this.textContent || "Untitled");
    this.parentElement.remove();

    // Render navItem
    client.notebook.create(notebookData);
  }
};

//////////////////////////////////
// Render Existed Notebook list

const renderExistedNotebook = function () {
  const notebookList = db.get.notebook();
  client.notebook.read(notebookList);
};
renderExistedNotebook();

//////////////////////////////////
// Create New Note
const noteCreateButtons = document.querySelectorAll("[data-note-create-btn]");
addEventOnElements(noteCreateButtons, "click", function () {
  const modal = NoteModal();
  modal.open();

  modal.onSubmit((noteObj) => {
    const activeNotebookId = document.querySelector("[data-notebook].active").dataset.notebook;
    const noteData = db.post.note(activeNotebookId, noteObj);
    client.note.create(noteData);
    modal.close();
  });
});

//////////////////////////////////
// Render existing notes in the active notebook

const renderExistedNote = function () {
  const activeNotebookId = document.querySelector("[data-notebook].active")?.dataset.notebook;

  if (activeNotebookId) {
    const noteList = db.get.note(activeNotebookId);

    client.note.read(noteList);
  }
};
renderExistedNote();
