"use strict";

const addEventOnElements = function (elements, eventType, callback) {
  elements.forEach((element) => element.addEventListener(eventType, callback));
};

const getGreetingMsg = function (currentHour) {
  const message =
    currentHour < 5
      ? "Night"
      : currentHour < 12
      ? "Morning"
      : currentHour < 15
      ? "Noon"
      : currentHour < 17
      ? "Afternoon"
      : currentHour < 20
      ? "Evening"
      : "Night";

  return `Good ${message}`;
};

let lastActiveNavItem;
const activeNotebook = function () {
  lastActiveNavItem?.classList.remove("active");
  this.classList.add("active");
  lastActiveNavItem = this;
};

const makeElemEditable = function ($element) {
  $element.setAttribute("contenteditable", true);
  $element.focus();
};

const generateID = function () {
  return new Date().getTime().toString();
};

const findNotebook = function (db, notebookId) {
  return db.notebooks.find((notebook) => notebook.id === notebookId);
};

const findNoteIndex = function (notebook, noteId) {
  return notebook.notes.findIndex((note) => note.id === noteId);
};

const findNotebookIndex = function (db, notebookId) {
  return db.notebooks.findIndex((notebook) => notebook.id === notebookId);
};

const findNote = (db, noteId) => {
  let note;
  for (const notebook of db.notebooks) {
    note = notebook.notes.find((note) => note.id === noteId);
    if (note) break;
  }
  return note;
};

const getRelativeTime = function (milliseconds) {
  const /** {Number} */ currentTime = new Date().getTime();

  const /** {Number} */ minute = Math.floor((currentTime - milliseconds) / 1000 / 60);
  const /** {Number} */ hour = Math.floor(minute / 60);
  const /** {Number} */ day = Math.floor(hour / 24);

  return minute < 1
    ? "Just now"
    : minute < 60
    ? `${minute} min ago`
    : hour < 24
    ? `${hour} hour ago`
    : `${day} day ago`;
};

export {
  addEventOnElements,
  getGreetingMsg,
  activeNotebook,
  makeElemEditable,
  generateID,
  findNotebook,
  findNoteIndex,
  findNotebookIndex,
  findNote,
  getRelativeTime,
};
