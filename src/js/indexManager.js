const dbName = "booksDB";
const dbVersion = 3;

//PROJECTS

// Function to add a new project
function addProject(db, projectName) {
  const transaction = db.transaction("projects", "readwrite");
  const store = transaction.objectStore("projects");
  const request = store.add(projectName);

  request.onsuccess = () => {
    console.log("New project added successfully");
  };

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
    console.log("All projects:", projects);
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

      updateRequest.onsuccess = () => {
        console.log("Project updated successfully");
      };

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

  request.onsuccess = () => {
    console.log("Project deleted successfully");
  };

  request.onerror = (error) => {
    console.error("Error deleting project:", error);
  };
}

// Function to check if IndexedDB is supported
function isIndexedDBSupported() {
  return "indexedDB" in window;
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
}
// Function to retrieve all lists for a project
function getAllListsForProject(db, projectId) {
  const transaction = db.transaction("lists", "readonly");
  const store = transaction.objectStore("lists");
  const index = store.index("projectId");

  const request = index.getAll(projectId);

  request.onsuccess = () => {
    const lists = request.result;
    console.log("All lists for project:", lists);
  };

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

      updateRequest.onsuccess = () => {
        console.log("List updated successfully");
      };

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

  request.onsuccess = () => {
    console.log("List deleted successfully");
  };

  request.onerror = (error) => {
    console.error("Error deleting list:", error);
  };
}

//CHARACTERS

// Function to add a character to a project
function addCharacterToProject(db, projectId, characterData) {
  const transaction = db.transaction("characters", "readwrite");
  const store = transaction.objectStore("characters");
  const request = store.add({ projectId, ...characterData });

  request.onsuccess = () => {
    console.log("New character added to project successfully");
  };

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

  request.onsuccess = () => {
    const characters = request.result;
    console.log("All characters for project:", characters);
    // Handle displaying or using the retrieved characters in your app
  };

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

      updateRequest.onsuccess = () => {
        console.log("Character updated successfully");
      };

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

  request.onsuccess = () => {
    console.log("Character deleted from project successfully");
  };

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

  request.onsuccess = () => {
    console.log("New location added to project successfully");
  };

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

  request.onsuccess = () => {
    const locations = request.result;
    console.log("All locations for project:", locations);
    // Handle displaying or using the retrieved locations in your app
  };

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

      updateRequest.onsuccess = () => {
        console.log("Location updated successfully");
      };

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

  request.onsuccess = () => {
    console.log("Location deleted from project successfully");
  };

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

  request.onsuccess = () => {
    console.log("New chapter added to project successfully");
  };

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

  request.onsuccess = () => {
    const chapters = request.result;
    console.log("All chapters for project:", chapters);
    // Handle displaying or using the retrieved chapters in your app
  };

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

      updateRequest.onsuccess = () => {
        console.log("Chapter updated successfully");
      };

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
// Function to delete a chapter from a project
function deleteChapterFromProject(db, projectId, chapterId) {
  const transaction = db.transaction("chapters", "readwrite");
  const store = transaction.objectStore("chapters");
  const request = store.delete(chapterId);

  request.onsuccess = () => {
    console.log("Chapter deleted from project successfully");
  };

  request.onerror = (error) => {
    console.error("Error deleting chapter from project:", error);
  };
}

    openReq.onerror = (event) => reject(event.target.error);
    openReq.onupgradeneeded = (event) => {
      console.log("Upgrade needed in the database:", event.target.result);

      const oldVersion = event.oldVersion;
      const newVersion = event.newVersion || db.version;

      console.log(`DB updated from version ${oldVersion} to version ${newVersion}`);

      // Create object stores
      const objectStore = event.target.result.createObjectStore("bookStore", {
        keyPath: "id",
        autoIncrement: true
      });
      objectStore.createIndex("text", "text", { unique: false }); // Optional: Create index

      // Add additional object stores here (e.g., customListStore)
    };
    openReq.onsuccess = (event) => resolve(event.target.result);
  });

  console.log("Success! Database opened:", db);

  if (onOpenCallback) {
    await onOpenCallback(db);
  }
}

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
        ...item // Add other properties as needed
      });

      console.log(`Item added to ${type} in IndexedDB`);
      await getAllItemsFromStoreAndDisplay(type); // Update displayed list
    } catch (error) {
      console.error(`Error adding item to <span class="math-inline">\{type\}\:\`, error\);
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
async function addItemToList(type, item) {
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
  }
// Event listener to dynamically add a character to the list
document.querySelector(".add-character-btn").addEventListener("click", () => {
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

// Event listener for custom list creation
document.querySelector(".add-custom-list-btn").addEventListener("click", () => {
    const listName = prompt("Enter custom list name:");
    if (listName) {
        // Assuming you have a container for custom lists with class 'custom-lists'
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

        const list = document.createElement('ul');
        list.classList.add(`custom-list-${listName.toLowerCase()}`);

        newListDiv.appendChild(list);
        customListContainer.appendChild(newListDiv);

        // You can also call the addItemToList function for this new custom list if needed
        addItemToList('custom', listName);
        getAllItemsFromStoreAndDisplay('customListStore'); // Update displayed list for customListStore
    }
});

  // Example function to update and display all items in the 'bookStore'
async function getAllItemsAndDisplay() {
    await updateDisplayedList("bookStore");
  }
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
