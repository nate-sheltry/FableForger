const dbName = "projects";
const dbVersion = 5;

//PROJECTS

// Function to add a new project
function addProject(db, projectName) {
  const transaction = db.transaction("projects", "readwrite");
  const store = transaction.objectStore("projects");
  const request = store.add(projectName);

  request.onerror = (error) => {
    console.error("Error adding project:", error);
  };
}
// Function to retrieve all projects
function getAllProjects(db) {
  const transaction = db.transaction("projects", "readonly");
  const store = transaction.objectStore("projects");
  const request = store.getAll();

  request.onsuccess = () => {
    const projects = request.result;
    // Handle displaying or using the retrieved projects in your app
  };

  request.onerror = (error) => {
    console.error("Error fetching projects:", error);
  };
}
// Function to update a project
function updateProject(db, projectId, updatedProjectData) {
  const transaction = db.transaction("projects", "readwrite");
  const store = transaction.objectStore("projects");
  const request = store.get(projectId);

  request.onsuccess = () => {
    const project = request.result;
    if (project) {
      // Update the project data
      Object.assign(project, updatedProjectData);
      const updateRequest = store.put(project);

      updateRequest.onerror = (error) => {
        console.error("Error updating project:", error);
      };
    } else {
      console.error("Project not found");
    }
  };

  request.onerror = (error) => {
    console.error("Error fetching project for update:", error);
  };
}
// Function to delete a project
function deleteProject(db, projectId) {
  const transaction = db.transaction("projects", "readwrite");
  const store = transaction.objectStore("projects");
  const request = store.delete(projectId);

  request.onerror = (error) => {
    console.error("Error deleting project:", error);
  };
}

// Function to check if IndexedDB is supported
function isIndexedDBSupported() {
  return "indexedDB" in window;
<<<<<<< HEAD
}

let db;

