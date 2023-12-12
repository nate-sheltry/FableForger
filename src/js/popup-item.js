function setUpPopUp() {
  const elements = document.querySelectorAll(".item-card");
  elements.forEach((element) => {
    deleteConfirmation(element.querySelector(".item-delete-btn"));
    closeElement(element.querySelector(".item-exit-btn"));
    saveData(element.querySelector(".item-save-btn"));
  });
}

function getData(element) {
  const title = element.querySelector(".item-header").textContent;
  const description = element.querySelector(".item-description").textContent;
  return [title, description];
}

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
    );
    if (!confirmation) return;

    //Delete Item From DB Code Here

    //Remove Element from Document.
    e.target.parentElement.remove();
  });
}

setUpPopUp();
