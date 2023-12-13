import { guid } from "./uid.js";
import {
  makeEditor,
  getEditorData,
  setEditorData,
  closeEditor,
  clearHistory,
} from "../jsx/richTextEditor.jsx";
import { IDB, getProjects, db } from "./index.js";
import { setUpPopUp } from "./popup-item.js";

function makeTransaction(db, storeName, mode) {
  let transaction = db.transaction(storeName, mode);
  transaction.onerror = (err) => {
    console.warn(err);
  };
  return transaction;
}

function addProject(db, e) {
  let projectName = false;
  do {
    projectName = prompt("Enter new Project Name");
    try {
      projectName = projectName.trim();
    } catch (err) {
      return;
    }
    if (!!projectName == false) alert("please enter a valid name.");
  } while (!projectName);

  const transaction = makeTransaction(db, "projects", "readwrite");
  transaction.oncomplete = (ev) => {
    console.log("Transaction Completed:", ev);
  };

  // Creating project object
  let project = {
    id: guid(),
    name: projectName,
    data: {
      characters: [],
      locations: [],
      chapters: [
        {
          content: {
            ops: [
              { insert: "Chapter Title" },
              { attributes: { align: "center", header: 3 }, insert: "\n" },
            ],
          },
        },
      ],
      lists: {} // Adding an empty lists object to the project
    },
  };

  const store = transaction.objectStore("projects");
  const storeRequest = store.add(project);
  storeRequest.onsuccess = (ev) => {
    console.log("Success in adding object!", ev);

    // Creating a default list when a project is added
    const listName = "Default List";
    createList(db, listName); // Function call to create a list
    createProjectElement(db, e, 0, project.id, project.name);
  };
  storeRequest.onerror = (err) => {
    console.log("Error on request to add!", err);
  };
}


function addChapter(db, event) {
  const transaction = makeTransaction(db, "projects", "readwrite");
  transaction.oncomplete = (ev) => {
    console.log("Transaction Completed:", ev);
  };
  const store = transaction.objectStore("projects");
  const projectId = document
    .querySelector(".outline .subtitle")
    .getAttribute("data-id");
  const projectReq = store.get(projectId);
  projectReq.onsuccess = (e) => {
    const projectObj = JSON.parse(JSON.stringify(e.target.result));
    projectObj.data.chapters.push({
      content: {
        ops: [
          { insert: "Chapter Title" },
          { attributes: { align: "center", header: 3 }, insert: "\n" },
        ],
      },
      index: projectObj.data.chapters.length,
    });
    const storeRequest = store.put(projectObj);
    storeRequest.onsuccess = (ev) => {
      console.log("Success in adding object!", ev);
      createChapterElement(
        db,
        e,
        projectObj.data.chapters.length - 1,
        `Chapter ${projectObj.data.chapters.length}`,
      );
      sessionStorage.setItem(
        "chapterIndex",
        parseInt(projectObj.data.chapters.length - 1),
      );
      loadChapter(db);
    };
    storeRequest.onerror = (err) => {
      console.log("Error on request to add!", err);
    };
  };
}

function createProjectElement(db, event, index, id, projectName) {
  const projectItem = document.createElement("a");
  projectItem.textContent = `- ${projectName}`;
  projectItem.classList.toggle("project-item", true);
  projectItem.setAttribute("data-id", id);
  document.querySelector(".outline .content").append(projectItem);
  projectItem.addEventListener("pointerdown", (e) => {
    const editor = document.querySelector(".writing-area")
    editor.classList.toggle("no-area", !editor.classList.contains("no-area"))
    editor.classList.toggle("editor-area", !editor.classList.contains("editor-area"))
    const subtitleElem = document.querySelector(".outline .subtitle");
    subtitleElem.textContent = projectName;
    subtitleElem.setAttribute("data-id", id);
    const btn = document.querySelector("#left-panel-btn");

    sessionStorage.setItem("chapterIndex", index);

    btn.classList.toggle("new-project", false);
    btn.classList.toggle("new-chapter", true);

    document.querySelector(".outline .content").innerHTML = ``;
    accessChapters(db, id);
    makeEditor(".editor");
    loadChapter(db);
    accessLists(db, id);
    const addCustomListBtns = document.getElementById("add-custom-list-btn");
    addCustomListBtns.addEventListener('click', () => {
      const projectId = document.querySelector(".outline .subtitle").getAttribute("data-id");
      createList(db, projectId);
    });


    displayLists(db); // Call this function to display lists when the DOM is loaded
  });
}

