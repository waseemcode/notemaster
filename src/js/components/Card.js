"use strict";

import { getRelativeTime, makeElemEditable } from "../utils.js";
import { DeleteConfirmModal } from "./Modal.js";
import { Tooltip } from "./Tooltip.js";
import { db } from "../db.js";
import { client } from "../client.js";
import { NoteModal } from "./Modal.js";

export const Card = function (noteData) {
  const { id, title, text, postedOn, notebookId } = noteData;

  const card = document.createElement("div");
  card.classList.add("card");
  card.setAttribute("data-note", id);

  card.innerHTML = `
          <h1 class="card__title">${title}</h1>
          <p class="card__text">${text}</p>
          <div class="card__bottom">
            <p class="card__time">${getRelativeTime(postedOn)}</p>
            <div class="card__icon" data-tooltip="Delete note" data-delete-btn>
              <span class="material-symbols-rounded sidebar__btn--icon">delete</span>
              <div class="state-layer"></div>
            </div>
          </div>
          <div class="state-layer"></div>
  `;

  Tooltip(card.querySelector("[data-tooltip]"));

  // View & Edit Functionality
  card.addEventListener("click", function () {
    const modal = NoteModal(title, text, getRelativeTime(postedOn));
    modal.open();

    modal.onSubmit((noteData) => {
      const updatedData = db.update.note(id, noteData);
      client.note.update(id, updatedData);
      modal.close();
    });
  });

  // Note Delete Functionality
  const deleteBtn = card.querySelector("[data-delete-btn]");
  deleteBtn.addEventListener("click", function (event) {
    event.stopImmediatePropagation();

    const modal = DeleteConfirmModal(title);
    modal.open();

    modal.onSubmit((isConfirm) => {
      if (isConfirm) {
        const existedNotes = db.delete.note(notebookId, id);

        client.note.delete(id, existedNotes.length);
      }

      modal.close();
    });
  });

  return card;
};