// Function to open the database and perform actions if needed
async function openDB(onOpenCallback) {
  if (!isIndexedDBSupported()) {
    console.error("Your browser does not support IndexedDB!");
    return;
  }

  db = await new Promise((resolve, reject) => {
    const openReq = indexedDB.open(dbName, dbVersion);


// Function to add a list to a project
function addListToProject(db, projectId, listData) {
  const transaction = db.transaction("lists", "readwrite");
  const store = transaction.objectStore("lists");
  const request = store.add({ projectId, ...listData });

  request.onsuccess = () => {
    console.log("New list added to project successfully");
  };

  request.onerror = (error) => {
    console.error("Error adding list to project:", error);
  };
=======
>>>>>>> a739ac0 (update main with development.)
}

let db;

// Function to open the database and perform actions if needed
async function openDB(onOpenCallback) {
  if (!isIndexedDBSupported()) {
    console.error("Your browser does not support IndexedDB!");
    return;
  }

  db = await new Promise((resolve, reject) => {
    const openReq = indexedDB.open(dbName, dbVersion);

    // Function to add a list to a project
    function addListToProject(db, projectId, listData) {
      const transaction = db.transaction("lists", "readwrite");
      const store = transaction.objectStore("lists");
      const request = store.add({ projectId, ...listData });

      request.onerror = (error) => {
        console.error("Error adding list to project:", error);
      };
    }
    // Function to retrieve all lists for a project
    function getAllListsForProject(db, projectId) {
      const transaction = db.transaction("lists", "readonly");
      const store = transaction.objectStore("lists");
      const index = store.index("projectId");

      const request = index.getAll(projectId);

      request.onerror = (error) => {
        console.error("Error fetching lists for project:", error);
      };
    }
    // Function to update a list
    function updateList(db, listId, updatedListData) {
      const transaction = db.transaction("lists", "readwrite");
      const store = transaction.objectStore("lists");
      const request = store.get(listId);

      request.onsuccess = () => {
        const list = request.result;
        if (list) {
          // Update the list data
          Object.assign(list, updatedListData);
          const updateRequest = store.put(list);

          updateRequest.onerror = (error) => {
            console.error("Error updating list:", error);
          };
        } else {
          console.error("List not found");
        }
      };

      request.onerror = (error) => {
        console.error("Error fetching list for update:", error);
      };
    }
    // Function to delete a list from a project
    function deleteListFromProject(db, listId) {
      const transaction = db.transaction("lists", "readwrite");
      const store = transaction.objectStore("lists");
      const request = store.delete(listId);

      request.onerror = (error) => {
        console.error("Error deleting list:", error);
      };
    }

<<<<<<< HEAD
  request.onerror = (error) => {
    console.error("Error fetching chapter for update:", error);
  };
}
//* Function to delete a chapter from a project
function deleteChapterFromProject(db, projectId, chapterId) {
  const transaction = db.transaction("chapters", "readwrite");
  const store = transaction.objectStore("chapters");
  const request = store.delete(chapterId);
=======
    //CHARACTERS
>>>>>>> a739ac0 (update main with development.)

    // Function to add a character to a project
    function addCharacterToProject(db, projectId, characterData) {
      const transaction = db.transaction("characters", "readwrite");
      const store = transaction.objectStore("characters");
      const request = store.add({ projectId, ...characterData });

      request.onerror = (error) => {
        console.error("Error adding character to project:", error);
      };
    }
    // Function to retrieve all characters for a project
    function getAllCharactersForProject(db, projectId) {
      const transaction = db.transaction("characters", "readonly");
      const store = transaction.objectStore("characters");
      const index = store.index("projectId");

      const request = index.getAll(projectId);

      request.onerror = (error) => {
        console.error("Error fetching characters for project:", error);
      };

      request.onerror = (error) => {
        console.error("Error fetching chapter for update:", error);
      };
    }
    // Function to update a character
    function updateCharacter(db, characterId, updatedCharacterData) {
      const transaction = db.transaction("characters", "readwrite");
      const store = transaction.objectStore("characters");
      const request = store.get(characterId);

      request.onsuccess = () => {
        const character = request.result;
        if (character) {
          // Update the character data
          Object.assign(character, updatedCharacterData);
          const updateRequest = store.put(character);

          updateRequest.onerror = (error) => {
            console.error("Error updating character:", error);
          };
        } else {
          console.error("Character not found");
        }
      };

      request.onerror = (error) => {
        console.error("Error fetching character for update:", error);
      };
    }
    // Function to delete a character from a project
    function deleteCharacterFromProject(db, projectId, characterId) {
      const transaction = db.transaction("characters", "readwrite");
      const store = transaction.objectStore("characters");
      const request = store.delete(characterId);

      request.onerror = (error) => {
        console.error("Error deleting character from project:", error);
      };
    }

    //LOCATIONS

    // Function to add a location to a project
    function addLocationToProject(db, projectId, locationData) {
      const transaction = db.transaction("locations", "readwrite");
      const store = transaction.objectStore("locations");
      const request = store.add({ projectId, ...locationData });

      request.onerror = (error) => {
        console.error("Error adding location to project:", error);
      };
    }
    // Function to retrieve all locations for a project
    function getAllLocationsForProject(db, projectId) {
      const transaction = db.transaction("locations", "readonly");
      const store = transaction.objectStore("locations");
      const index = store.index("projectId");

      const request = index.getAll(projectId);

      request.onerror = (error) => {
        console.error("Error fetching locations for project:", error);
      };
    }
    // Function to update a location
    function updateLocation(db, locationId, updatedLocationData) {
      const transaction = db.transaction("locations", "readwrite");
      const store = transaction.objectStore("locations");
      const request = store.get(locationId);

      request.onsuccess = () => {
        const location = request.result;
        if (location) {
          // Update the location data
          Object.assign(location, updatedLocationData);
          const updateRequest = store.put(location);

          updateRequest.onerror = (error) => {
            console.error("Error updating location:", error);
          };
        } else {
          console.error("Location not found");
        }
      };

      request.onerror = (error) => {
        console.error("Error fetching location for update:", error);
      };
    }
    // Function to delete a location from a project
    function deleteLocationFromProject(db, projectId, locationId) {
      const transaction = db.transaction("locations", "readwrite");
      const store = transaction.objectStore("locations");
      const request = store.delete(locationId);

      request.onerror = (error) => {
        console.error("Error deleting location from project:", error);
      };
    }

    //CHAPTERS

    // Function to add a chapter to a project
    function addChapterToProject(db, projectId, chapterData) {
      const transaction = db.transaction("chapters", "readwrite");
      const store = transaction.objectStore("chapters");
      const request = store.add({ projectId, ...chapterData });

      request.onerror = (error) => {
        console.error("Error adding chapter to project:", error);
      };
    }
    // Function to retrieve all chapters for a project
    function getAllChaptersForProject(db, projectId) {
      const transaction = db.transaction("chapters", "readonly");
      const store = transaction.objectStore("chapters");
      const index = store.index("projectId");

      const request = index.getAll(projectId);

      request.onerror = (error) => {
        console.error("Error fetching chapters for project:", error);
      };
    }
    // Function to update a chapter
    function updateChapter(db, chapterId, updatedChapterData) {
      const transaction = db.transaction("chapters", "readwrite");
      const store = transaction.objectStore("chapters");
      const request = store.get(chapterId);

      request.onsuccess = () => {
        const chapter = request.result;
        if (chapter) {
          // Update the chapter data
          Object.assign(chapter, updatedChapterData);
          const updateRequest = store.put(chapter);

          updateRequest.onerror = (error) => {
            console.error("Error updating chapter:", error);
          };
        } else {
          console.error("Chapter not found");
        }
      };

      request.onerror = (error) => {
        console.error("Error fetching chapter for update:", error);
      };
    }
    //* Function to delete a chapter from a project
    function deleteChapterFromProject(db, projectId, chapterId) {
      const transaction = db.transaction("chapters", "readwrite");
      const store = transaction.objectStore("chapters");
      const request = store.delete(chapterId);

      request.onerror = (error) => {
        console.error("Error deleting chapter from project:", error);
      };
    }

    openReq.onerror = (event) => reject(event.target.error);
   
    openReq.onsuccess = (event) => resolve(event.target.result);
  });

  /*if (onOpenCallback) {
    await onOpenCallback(db);
  }*/
}

<<<<<<< HEAD
    openReq.onerror = (event) => reject(event.target.error);
   /* openReq.onupgradeneeded = (event) => {
      console.log("Upgrade needed in the database:", event.target.result);

      const oldVersion = event.oldVersion;
      const newVersion = event.newVersion || db.version;

      console.log(`DB updated from version ${oldVersion} to version ${newVersion}`);

      /* Create object stores
      const objectStore = event.target.result.createObjectStore("bookStore", {
        keyPath: "id",
        autoIncrement: true
      });
      objectStore.createIndex("text", "text", { unique: false }); // Optional: Create index

      // Add additional object stores here (e.g., customListStore)
    };*/
    openReq.onsuccess = (event) => resolve(event.target.result);
  });

  console.log("Success! Database opened:", db);

  /*if (onOpenCallback) {
    await onOpenCallback(db);
  }*/
}