function createChapterElement(db, event, index, projectName) {
  const chapterItem = document.createElement("a");
  chapterItem.textContent = `- ${projectName}`;
  chapterItem.classList.toggle("chapter-item", true);
  chapterItem.setAttribute("data-index", index);
  const projectId = document
    .querySelector(".outline .subtitle")
    .getAttribute("data-id");
  chapterItem.setAttribute("project-id", projectId);
  document.querySelector(".outline .content").append(chapterItem);
  chapterItem.addEventListener("pointerdown", (e) => {
    sessionStorage.setItem(
      "chapterIndex",
      parseInt(e.target.getAttribute("data-index")),
    );
    loadChapter(db);
  });
}
  // Show the "Add Custom List" button when chapters are displayed
  /*document.addEventListener('DOMContentLoaded', () => {
    const addCustomListBtns = document.getElementById("add-custom-list-btn");
    addCustomListBtns.style.display = 'inline-block'; // Show the button
    });
  };*/


  function loadChapter(db) {
    const transaction = makeTransaction(db, "projects", "readwrite");
    transaction.oncomplete = (ev) => {
      console.log("Transaction Completed:", ev);
    };
    const chapterIndex = parseInt(sessionStorage.getItem("chapterIndex"));
    const store = transaction.objectStore("projects");
    const projectId = document
      .querySelector(".outline .subtitle")
      .getAttribute("data-id");
    const projectReq = store.get(projectId);
    projectReq.onsuccess = (e) => {
      clearHistory();
      const projectObj = JSON.parse(JSON.stringify(e.target.result));
      setEditorData(projectObj.data.chapters[chapterIndex].content);
    };
  }

  //LISTS


  function createListElement(db, list) {
    const listContainer = document.querySelector(".custom-list");
  
    const listButton = document.createElement("button"); // Change this to create a button
    listButton.classList.add("list-button"); // Add a class for styling
    listButton.setAttribute("data-list-id", list.id);
    listButton.textContent = list.title;
  
    // Attach an event listener to each list button
    listButton.addEventListener("click", () => {
      // Display items associated with this list
      displayItems(db, list);
    });
  
    listContainer.appendChild(listButton);
  }
  function displayItems(db, list) {
    console.log(`Display Items Function: ${db}`)
    console.log(db)
    const itemsContainer = document.querySelector(".list-list");
    itemsContainer.innerHTML = ""; // Clear previous items
  
    if (list && list.items) {
      for (const itemId in list.items) {
        const item = list.items[itemId];
  
        const itemContainer = document.createElement("div");
        itemContainer.classList.add("item-container");
  
        const itemText = document.createElement("span");
        itemText.textContent = item.title;
  
        const addItemButton = document.createElement("button");
        addItemButton.textContent = "+";
        addItemButton.classList.add("add-item-button");
  
        // Attach an event listener to each + button for items
        addItemButton.addEventListener("click", (e) => {
          openItemPopUp(db, list, item);
        });
  
        itemContainer.appendChild(itemText);
        itemContainer.appendChild(addItemButton);
        itemsContainer.appendChild(itemContainer);
      }
    }
  }

  function createList(db, projectId) {
    let listName = prompt("Enter the list name:");
    if (!listName) {
      alert("Please enter a valid list name.");
      return;
    }

    const transaction = makeTransaction(db, "projects", "readwrite");
    transaction.oncomplete = (ev) => {
      console.log("Transaction Completed:", ev);
    };

    const store = transaction.objectStore("projects");

    const projectReq = store.get(projectId);

    projectReq.onsuccess = (e) => {
      const projectObj = e.target.result;

      if (!projectObj) {
        // Handle if the project object doesn't exist
        return;
      }

      // Generate a unique list ID
      const listId = `list_${crypto.randomUUID()}`;

      // Create the new list object with data
      const newList = {
        id: listId,
        title: listName,
        items: [], // initialize the list with an empty array
      };

      if (!projectObj.data.lists) {
        projectObj.data.lists = {};
      }

      // Add the new list to the project's lists data
      projectObj.data.lists[listId] = newList;

      const storeRequest = store.put(projectObj);

      storeRequest.onsuccess = (ev) => {
        console.log("Success in adding list!", ev);

        // Add the list element to the UI
        createListElement(db, newList);
      };

      storeRequest.onerror = (err) => {
        console.log("Error on request to add list!", err);
      };
    };
  }
  function accessLists(db, projectId) {
    const transaction = db.transaction(["projects"], "readonly");
    const store = transaction.objectStore("projects");

    const projectReq = store.get(projectId);

    projectReq.onsuccess = (e) => {
      const projectObj = e.target.result;

      if (projectObj && projectObj.data && projectObj.data.lists) {
        const lists = projectObj.data.lists;
        console.log("Lists retrieved:", lists);

        for (const listId in lists) {
          const list = lists[listId];
          console.log("List ID:", listId, "List Data:", list);
          // Process the retrieved list data as needed
          displayLists(db, list)
        }
      } else {
        console.log("No lists found for the project ID:", projectId);
      }
    };

    projectReq.onerror = (err) => {
      console.error("Error accessing lists:", err);
    };
  };
  function displayLists(db, list) {
    const listContainer = document.querySelector(".custom-lists");
  
    if (list && list.id && list.title && list.items) {
    const listButton = document.createElement("button"); // Create a button element
    listButton.classList.add("list-button"); // Add a class for styling
    listButton.setAttribute("data-list-id", list.id);
    listButton.textContent = list.title; // Set button text to the list title

    // Attach an event listener to each list button
    listButton.addEventListener("click", () => {
      const listHeader = document.querySelector(".list-header");
      const listList = document.querySelector(".list-list");
      const allListButtons = document.querySelectorAll(".list-button");
    
      // Hide list-header, list-list, and other list buttons
      listHeader.style.display = "none";
      listList.style.display = "none";
      allListButtons.forEach(button => {
        
          button.style.display = "none";
        
      });
    
      // Convert the clicked button into an h3 element
      const listH3 = document.createElement("h3");
      listH3.textContent = list.title;
      listH3.classList.add("list-h3");
      listContainer.appendChild(listH3);
    
      // Create a "+" button for the pop-up
      const popupButton = document.createElement("button");
      popupButton.textContent = "Add an Item";
      popupButton.classList.add("add-item-button");
    
      // Attach an event listener to open the pop-up when the "+" button is clicked
      popupButton.addEventListener("click", () => {
        openItemPopUp(db, list); // Call your function to open the pop-up here
      });
    
      listContainer.appendChild(popupButton); // Append the "+" button
      // Display the list items associated with the clicked button
      displayItems(db, list);// Create a "Back" button to go back to list-list
      const backButton = document.createElement("button");
      backButton.textContent = "Back";
      backButton.classList.add("back-button");
      
      // Attach an event listener to the back button
      backButton.addEventListener("click", () => {
        const listHeader = document.querySelector(".list-header");
        const listList = document.querySelector(".list-list");
        const allListButtons = document.querySelectorAll(".list-button");
        
        // Show list-header, list-list, and other list buttons
        listHeader.style.display = "block";
        listList.style.display = "block";
        allListButtons.forEach(button => {
          button.style.display = "inline-block"; // Show all list buttons
        });
  
        // Remove the added elements when going back
        const listH3 = document.querySelector(".list-h3");
        const addItemButton = document.querySelector(".add-item-button");
  
        if (listH3) {
          listH3.remove(); // Remove the added h3 element
        }
  
        if (addItemButton) {
          addItemButton.remove(); // Remove the "Add an Item" button
        }
        backButton.remove(); // Remove the back button itself after clicking it

      });
  
      listContainer.appendChild(backButton); // Append the back button
      listContainer.appendChild(listButton); // Append the list button to the container
    })
  
    

    listContainer.appendChild(listButton); // Append the button to the container
    };}

  
  // Function to open the item pop-up
  function openItemPopUp(db, list, item) {
    // Replace this with your logic to open the pop-up using your preferred method
    // For instance, you might use window.open or a modal library to display the pop-up
    // Here's an example using window.open to load the pop-up HTML
    console.log(list)
    console.log(db)
    console.log(item)
    const projectId = document.querySelector(".subtitle").getAttribute("data-id")
    if(item == undefined){
      const transaction = makeTransaction(db, "projects", "readwrite")
      const store = transaction.objectStore("projects")
      const request = store.get(projectId);

      request.onsuccess = (e) => {
        const projectObj = JSON.parse(JSON.stringify(e.target.result));
        const selectedList = projectObj.data.lists[list.id];
        console.log(selectedList.items)
        selectedList.items.push({
          index: selectedList.items.length,
          title:"Your Item Name",
          description: "Lorem Ipsum"
        });
        item = selectedList.items[selectedList.items.length -1]

        const storeRequest = store.put(projectObj);

        storeRequest.onsuccess = (ev) =>{
          const container = document.createElement('div');
          container.classList.toggle("item-card-container", true);
          container.innerHTML = `
          <div class="item-card" data-item-index="${item.index}" data-list-id="${list.id}">
          <button class="item-exit-btn">X</button>
          <p class="item-header" contenteditable>${item.title}</p>
          <p class="item-description" contenteditable>
          ${item.description}
          </p>
          <button class="item-save-btn">Save</button>
          <button class="item-delete-btn">Delete</button>
        </div>
          `
          const positioning = document.querySelector('.list-bar').getBoundingClientRect()
          console.log(positioning)
          document.querySelector('.main-editor').appendChild(container);
          container.style.left = `${positioning.left - positioning.width}px`
          setUpPopUp(db, projectId)
        }
      }
    }
    else {
      const container = document.createElement('div');
      container.classList.toggle("item-card-container", true);
      container.innerHTML = `
      <div class="item-card" data-item-index="${item.index}">
      <button class="item-exit-btn">X</button>
      <p class="item-header" contenteditable>${item.title}</p>
      <p class="item-description" contenteditable>
      ${item.description}
      </p>
      <button class="item-save-btn">Save</button>
      <button class="item-delete-btn">Delete</button>
    </div>
      `
      const positioning = document.querySelector('.list-bar').getBoundingClientRect()
      console.log(positioning)
      document.querySelector('.main-editor').appendChild(container);
      container.style.left = `${positioning.left - positioning.width}px`
      setUpPopUp(db, projectId)
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    // If using querySelectorAll, iterate through the collection to attach click event listeners
  });

  function addListItem(db, projectId) {
    let itemName = prompt("Enter the item name:");
    if (!itemName) {
      alert("Please enter a valid item name.");
      return;
    }

    const transaction = makeTransaction(db, "projects", "readwrite");
    transaction.oncomplete = (ev) => {
      console.log("Transaction Completed:", ev);
    };

    const store = transaction.objectStore("projects");

    const projectReq = store.get(projectId);

    projectReq.onsuccess = (e) => {
      const projectObj = e.target.result;

      if (!projectObj || !projectObj.data || !projectObj.data.lists || !projectObj.data.lists[projectId]) {
        console.error("Invalid project or list.");
        return;
      }

      const list = projectObj.data.lists[projectId];

      // Generate a unique item ID
      const itemId = `item_${crypto.randomUUID()}`;

      // Create a new item object with data
      const newItem = {
        id: itemId,
        title: itemName,
        description: "", // initialize description with an empty string
      };

      list.items[itemId] = newItem;

      const storeRequest = store.put(projectObj);

      storeRequest.onsuccess = (ev) => {
        console.log("Success in adding item!", ev);
        // Update the displayed list with the new item
        displayLists(db, list);
      };

      storeRequest.onerror = (err) => {
        console.log("Error on request to add item!", err);
      };
    };
  }

  function saveChapter(db, newContent) {
    const transaction = makeTransaction(db, "projects", "readwrite");

    transaction.oncomplete = (ev) => {
      console.log("Transaction Completed:", ev);
    };
    const store = transaction.objectStore("projects");
    const projectId = document
      .querySelector(".outline .subtitle")
      .getAttribute("data-id");

    const chapterIndex = parseInt(sessionStorage.getItem("chapterIndex"));

    const projectReq = store.get(projectId);

    projectReq.onsuccess = (e) => {
      const projectObj = JSON.parse(JSON.stringify(e.target.result));
      projectObj.data.chapters[chapterIndex]["content"] = newContent;
      const storeRequest = store.put(projectObj);
      storeRequest.onsuccess = (ev) => {
        console.log("Success in updating Chapter!", ev);
      };
      storeRequest.onerror = (err) => {
        console.log("Error on request to add!", err);
      };
    };
  }

  function accessProjects(db) {
    const transaction = db.transaction(["projects"], "readonly");
    transaction.oncomplete = (ev) => {
      console.log("Transaction Completed:", ev);
    };
    const store = transaction.objectStore("projects");
    const cursorReq = store.openCursor();
    document.querySelector(".outline .content").innerHTML = ``;
    closeEditor();
    cursorReq.onsuccess = (e) => {
      const cursor = e.target.result;
      if (cursor) {
        createProjectElement(db, e, 0, cursor.value.id, cursor.value.name);
        cursor.continue();
      }
    };
  }

  function accessChapters(db, id) {
    const transaction = db.transaction(["projects"], "readonly");
    transaction.oncomplete = (ev) => {
      console.log("Transaction Completed:", ev);
    };
    const store = transaction.objectStore("projects");
    const projectReq = store.get(id);
    projectReq.onsuccess = (e) => {
      const projectObj = e.target.result;
      for (let i = 0; i < projectObj.data.chapters.length; i++) {
        projectObj.data.chapters[i];
        createChapterElement(db, e, i, `Chapter ${i + 1}`);
      }
    };
  }
  const projectId = document.querySelector(".outline .subtitle").getAttribute("data-id");
  //export default projectId;
  export { addProject, addChapter, saveChapter, accessProjects, createList, accessLists, addListItem }
