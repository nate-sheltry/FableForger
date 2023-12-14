function setUpPopUp(db, projectId) {
  const elements = document.querySelectorAll(".item-card");

  const transaction = db.transaction("projects", "readwrite");
  const store = transaction.objectStore("projects");
  const request = store.get(projectId);

  request.onsuccess = (e) => {
    const dbObj = e.target.result;
    elements.forEach((element) => {
      deleteConfirmation(element.querySelector(".item-delete-btn"), db, dbObj);
      closeElement(element.querySelector(".item-exit-btn"), db, dbObj);
      saveData(element.querySelector(".item-save-btn"), db, dbObj);
    });
  };
}

function getData(element) {
  const title = element.querySelector(".item-header").textContent;
  const description = element.querySelector(".item-description").textContent;
  const listId = element.getAttribute("data-list-id");
  const itemIndex = parseInt(element.getAttribute("data-item-index"));
  return [title, description, listId, itemIndex];
}

function saveData(element, db, dbObj) {
  element.addEventListener("pointerdown", (e) => {
    console.log("Save button clicked"); // Log to confirm button click

    const [title, description, listId, itemIndex] = getData(
      e.target.parentElement,
    );
    if (!dbObj || isNaN(itemIndex)) {
      console.error("Project Object or Item ID is missing.");
      return;
    }

    const item = dbObj.data.lists[listId].items[itemIndex];
    item.title = title;
    item.description = description;

    dbObj.data.lists[listId].items[itemIndex] = item;
    const transaction = db.transaction("projects", "readwrite");
    const store = transaction.objectStore("projects");
    const updateRequest = store.put(dbObj);

    updateRequest.onsuccess = (event) => {
      const itemElement = document.querySelector(
        `.item-container[data-index="${itemIndex}"]`,
      );
      itemElement.textContent = item.title;
      // Create a message element indicating successful save
      const messageElement = document.createElement("div");
      messageElement.textContent = "Item saved";
      messageElement.classList.add("saved-message");
      // Insert the message into the UI (in this example, it's added after the save button)
      document.querySelector(".main-editor").appendChild(messageElement);
      e.target.parentElement.remove();
      // Remove the message after a certain duration (here, removing after 3 seconds)
      setTimeout(() => {
        messageElement.remove();
      }, 3000);
      const closeEvent = new CustomEvent('popupClosed');
      document.dispatchEvent(closeEvent);
    };
    updateRequest.onerror = (event) => {
      console.error("Error updating item:", event.target.error);
    };
  });
}

function closeElement(element, db, dbObj) {
  element.addEventListener("pointerdown", (e) => {
    const [title, description, listId, itemIndex] = getData(
      e.target.parentElement,
    );
    const dbItem = dbObj.data.lists[listId].items[itemIndex];
    console.log(dbItem);
    console.log({ title: title, description: description });

    if (title != dbItem.title || description != dbItem.description) {
      const confirmation = confirm(
        `Changes made to the ${dbItem.title} item will not be saved, are you sure?`,
      );
      if (!confirmation) return;
    }

    e.target.parentElement.remove();
        // Dispatch an event to signal closing the popup and hiding the item card container
        const closeEvent = new CustomEvent('popupClosed');
        document.dispatchEvent(closeEvent);
  });
}

function deleteConfirmation(element, db, dbObj) {
  if (element) {
    element.addEventListener("pointerdown", (e) => {
      const [title, description, listId, itemIndex] = getData(
        e.target.parentElement,
      );
      if (!dbObj || isNaN(itemIndex)) {
        console.error("Project Object or Item ID is missing.");
        return;
      }

      dbObj.data.lists[listId].items.splice(itemIndex, 1);

      const transaction = db.transaction("projects", "readwrite");
      const store = transaction.objectStore("projects");
      const updateRequest = store.put(dbObj);

      updateRequest.onsuccess = (event) => {
        // Create a message element indicating successful save
        const itemElement = document.querySelector(
          `.item-container[data-index="${itemIndex}"]`,
        );
        itemElement.remove();
        const messageElement = document.createElement("div");
        messageElement.textContent = "Item deleted";
        messageElement.classList.add("saved-message");
        // Insert the message into the UI (in this example, it's added after the save button)
        document.querySelector(".main-editor").appendChild(messageElement);
        e.target.parentElement.remove();
        // Remove the message after a certain duration (here, removing after 3 seconds)
        setTimeout(() => {
          messageElement.remove();
        }, 3000);
        const items = document.querySelectorAll(".item-container");
        for (let i = 0; i < items.length; i++) {
          items[i].setAttribute("data-index", i);
        }
        // Dispatch the event to signal closing the popup and hiding the item card container
        const closeEvent = new CustomEvent('popupClosed');
        document.dispatchEvent(closeEvent);
      };
      updateRequest.onerror = (event) => {
        console.error("Error updating item:", event.target.error);
      };
    });
  } else {
    console.error("Delete button element not found.");
  }
}

export { setUpPopUp, closeElement };