=======
>>>>>>> a739ac0 (update main with development.)
// Function to generate a unique ID
function generateUniqueId() {
  // Example: Using a timestamp as a simple unique ID
  return Date.now().toString();
}

// Function to add an item to a specific list type
async function addItem(type, item) {
  await openDB(async (db) => {
    const transaction = db.transaction([type], "readwrite");
    const store = transaction.objectStore(type);

    try {
      await store.add({
        id: generateUniqueId(),
<<<<<<< HEAD
        ...item // Add other properties as needed
      });

      console.log(`Item added to ${type} in IndexedDB`);
      await getAllItemsFromStoreAndDisplay(type); // Update displayed list
    } catch (error) {
      console.error(`Error adding item to <span class="math-inline">\{type\}\:\`, error\);
=======
        ...item, // Add other properties as needed
      });

      await getAllItemsFromStoreAndDisplay(type); // Update displayed list
    } catch (error) {
      console.error(
        `Error adding item to <span class="math-inline">\{type\}\:\`, error\);
>>>>>>> a739ac0 (update main with development.)
\}
\}\);
\}
// Function to get all items from a specific list type and update the displayed list
async function getAllItemsFromStoreAndDisplay\(type\) \{
await openDB\(async \(db\) \=\> \{
const transaction \= db\.transaction\(\[type\], "readonly"\);
const store \= transaction\.objectStore\(type\);
const items \= await store\.getAll\(\);
await updateDisplayedList\(type, items\); // Update displayed list
\}\);
\}
// Function to delete an item from a specific list type
async function deleteItem\(type, name\) \{
await openDB\(async \(db\) \=\> \{
const transaction \= db\.transaction\(\[type\], "readwrite"\);
const store \= transaction\.objectStore\(type\);
try \{
await store\.delete\(name\); // Assuming 'name' is the key
console\.log\(\`Item '</span>{name}' deleted from <span class="math-inline">\{type\}\`\);
await getAllItemsFromStoreAndDisplay\(type\); // Update displayed list
\} catch \(error\) \{
<<<<<<< HEAD
console\.error\(\`Error deleting item '</span>{name}' from ${type}:`, error);
      }
    });
  }



