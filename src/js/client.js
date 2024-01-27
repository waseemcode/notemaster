"use strict";

import { NavItem } from "./components/NavItem.js";
import { Card } from "./components/Card.js";
import { activeNotebook } from "./utils.js";

const notePanel = document.querySelector("[data-note-panel]");
const sidebarList = document.querySelector("[data-sidebar-list]");
const notePanelTitle = document.querySelector("[data-note-panel-title]");

const /** {string} */ emptyNotesTemplate = `
<div class="empty-notes">
  <span class="material-symbols-rounded" aria-hidden="true">note_stack</span>

  <div class="text-headline-small">No notes</div>
</div>
`;
const noteCreateButtons = document.querySelectorAll("[data-note-create-btn]");

const disableNoteCreateBtns = function (isThereAnyNotebook) {
  noteCreateButtons.forEach(($item) => {
    $item[isThereAnyNotebook ? "removeAttribute" : "setAttribute"]("disabled", "");
  });
};

export const client = {
  notebook: {
    create(notebookData) {
      const navItem = NavItem(notebookData.id, notebookData.name);
      sidebarList.appendChild(navItem);
      activeNotebook.call(navItem);
      notePanelTitle.textContent = notebookData.name;
      notePanel.innerHTML = emptyNotesTemplate;
      disableNoteCreateBtns(true);
    },

    read(notebookList) {
      disableNoteCreateBtns(notebookList.length);

      notebookList.forEach((notebookData, index) => {
        const navItem = NavItem(notebookData.id, notebookData.name);

        if (index === 0) {
          activeNotebook.call(navItem);
          notePanelTitle.textContent = notebookData.name;
        }

        sidebarList.appendChild(navItem);
      });
    },

    update(notebookId, notebookData) {
      const oldNotebook = document.querySelector(`[data-notebook="${notebookId}"]`);
      const newNotebook = NavItem(notebookData.id, notebookData.name);

      notePanelTitle.textContent = notebookData.name;
      sidebarList.replaceChild(newNotebook, oldNotebook);
      activeNotebook.call(newNotebook);
    },

    delete(notebookId) {
      const deletedNotebook = document.querySelector(`[data-notebook="${notebookId}"]`);

      const activeNavItem = deletedNotebook.nextElementSibling ?? deletedNotebook.previousElementSibling;
      if (activeNavItem) {
        activeNavItem.click;
      } else {
        notePanelTitle.innerHTML = "";
        notePanel.innerHTML = "";
        disableNoteCreateBtns(false);
      }

      deletedNotebook.remove();
    },
  },

  note: {
    create(noteData) {
      if (!notePanel.querySelector("[data-note]")) notePanel.innerHTML = "";
      const card = Card(noteData);
      notePanel.prepend(card);
    },
    read(noteList) {
      if (noteList.length) {
        notePanel.innerHTML = "";

        noteList.forEach((noteData) => {
          const card = Card(noteData);
          notePanel.appendChild(card);
        });
      } else {
        notePanel.innerHTML = emptyNotesTemplate;
      }
    },

    update(noteId, noteData) {
      const oldCard = document.querySelector(`[data-note="${noteId}"]`);
      const newCard = Card(noteData);
      notePanel.replaceChild(newCard, oldCard);
    },

    delete(noteId, isNoteExists) {
      document.querySelector(`[data-note="${noteId}"]`).remove();
      if (!isNoteExists) notePanel.innerHTML = emptyNotesTemplate;
    },
  },
};
