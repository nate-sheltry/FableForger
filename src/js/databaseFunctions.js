import { guid } from "./uid.js";
import {
  makeEditor,
  getEditorData,
  setEditorData,
  closeEditor,
  clearHistory,
} from "../jsx/richTextEditor.jsx";
import { IDB, getProjects, db } from "./index.js";
<<<<<<< HEAD
=======
import { setUpPopUp } from "./popup-item.js";
>>>>>>> a739ac0 (update main with development.)

function makeTransaction(db, storeName, mode) {
  let transaction = db.transaction(storeName, mode);
  transaction.onerror = (err) => {
    console.warn(err);
  };
  return transaction;
}

function askPrompt(query, error) {
  let promptName = false;
  do {
    promptName = prompt(query);
    try {
      promptName = promptName.trim();
    } catch (err) {
      return;
    }
    if (!!promptName == false) alert(error);
  } while (!promptName);
  return promptName;
}

<<<<<<< HEAD
  // Create a transaction for the "projects"/* and "userProjects" object stores -jp
  const projectTransaction = db.transaction(["projects", "userProjects"], "readwrite");
  projectTransaction.oncomplete = (ev) => {
    console.log("Transaction Completed:", ev);
  };

  // Creating project object
  let project = {
=======
function addProject(db, e) {
  let projectName = askPrompt(
    "Enter new Project Name",
    "please enter a valid name.",
  );
  if (!projectName) return;

  // Create a transaction for the "projects"/* and "userProjects" object stores -jp
  const projectTransaction = db.transaction(
    ["projects", "userProjects"],
    "readwrite",
  );

  // Add the project to the "projects" store
  const projectStore = projectTransaction.objectStore("projects");
  const characterListId = `list_${crypto.randomUUID()}`;
  const locationListId = `list_${crypto.randomUUID()}`;
  const project = {
>>>>>>> a739ac0 (update main with development.)
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
<<<<<<< HEAD
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
=======
      lists: {
        [characterListId]: {
          id: characterListId,
          title: "Characters",
          items: [],
        },
        [locationListId]: {
          id: locationListId,
          title: "Locations",
          items: [],
        },
      }, // Adding an empty lists object to the project
    },
  };
  const projectRequest = projectStore.add(project);

  projectRequest.onsuccess = (ev) => {

    // Get the ID of the newly added project
    const projectId = ev.target.result;

    // Create a transaction for the "userProjects" store
    const userProjectsTransaction = db.transaction("userProjects", "readwrite");

    // Add a record to "userProjects" to associate the user with the project
    const userProjectsStore =
      userProjectsTransaction.objectStore("userProjects");
    const userProject = {
      userId: sessionStorage.getItem("userId"),
      projectId: projectId,
    };
    const userProjectRequest = userProjectsStore.add(userProject);

    userProjectRequest.onsuccess = (ev) => {

      // Create the project element after both transactions are complete
      createProjectElement(db, e, 0, projectId, projectName);
    };

    userProjectRequest.onerror = (err) => {
      console.error("Error on request to add userProject!", err);
    };
>>>>>>> a739ac0 (update main with development.)
  };

  projectRequest.onerror = (err) => {
    console.error("Error on request to add project!", err);
  };
}


function addChapter(db, event) {
  const transaction = makeTransaction(db, "projects", "readwrite");
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
      console.error("Error on request to add!", err);
    };
  };
}

function createProjectElement(db, cursor, index, id, projectName) {
  const projectItem = document.createElement("a");
  projectItem.textContent = `${projectName}`;
  projectItem.classList.toggle("project-item", true);
  projectItem.setAttribute("data-id", id);
  document.querySelector(".outline .content").append(projectItem);

  projectItem.addEventListener("pointerdown", (e) => {
<<<<<<< HEAD
    const editor = document.querySelector(".writing-area")
    editor.classList.toggle("no-area", !editor.classList.contains("no-area"))
    editor.classList.toggle("editor-area", !editor.classList.contains("editor-area"))
=======
    if (e.button == 2) {
      e.preventDefault();
      if (
        !window.confirm(
          "You are about to delete a project.\nWould you like to continue?",
        )
      )
        return;
      let confirmation = window.confirm(
        "Do you want to delete the following project?\n" +
          `${e.target.textContent}`,
      );
      if (!confirmation) return;
      else if (confirmation) {
        const userTransaction = makeTransaction(
          db,
          "userProjects",
          "readwrite",
        );
        const storeUserProjects = userTransaction.objectStore("userProjects");
        const userProjectReq = storeUserProjects.openCursor();
        const projectId = e.target.getAttribute("data-id");
        userProjectReq.onsuccess = (event) => {
          const cursor = event.target.result;
          if (!cursor) {
            console.error("cursor failed");
            return;
          }
          if (cursor.value.projectId == projectId) {
            const transaction = makeTransaction(db, "projects", "readwrite");
            const storeProjects = transaction.objectStore("projects");
            const projectReq = storeProjects.delete(projectId);
            projectReq.onsuccess = (ev) => {
              e.target.remove();
            };
            cursor.delete();
            return;
          }
          cursor.continue();
        };
        return;
      }
    }
    const editor = document.querySelector(".writing-area");
    editor.classList.toggle("no-area", !editor.classList.contains("no-area"));
    editor.classList.toggle(
      "editor-area",
      !editor.classList.contains("editor-area"),
    );
>>>>>>> a739ac0 (update main with development.)
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
<<<<<<< HEAD
=======
    const addCustomListBtn = document.getElementById("add-custom-list-btn");
    addCustomListBtn.setAttribute("data-id", id);
>>>>>>> a739ac0 (update main with development.)
    accessLists(db, id);
  });
}