// Function to create input field and buttons for adding an item to the list
export function createInputField(type) {
    const input = document.createElement("input");
    input.setAttribute("type", "text");
    input.setAttribute("placeholder", `Enter ${type} name`);
    const addButton = document.createElement("button");
    addButton.textContent = "Add";
    const cancelButton = document.createElement("button");
    cancelButton.textContent = "Cancel";

    addButton.addEventListener("click", () => {
        const itemName = input.value.trim();
        if (itemName) {
            addItemToList(type, itemName); // Add item to IndexedDB
        }
        input.remove();
        addButton.remove();
        cancelButton.remove();
    });

    cancelButton.addEventListener("click", () => {
        input.remove();
        addButton.remove();
        cancelButton.remove();
    });

    input.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            const itemName = input.value.trim();
            if (itemName) {
                addItemToList(type, itemName); // Add item to IndexedDB
            }
            input.remove();
            addButton.remove();
            cancelButton.remove();
        }
    });

    return [input, addButton, cancelButton];
}
/*async function addItemToList(type, item) {
    await openDB(async (db) => {
      const transaction = db.transaction([type], "readwrite");
      const store = transaction.objectStore(type);
  
      try {
        await store.add({
          id: generateUniqueId(),
          text: item, // assuming item is the text value to be stored
        });
  
        console.log(`Item added to ${type} in IndexedDB`);
        await getAllItemsFromStoreAndDisplay(type); // Update displayed list
      } catch (error) {
        console.error(`Error adding item to ${type}:`, error);
      }
    });
  } */
/*document.querySelector(".add-character-btn").addEventListener("click", () => {
    const [characterInput, addCharacterButton, cancelCharacterButton] = createInputField("character-list");
    const characterList = document.querySelector(".characters");

    // Append input and buttons to the characterList
    characterList.appendChild(characterInput);
    characterList.appendChild(addCharacterButton);
    characterList.appendChild(cancelCharacterButton);

    // Retrieve input value and add item to characterStore
    addCharacterButton.addEventListener("click", () => {
        const itemName = characterInput.value.trim();
        if (itemName) {
            addItemToList("character", itemName); // Adjust type parameter
            getAllItemsFromStoreAndDisplay("characterStore"); // Adjust type parameter
        }
    });
});
// Event listener to dynamically add a location to the list
document.querySelector(".add-location-btn").addEventListener("click", () => {
    const [locationInput, addLocationButton, cancelLocationButton] = createInputField("location-list");
    const locationList = document.querySelector(".locations");

    // Append input and buttons to the locationList
    locationList.appendChild(locationInput);
    locationList.appendChild(addLocationButton);
    locationList.appendChild(cancelLocationButton);

    // Retrieve input value and add item to locationStore
    addLocationButton.addEventListener("click", () => {
        const itemName = locationInput.value.trim();
        if (itemName) {
            addItemToList("location", itemName); // Adjust type parameter
            getAllItemsFromStoreAndDisplay("locationStore"); // Adjust type parameter
        }
    });
});
*/

/*document.querySelectorAll('.custom-list').forEach(list => {
  list.addEventListener('click', (event) => {
    const clickedList = event.currentTarget;
    const listId = clickedList.getAttribute('data-list-id');

    // Fetch items associated with this listId from IndexedDB
    // Display the items in the .list-items-area and hide the custom-lists

    // Example:
    const listName = clickedList.querySelector('h3').textContent;
    const items = []; // Fetch items based on listId from IndexedDB

    // Display list name and items in the list-items-area
    document.querySelector('.list-items-area').style.display = 'block';
    document.querySelector('.list-name').textContent = listName;

    const itemsList = document.querySelector('.items-list');
    itemsList.innerHTML = ''; // Clear previous items

    items.forEach(item => {
      const li = document.createElement('li');
      li.textContent = item.name; // Assuming 'name' is the property where the item name is stored
      itemsList.appendChild(li);
    });

    // Hide the custom lists section
    document.querySelector('.custom-lists').style.display = 'none';
  });
});
document.querySelector('.back-btn').addEventListener('click', () => {
  // Hide the items display area and show the custom lists area
  document.querySelector('.list-items-area').style.display = 'none';
  document.querySelector('.custom-lists').style.display = 'block';
}); */

