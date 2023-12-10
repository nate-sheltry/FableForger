const dbName = "booksDB";
const dbVersion = 3;

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


