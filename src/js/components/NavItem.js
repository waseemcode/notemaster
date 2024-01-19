"use strict";

import { Tooltip } from "./Tooltip.js";
import { activeNotebook, makeElemEditable } from "../utils.js";
import { client } from "../client.js";
import { db } from "../db.js";
import { DeleteConfirmModal } from "./Modal.js";

const notePanelTitle = document.querySelector("[data-note-panel-title]");

export const NavItem = function (id, name) {
  const navItem = document.createElement("div");
  navItem.classList.add("sidebar__nav--item");
  navItem.setAttribute("data-notebook", id);

  navItem.innerHTML = `
          <span class="sidebar__nav--item-text" data-notebook-field="">${name}</span>
          <button class="sidebar__nav--item-btn" data-tooltip="Edit notebook" data-edit-btn>
            <span class="material-symbols-rounded">edit</span>
            <div class="state-layer"></div>
          </button>
          <button class="sidebar__nav--item-btn" data-tooltip="Delete notebook" data-delete-btn>
            <span class="material-symbols-rounded">delete</span>
            <div class="state-layer"></div>
          </button>
          <div class="state-layer"></div>
  `;

  // Show tooltip on edit and delete buttons
  const tooltipElements = navItem.querySelectorAll("[data-tooltip]");
  tooltipElements.forEach((el) => Tooltip(el));

  /**
   * Handles the click event on the navigation item. Updates the note panel's title, retrieves the associated notes,
   * and marks the item as active.
   */
  navItem.addEventListener("click", function () {
    notePanelTitle.textContent = name;
    activeNotebook.call(this);

    const noteList = db.get.note(this.dataset.notebook);
    client.note.read(noteList);
  });

  // Notebook Edit functionality
  const editBtn = navItem.querySelector("[data-edit-btn]");
  const navItemField = navItem.querySelector("[data-notebook-field]");

  editBtn.addEventListener("click", makeElemEditable.bind(null, navItemField));
  navItemField.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      this.removeAttribute("contenteditable");
      const updatedNotebookData = db.update.notebook(id, this.textContent);
      client.notebook.update(id, updatedNotebookData);
    }
  });

  // Notebook Delete functionality
  const deleteBtn = navItem.querySelector("[data-delete-btn]");
  deleteBtn.addEventListener("click", function () {
    const modal = DeleteConfirmModal(name);
    modal.open();

    modal.onSubmit((isConfirm) => {
      if (isConfirm) {
        db.delete.notebook(id);
        client.notebook.delete(id);
      }

      modal.close();
    });
  });

  return navItem;
};