// Event listener for custom list creation
/*document.querySelector(".add-custom-list-btn").addEventListener("click", () => {
  const listName = prompt("Enter custom list name:");
  if (listName) {
      const customListContainer = document.querySelector('.custom-lists');
      const newListDiv = document.createElement('div');
      newListDiv.classList.add('custom-list');

      const heading = document.createElement('h3');
      heading.textContent = listName;

      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'x';
      deleteButton.addEventListener('click', () => {
          newListDiv.remove();
      });

      newListDiv.appendChild(heading);
      newListDiv.appendChild(deleteButton);

      const modifiedListName = listName.replace(/\s/g, '-'); // Replace spaces with hyphens
      const list = document.createElement('ul');
      list.classList.add(`custom-list-${modifiedListName.toLowerCase()}`); // Use modified name

      newListDiv.appendChild(list);
      customListContainer.appendChild(newListDiv);

      // You can also call the addItemToList function for this new custom list if needed
     // addItemToList('custom', modifiedListName); // Pass the modified name
      //getAllItemsFromStoreAndDisplay('customListStore'); // Update displayed list for customListStore
  }
});
*/
  // Example function to update and display all items in the 'bookStore'
  //async function getAllItemsAndDisplay() {
   //await updateDisplayedList("bookStore");
  //}
// Function to add items to the respective list in the HTML page
async function addItemsToPageList(type, items) {
    const listContainer = document.querySelector(`.${type}`);
    const ul = listContainer.querySelector(`.${type}-list`);

    // Clear the list before adding new items
    ul.innerHTML = "";

    items.forEach(item => {
        const li = document.createElement("li");
        li.textContent = item.text; // Assuming 'text' is the property where the item name is stored
        ul.appendChild(li);
    });
}


// Example function to update the displayed list with the retrieved items
function updateDisplayedList(type, items) {
    // Assuming you have an HTML list with class "${type}-list" to display the items
    const listContainer = document.querySelector(`.${type}-list`);
    listContainer.innerHTML = ""; // Clear the list

    // Create list items and add them to the list
    items.forEach(item => {
        const listItem = document.createElement("li");
        listItem.textContent = item.text; // Assuming 'text' is the property where the item name is stored
        listContainer.appendChild(listItem);
    });
}
// Export CRUD functions
export {
  addProject,
  getAllProjects,
  updateProject,
  deleteProject,
};
=======
console\.error\(\`Error deleting item '</span>{name}' from ${type}:`,
        error,
      );
    }
  });
}

// Function to create input field and buttons for adding an item to the list
export function createInputField(type) {
  const input = document.createElement("input");
  input.setAttribute("type", "text");
  input.setAttribute("placeholder", `Enter ${type} name`);
  const addButton = document.createElement("button");
  addButton.textContent = "Add";
  const cancelButton = document.createElement("button");
  cancelButton.textContent = "Cancel";

  addButton.addEventListener("click", () => {
    const itemName = input.value.trim();
    if (itemName) {
      addItemToList(type, itemName); // Add item to IndexedDB
    }
    input.remove();
    addButton.remove();
    cancelButton.remove();
  });

  cancelButton.addEventListener("click", () => {
    input.remove();
    addButton.remove();
    cancelButton.remove();
  });

  input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      const itemName = input.value.trim();
      if (itemName) {
        addItemToList(type, itemName); // Add item to IndexedDB
      }
      input.remove();
      addButton.remove();
      cancelButton.remove();
    }
  });

  return [input, addButton, cancelButton];
}

// Function to add items to the respective list in the HTML page
async function addItemsToPageList(type, items) {
  const listContainer = document.querySelector(`.${type}`);
  const ul = listContainer.querySelector(`.${type}-list`);

  // Clear the list before adding new items
  ul.innerHTML = "";

  items.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item.text; // Assuming 'text' is the property where the item name is stored
    ul.appendChild(li);
  });
}

// Example function to update the displayed list with the retrieved items
function updateDisplayedList(type, items) {
  // Assuming you have an HTML list with class "${type}-list" to display the items
  const listContainer = document.querySelector(`.${type}-list`);
  listContainer.innerHTML = ""; // Clear the list

  // Create list items and add them to the list
  items.forEach((item) => {
    const listItem = document.createElement("li");
    listItem.textContent = item.text; // Assuming 'text' is the property where the item name is stored
    listContainer.appendChild(listItem);
  });
}
// Export CRUD functions
export { addProject, getAllProjects, updateProject, deleteProject };
>>>>>>> a739ac0 (update main with development.)
