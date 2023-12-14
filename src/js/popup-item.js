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

<<<<<<< HEAD
function saveData(element, itemId) {
  element.addEventListener("click", (e) => {
    console.log('Save button clicked'); // Log to confirm button click

    const [title, description] = getData(e.target.parentElement);

    const projectId = document.querySelector(".outline .subtitle").getAttribute("data-id");

    // Ensure both IDs are retrieved correctly
    if (!projectId || !itemId) {
      console.error("Project ID or Item ID is missing.");
      return;
    }

    // Open a transaction to the projects store in read/write mode
    const transaction = db.transaction(["projects"], "readwrite");
    const store = transaction.objectStore("projects");

    // Get the project object from the database
    const projectReq = store.get(projectId);

    projectReq.onsuccess = (event) => {
      const projectObj = event.target.result;

      // Update the item's title and description in the project data
      projectObj.data.lists[projectId].items[itemId].title = title;
      projectObj.data.lists[projectId].items[itemId].description = description;

      // Put the updated project object back into the database
      const updateRequest = store.put(projectObj);

      updateRequest.onsuccess = (event) => {
        // Create a message element indicating successful save
        const messageElement = document.createElement('div');
        messageElement.textContent = 'Item saved';
        messageElement.classList.add('saved-message');

        // Insert the message into the UI (in this example, it's added after the save button)
        e.target.parentElement.appendChild(messageElement);

        // Remove the message after a certain duration (here, removing after 3 seconds)
        setTimeout(() => {
          messageElement.remove();
        }, 3000);
      };

      updateRequest.onerror = (event) => {
        console.error("Error updating item:", event.target.error);
      };
    };

    projectReq.onerror = (event) => {
      console.error("Error retrieving project:", event.target.error);
    };
  });
}

document.addEventListener('DOMContentLoaded', () => {
  // Get the item ID from the URL query parameters
  const urlParams = new URLSearchParams(window.location.search);
  const itemId = urlParams.get('itemId');

  // Select the save button element and call saveData function passing the itemId
  const saveButton = document.querySelector(".item-save-btn");
  if (saveButton) {
    saveData(saveButton, itemId);
  }
});

function closeElement(element) {
  element.addEventListener("pointerdown", (e) => {
    const [title, description] = getData(e.target.parentElement);

     dbItem = item in database

     if(title != dbItem.title || description != dbItem.description){
        const confirmation = confirm(`Changes made to the ${e.target.parentElement.querySelector('.item-header').textContent} item will not be saved, are you sure?`);
         if(!confirmation) return
    }

    e.target.parentElement.remove();
  });
}

function deleteConfirmation(element) {
  element.addEventListener("pointerdown", (e) => {
    //If we implement user preferences, wrap the confirmation inside the if statement.
    // if(userConfirmDelete == true){}

    const confirmation = confirm(
      `Are you sure you would like to delete the ${
        e.target.parentElement.querySelector(".item-header").textContent
      } item?`,
=======
function saveData(element, db, dbObj) {
  element.addEventListener("pointerdown", (e) => {

    const [title, description, listId, itemIndex] = getData(
      e.target.parentElement,
>>>>>>> a739ac0 (update main with development.)
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