function createChapterElement(db, event, index, projectName) {
  const chapterItem = document.createElement("a");
  chapterItem.textContent = `${projectName}`;
  chapterItem.classList.toggle("chapter-item", true);
  chapterItem.setAttribute("data-index", index);
  const projectId = document
    .querySelector(".outline .subtitle")
    .getAttribute("data-id");
  chapterItem.setAttribute("project-id", projectId);
  document.querySelector(".outline .content").append(chapterItem);

  chapterItem.addEventListener("pointerdown", (e) => {
    if (e.button != 2) {
      sessionStorage.setItem(
        "chapterIndex",
        parseInt(e.target.getAttribute("data-index")),
      );
      loadChapter(db);
      return;
    }
    e.preventDefault();
    let confirmation = window.confirm(
      "Do you want to delete the following chapter?",
    );
    if (!confirmation) return;
    else if (confirmation) {
      const transaction = makeTransaction(db, "projects", "readwrite");
      const storeGet = transaction.objectStore("projects");
      const storePut = transaction.objectStore("projects");
      const projectReq = storeGet.get(projectId);
      projectReq.onsuccess = (event) => {
        const Project = event.target.result;
        const index = parseInt(e.target.getAttribute("data-index"));
        Project.data.chapters.splice(index, 1);
        storePut.put(Project);
        e.target.remove();
        const items = document.querySelectorAll(".chapter-item");
        for(let i = 0; i < items.length; i++){
          const text = items[i].textContent;
          if(text.includes(`${i+2}`)) items[i].textContent = `- Chapter ${i+1}`
          items[i].setAttribute("data-index", i)
        }
        return;
      };
    }
  });
}
  // Show the "Add Custom List" button when chapters are displayed
  /*document.addEventListener('DOMContentLoaded', () => {
    const addCustomListBtns = document.getElementById("add-custom-list-btn");
    addCustomListBtns.style.display = 'inline-block'; // Show the button
    });
  };*/

