"use strict";

import { makeElemEditable } from "../utils.js";

const modalOverlay = document.createElement("div");
modalOverlay.classList.add("modal-overlay");

const NoteModal = function (title = "Unititled", text = "Please enter your note", time = "") {
  const modal = document.createElement("div");
  modal.classList.add("modal");

  modal.innerHTML = `
  <div class="modal__close-btn">
        <span class="material-symbols-rounded">close</span>
        <div class="state-layer"></div>
      </div>
      <input type="text" class="modal__title" placeholder="Untitled" value="${title}" data-note-field/>
      <textarea placeholder="Take a note..." class="modal__text" data-note-field>${text}</textarea>
      <div class="modal__footer">
        <span class="modal__footer--time">${time}</span>
        <button type="button" class="modal__footer--btn" data-note-save>
          <span>Save</span>
          <div class="state-layer"></div>
        </button>
      </div>
  `;

  const noteSaveBtn = modal.querySelector("[data-note-save]");
  noteSaveBtn.disabled = true;

  const [titleField, textField] = modal.querySelectorAll("[data-note-field]");

  const enableSubmitBtn = function () {
    noteSaveBtn.disabled = !titleField.value && !textField.value;
  };

  titleField.addEventListener("keyup", enableSubmitBtn);
  textField.addEventListener("keyup", enableSubmitBtn);

  const open = function () {
    document.body.appendChild(modal);
    document.body.appendChild(modalOverlay);
    titleField.focus();
  };

  const close = function () {
    document.body.removeChild(modal);
    document.body.removeChild(modalOverlay);
  };

  const modalCloseBtn = modal.querySelector(".modal__close-btn");
  modalCloseBtn.addEventListener("click", close);

  const onSubmit = function (callback) {
    noteSaveBtn.addEventListener("click", function () {
      const noteData = {
        title: titleField.value,
        text: textField.value,
      };

      callback(noteData);
    });
  };

  return { open, close, onSubmit };
};

const DeleteConfirmModal = function (title) {
  const /** {HTMLElement} */ $modal = document.createElement("div");
  $modal.classList.add("modal");

  $modal.innerHTML = `
  <h3 class="modal__title">Are you sure you want to delete <strong>"${title}"</strong>?</h3>
  <div class="modal__footer">
    <button class="modal__footer--btn" data-action-btn="false">
      <span>Cancel</span>
      <div class="state-layer"></div>
    </button>
    <button class="modal__footer--btn fill" data-action-btn="true">
      <span>Delete</span>
      <div class="state-layer"></div>
    </button>
  </div>
    `;

  /**
   * Opens the delete confirmation modal by appending it to the document body
   */
  const open = function () {
    document.body.appendChild($modal);
    document.body.appendChild(modalOverlay);
  };

  /**
   * Closes the delete confirmation modal by removing it from the document body
   */
  const close = function () {
    document.body.removeChild($modal);
    document.body.removeChild(modalOverlay);
  };

  const actionBtns = $modal.querySelectorAll("[data-action-btn]");

  /**
   * Handles the submission of the delete confirmation.
   *
   * @param {Function} callback - The callback function to execute with the confirmation result (true for confirmation, false for cancel).
   */
  const onSubmit = function (callback) {
    actionBtns.forEach(($btn) =>
      $btn.addEventListener("click", function () {
        const /** {Boolean} */ isConfirm = this.dataset.actionBtn === "true" ? true : false;

        callback(isConfirm);
      })
    );
  };

  return { open, close, onSubmit };
};

export { DeleteConfirmModal, NoteModal };
