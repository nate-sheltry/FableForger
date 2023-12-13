
function setUpPopUp(db, projectId) {
  const elements = document.querySelectorAll(".item-card");

  const transaction = db.transaction("projects", "readwrite");
  const store = transaction.objectStore("projects")
  const request = store.get(projectId);

  request.onsuccess = (e) => {
    const dbObj = e.target.result
    elements.forEach((element) => {
      deleteConfirmation(element.querySelector(".item-delete-btn"), db, dbObj);
      closeElement(element.querySelector(".item-exit-btn"), db, dbObj);
      saveData(element.querySelector(".item-save-btn"), db, dbObj);
    });
  }
}

function getData(element) {
  const title = element.querySelector(".item-header").textContent;
  const description = element.querySelector(".item-description").textContent;
  const listId = element.getAttribute("data-list-id");
  const itemIndex = parseInt(element.getAttribute("data-item-index"));
  return [title, description, listId, itemIndex];
}

function saveData(element, db, dbObj) {
  element.addEventListener("click", (e) => {
    console.log('Save button clicked'); // Log to confirm button click

    const [title, description, listId, itemIndex] = getData(e.target.parentElement);
    if (!dbObj || isNaN(itemIndex)) {
      console.error("Project Object or Item ID is missing.");
      return
    }

    const item = dbObj.data.lists[listId].items[itemIndex];
    item.title = title;
    item.description = description;

    dbObj.data.lists[listId].items[itemIndex] = item;
    const transaction = db.transaction("projects", "readwrite");
    const store = transaction.objectStore("projects")
    const updateRequest = store.put(dbObj);

    updateRequest.onsuccess = (event) => {
      // Create a message element indicating successful save
      const messageElement = document.createElement('div');
      messageElement.textContent = 'Item saved';
      messageElement.classList.add('saved-message');
      // Insert the message into the UI (in this example, it's added after the save button)
      document.querySelector(".main-editor").appendChild(messageElement);
      e.target.parentElement.remove();
      // Remove the message after a certain duration (here, removing after 3 seconds)
      setTimeout(() => {
        messageElement.remove();
      }, 3000);
    };
    updateRequest.onerror = (event) => {
      console.error("Error updating item:", event.target.error);
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

function closeElement(element, store, dbObj) {
  element.addEventListener("pointerdown", (e) => {
    const [title, description, listId, itemIndex] = getData(e.target.parentElement);
    console.log(dbObj)
    const dbItem = dbObj.data.lists[listId].items[itemIndex];
    console.log(dbItem)

    if(title != dbItem.title || description != dbItem.description){
        const confirmation = confirm(`Changes made to the ${e.target.parentElement.querySelector('.item-header').textContent} item will not be saved, are you sure?`);
        if(!confirmation) return
    }

    e.target.parentElement.remove();
  });
}

function deleteConfirmation(element, store, dbObj) {
  if (element) {
    element.addEventListener("pointerdown", (e) => {
      const itemHeader = e.target.parentElement.querySelector(".item-header");
      if (itemHeader) {
        const confirmation = confirm(`Are you sure you would like to delete the ${itemHeader.textContent} item?`);
        if (!confirmation) return;

        // Delete Item From DB Code Here

        // Remove Element from Document.
        e.target.parentElement.remove();
      } else {
        console.error("Item header not found.");
      }
    });
  } else {
    console.error("Delete button element not found.");
  }
}

export {
  setUpPopUp
}