<<<<<<< HEAD

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
        addItemButton.addEventListener("click", () => {
          openItemPopUp(item.id);
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
=======
function loadChapter(db) {
  const transaction = makeTransaction(db, "projects", "readwrite");
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
  const listContainer = document.querySelector(".custom-lists");

  const listButton = document.createElement("button");
  listButton.classList.add("list-button"); 
  listButton.setAttribute("data-list-id", list.id);
  listButton.textContent = list.title;

  const projectId = document
    .getElementById("add-custom-list-btn")
    .getAttribute("data-id");

  // Attach an event listener to each list button
  listButton.addEventListener("pointerdown", (e) => {
    if (e.button != 2) {
      const plusBtn = document.getElementById("add-custom-list-btn");
      plusBtn.classList.toggle("add-list-item", true);
      plusBtn.setAttribute("data-list-id", list.id);

      const listHeader = document.querySelector(".list-header");
      listHeader.textContent = list.title;

      displayListItems(db, projectId, list.id);
      return;
    }
    e.preventDefault();
    if (list.items.length > 0) {
      let confirm = window.confirm(
        "The List you have selected currently has items inside of it." +
          "\nPlease double check before proceeding.",
      );
      if (!confirm) return;
    }
    const confirmation = window.confirm(
      "Do you want to delete the following list?\n" + `${e.target.textContent}`,
    );
    if (!confirmation) return;
    else if (confirmation) {
      const transaction = makeTransaction(db, "projects", "readwrite");
      const storeGet = transaction.objectStore("projects");
      const storePut = transaction.objectStore("projects");
      const projectReq = storeGet.get(projectId);
      projectReq.onsuccess = (event) => {
        const Project = event.target.result;
        const listId = e.target.getAttribute("data-list-id");
        delete Project.data.lists[listId];
        storePut.put(Project);
        e.target.remove();
        return;
      };
    }
  });

  listContainer.appendChild(listButton);
}

function displayListItems(db, projectId, listId) {
  const itemsContainer = document.querySelector(".custom-lists");
  const backBtn = document.getElementById("right-panel-back");
  backBtn.classList.toggle("in-list", true);
  itemsContainer.innerHTML = ""; // Clear previous items

  const transaction = makeTransaction(db, "projects", "readwrite");
  const store = transaction.objectStore("projects");
  const projectReq = store.get(projectId);
  projectReq.onsuccess = (e) => {
    const list = e.target.result.data.lists[listId];
    if (list) {
      const plusBtn = document.getElementById("add-custom-list-btn");
      plusBtn.classList.toggle("add-list-item", true);
      plusBtn.setAttribute("data-list-id", list.id);
      for (const itemId in list.items) {
        createListItemElement(db, projectId,  list.id, itemId, itemsContainer);
      }
    }
  };
}
function createListItemElement(db, projectId, listId, itemIndex, container) {

  const transaction = makeTransaction(db, "projects", "readwrite");
  const store = transaction.objectStore("projects");
  const projectReq = store.get(projectId);
  projectReq.onsuccess = (e) =>{
    const projectObj = e.target.result
    const list = projectObj.data.lists[listId]
    const item = list.items[itemIndex]

    const itemContainer = document.createElement("div");
    itemContainer.classList.add("item-container");
    itemContainer.setAttribute("data-index", itemIndex);
    itemContainer.textContent = item.title;
    const plusElement = document.getElementById("add-custom-list-btn");
    itemContainer.addEventListener("pointerdown", (e) => {
      if (e.button != 2) {
        openItemPopUp(db, e, listId);
        return;
      }
    });
    container.appendChild(itemContainer);
  }
}

function createList(db, projectId) {
  let listName = askPrompt(
    "Enter the list name:",
    "Please enter a valid list name.",
  );
  if (!listName) return;

  const transaction = makeTransaction(db, "projects", "readwrite");
  const store = transaction.objectStore("projects");
  const projectReq = store.get(projectId);

  projectReq.onsuccess = (e) => {
    const projectObj = e.target.result;
    if (!projectObj) return;
    // Generate a unique list ID
    const listId = `list_${crypto.randomUUID()}`;

    // Create the new list object with data
    const newList = {
      id: listId,
      title: listName,
      items: [], // initialize the list with an empty array
    };
    if (!projectObj.data.lists) projectObj.data.lists = {};
    // Add the new list to the project's lists data
    projectObj.data.lists[listId] = newList;
    const storeRequest = store.put(projectObj);

    storeRequest.onsuccess = (ev) => {
      // Add the list element to the UI
      createListElement(db, newList);
    };

    storeRequest.onerror = (err) => {
      console.error("Error on request to add list!", err);
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
      displayLists(db, projectId, lists);
    } else {
      console.error("No lists found for the project ID:", projectId);
    }
  };

  projectReq.onerror = (err) => {
    console.error("Error accessing lists:", err);
  };
}

function displayLists(db, projectId, lists) {
  const listHeader = document.querySelector(".list-header");
  listHeader.textContent = "Lists";
  for (let list of Object.values(lists)) {
    createListElement(db, list);
  }
  if (!lists) {
    return;
  }
}

function accessProjects(db) {
  const loggedInUserId = sessionStorage.getItem("userId");
  const transaction = db.transaction(["userProjects", "projects"], "readonly");
  const userProjects = transaction.objectStore("userProjects");
  const projects = transaction.objectStore("projects");

  // Clear the content of the outline before loading projects
  const outlineContent = document.querySelector(".outline .content");
  outlineContent.innerHTML = "";

  // Close the Quill editor
  closeEditor();

  // Step 1: Iterate through userProjects store
  const cursorReq = userProjects.openCursor();
  const associatedProjects = [];

  cursorReq.onsuccess = (e) => {
    const cursor = e.target.result;

    if (cursor) {
      const userProject = cursor.value;

      // Step 2: Check if userId matches loggedInUserId
      if (userProject.userId === loggedInUserId) {
        associatedProjects.push(userProject.projectId);
      }

      cursor.continue();
    } else {
      // Step 3: Iterate through projects store
      const projectCursorReq = projects.openCursor();

      projectCursorReq.onsuccess = (event) => {
        const projectCursor = event.target.result;

        if (projectCursor) {
          const project = projectCursor.value;

          // Step 4: Check if projectId is in associatedProjects array
          if (associatedProjects.includes(project.id)) {
            createProjectElement(db, event, 0, project.id, project.name);
          }

          projectCursor.continue();
        }
      };
    }
  };
}

// Function to open the item pop-up
function openItemPopUp(db, e, listId) {
  const itemIndex = parseInt(e.target.getAttribute('data-index'));
  
  const projectId = document.querySelector(".subtitle").getAttribute("data-id");
  const transaction = makeTransaction(db, "projects", "readwrite");
  const store = transaction.objectStore("projects");
  const request = store.get(projectId);
  request.onsuccess = (e) => {
    const projectObj = e.target.result
    const item = projectObj.data.lists[listId].items[itemIndex];
    const container = document.createElement("div");
    const allOpenItems = document.querySelectorAll(".item-card-container");
    if(allOpenItems) allOpenItems.forEach(item => (item.remove()));
    container.classList.toggle("item-card-container", true);
    container.innerHTML = `
      <div class="item-card" data-item-index="${itemIndex}" data-list-id="${listId}">
      <button class="item-exit-btn">X</button>
      <p class="item-header" contenteditable>${item.title}</p>
      <p class="item-description" contenteditable>${item.description}</p>
      <button class="item-save-btn">Save</button>
      <button class="item-delete-btn">Delete</button>
      </div>
      `;
    const positioning = document
      .querySelector(".list-bar")
    document.querySelector(".main-editor").appendChild(container);
    container.style.left = `${positioning.left - positioning.width}px`;
    setUpPopUp(db, projectId);
  }
}

function addListItem(db, projectId) {
  let itemName = askPrompt(
    "Enter the item name:",
    "Please enter a valid item name.",
  );
  if (!itemName) return;

  const transaction = makeTransaction(db, "projects", "readwrite");
  const store = transaction.objectStore("projects");
  const projectReq = store.get(projectId);

  const listId = document
    .getElementById("add-custom-list-btn")
    .getAttribute("data-list-id");

  projectReq.onsuccess = (e) => {
    const projectObj = e.target.result;

    if (!projectObj.data.lists || !projectObj.data.lists[listId]) {
      console.error("Invalid project or list.");
      return;
    }

    const newItem = {
      index: projectObj.data.lists[listId].items.length,
      title: itemName,
      description: "", // initialize description with an empty string
    };

    projectObj.data.lists[listId].items.push(newItem);
    const storeRequest = store.put(projectObj);

    storeRequest.onsuccess = (ev) => {
      // Update the displayed list with the new item
      createListItemElement(db, projectId,  listId, newItem.index, document.querySelector(".custom-lists"));
    };

    storeRequest.onerror = (err) => {
      console.error("Error on request to add item!", err);
    };
  };
}

function saveChapter(db, newContent) {
  const transaction = makeTransaction(db, "projects", "readwrite");

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
    storeRequest.onerror = (err) => {
      console.error("Error on request to add!", err);
>>>>>>> a739ac0 (update main with development.)
    };
  };
  function displayLists(db, list) {
    const listContainer = document.querySelector(".custom-lists");
  
    if (list && list.id && list.title && list.items) {
    const listButton = document.createElement("button"); // Create a button element
    listButton.classList.add("list-button"); // Add a class for styling
    listButton.setAttribute("data-list-id", list.id);
    listButton.textContent = list.title; // Set button text to the list title

<<<<<<< HEAD
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
        openItemPopUp(list.id); // Call your function to open the pop-up here
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
  function openItemPopUp(itemId) {
    // Replace this with your logic to open the pop-up using your preferred method
    // For instance, you might use window.open or a modal library to display the pop-up
    // Here's an example using window.open to load the pop-up HTML
    window.open(`../public/partials/popup-item.html?itemId=${itemId}`, "_blank", "width=400,height=400");
  }

  document.addEventListener('DOMContentLoaded', () => {
    // If using querySelectorAll, iterate through the collection to attach click event listeners
    const addCustomListBtns = document.getElementById("add-custom-list-btn");
    addCustomListBtns.addEventListener('click', () => {
      const projectId = document.querySelector(".outline .subtitle").getAttribute("data-id");
      createList(db, projectId);
    });


    displayLists(db); // Call this function to display lists when the DOM is loaded
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

  export { addProject, addChapter, saveChapter, accessProjects, createList, accessLists, addListItem }
=======
function accessChapters(db, id) {
  const transaction = db.transaction(["projects"], "readonly");
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
function handlePopupClosed() {
  const itemCardContainer = document.querySelector('.item-card-container');
  if (itemCardContainer) {
    // Hide or remove the item card container here
    itemCardContainer.style.display = 'none'; // or itemCardContainer.remove();
  }
}

// Listen for the 'popupClosed' event
document.addEventListener('popupClosed', handlePopupClosed);

const projectId = document
  .querySelector(".outline .subtitle")
  .getAttribute("data-id");
//export default projectId;

export {
  addProject,
  addChapter,
  saveChapter,
  accessProjects,
  createList,
  accessLists,
  addListItem,
  displayLists,
};
>>>>>>> a739ac0 (update main with development.)
