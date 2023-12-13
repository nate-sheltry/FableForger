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

function askPrompt(query, error){
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


function addProject(db, e) {
  let projectName = askPrompt("Enter new Project Name", "please enter a valid name.")
  if(!projectName) return

  // Create a transaction for the "projects"/* and "userProjects" object stores -jp
  const projectTransaction = db.transaction(["projects", "userProjects"], "readwrite");
  projectTransaction.oncomplete = (ev) => {
    console.log("Transaction Completed:", ev);
  };

  // Add the project to the "projects" store
  const projectStore = projectTransaction.objectStore("projects");
  const project = {
    id: guid(),
    name: projectName,
    data: {
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
      lists: {

      } // Adding an empty lists object to the project
    },
  };
  const projectRequest = projectStore.add(project);

  projectRequest.onsuccess = (ev) => {
    console.log("Success in adding project object!", ev);

    // Get the ID of the newly added project
    const projectId = ev.target.result;

    // Create a transaction for the "userProjects" store
    const userProjectsTransaction = db.transaction("userProjects", "readwrite");
    userProjectsTransaction.oncomplete = (ev) => {
      console.log("UserProjects Transaction Completed:", ev);
    };

    // Add a record to "userProjects" to associate the user with the project
    const userProjectsStore = userProjectsTransaction.objectStore("userProjects");
    const userProject = {
      userId: sessionStorage.getItem("userId"),
      projectId: projectId,
    };
    const userProjectRequest = userProjectsStore.add(userProject);

    userProjectRequest.onsuccess = (ev) => {
      console.log("Success in adding userProject object!", ev);

      // Create the project element after both transactions are complete
      createProjectElement(db, e, 0, projectId, projectName);
    };

    userProjectRequest.onerror = (err) => {
      console.log("Error on request to add userProject!", err);
    };
  };

  projectRequest.onerror = (err) => {
    console.log("Error on request to add project!", err);
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

function createProjectElement(db, cursor, index, id, projectName) {
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
    const addCustomListBtn = document.getElementById("add-custom-list-btn");
    console.log(addCustomListBtn)
    addCustomListBtn.setAttribute("data-id", id);
    accessLists(db, id);
    //displayLists(db, cursor.data.lists); // Call this function to display lists when the DOM is loaded
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
  const listContainer = document.querySelector(".custom-lists");

  const listButton = document.createElement("button"); // Change this to create a button
  listButton.classList.add("list-button"); // Add a class for styling
  listButton.setAttribute("data-list-id", list.id);
  listButton.textContent = list.title;

  const projectId = document.getElementById("add-custom-list-btn").getAttribute("data-id")

  // Attach an event listener to each list button
  listButton.addEventListener("click", () => {
    // Display items associated with this list
    displayListItems(db, projectId, list.id);
  });

  listContainer.appendChild(listButton);
}

  function displayListItems(db, projectId , listId) {
    console.log(`Display Items Function: ${db}`)
    console.log(db)
    const itemsContainer = document.querySelector(".custom-lists");
    const backBtn = document.getElementById("right-panel-back");
    backBtn.classList.toggle("in-list", true);
    itemsContainer.innerHTML = ""; // Clear previous items

    const transaction = makeTransaction(db, "projects", "readwrite");
    const store = transaction.objectStore("projects");
    const projectReq = store.get(projectId);
    projectReq.onsuccess = (e) => {
      const list = e.target.result.data.lists[listId]
      if (list) {
        const plusBtn = document.getElementById("add-custom-list-btn");
        plusBtn.classList.toggle("add-list-item", true);
        plusBtn.setAttribute("data-list-id", list.id);
        for (const itemId in list.items) {
          const item = list.items[itemId];
          console.log(item)
          console.log("List in Item Creaton:" + list)

          createListItemElement(db, list, item, itemsContainer)
        }
      }
    }
  }
  function createListItemElement(db, list, item, container){
    const itemContainer = document.createElement("div");
    itemContainer.classList.add("item-container");
    itemContainer.setAttribute("data-index", item.index)
    const itemText = document.createElement("span");
    itemText.textContent = item.title;
    itemContainer.appendChild(itemText);
    itemContainer.addEventListener("pointerdown", (e)=>{
      openItemPopUp(db, list, item);
    })
    container.appendChild(itemContainer);
  }

  function createList(db, projectId) {
    let listName = askPrompt("Enter the list name:", "Please enter a valid list name.");
    if(!listName) return

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
        displayLists(db, projectId ,lists)
      } else {
        console.log("No lists found for the project ID:", projectId);
      }
    };

    projectReq.onerror = (err) => {
      console.error("Error accessing lists:", err);
    };
  };

  function displayLists(db, projectId ,lists) {
    console.log('I exist!')
    const listContainer = document.querySelector(".custom-lists");
    for(let list of Object.values(lists)){
      console.log("I'm a list")
      console.log(list)
      const listButton = document.createElement("button"); // Create a button element
      listButton.classList.add("list-button"); // Add a class for styling
      listButton.setAttribute("data-list-id", list.id);
      listButton.textContent = list.title; // Set button text to the list title

      listButton.addEventListener("pointerdown", () => {
        console.log("you click me!" + listButton)
        const plusBtn = document.getElementById("add-custom-list-btn")
        plusBtn.classList.toggle("add-list-item", true);
        plusBtn.setAttribute("data-list-id", list.id);
        displayListItems(db, projectId, list.id);
      });
      listContainer.appendChild(listButton);
    }
    if(!lists){
      console.log("I don't exist afterall")
      return;
    }
  }

function accessProjects(db) {
  const loggedInUserId = sessionStorage.getItem("userId");
  const transaction = db.transaction(["userProjects", "projects"], "readonly");
  const userProjects = transaction.objectStore("userProjects");
  const projects = transaction.objectStore("projects");

  transaction.oncomplete = (ev) => {
    console.log("Transaction Completed:", ev);
  };

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

    
  }
}

  
  // Function to open the item pop-up
  function openItemPopUp(db, list, item) {
    // Replace this with your logic to open the pop-up using your preferred method
    // For instance, you might use window.open or a modal library to display the pop-up
    // Here's an example using window.open to load the pop-up HTML
    console.log(list)
    console.log(db)
    console.log(item)
    console.log('OPEN')
    const projectId = document.querySelector(".subtitle").getAttribute("data-id")
    if(item == undefined){
      const transaction = makeTransaction(db, "projects", "readwrite")
      const store = transaction.objectStore("projects")
      const request = store.get(projectId);

      request.onsuccess = (e) => {
        console.log(`list id`+ list.id)
        const projectObj = JSON.parse(JSON.stringify(e.target.result));
        const selectedList = projectObj.data.lists[list.id];
        console.log(selectedList.items)
        selectedList.items.push({
          index: selectedList.items.length,
          title:"New Item",
          description: "Details here..."
        });
        item = selectedList.items[selectedList.items.length -1]
        const storeRequest = store.put(projectObj);
        
        storeRequest.onsuccess = (ev) =>{
          console.log(`list.id`+ list.id)
          const container = document.createElement('div');
          container.classList.toggle("item-card-container", true);
          container.innerHTML = `
          <div class="item-card" data-item-index="${item.index}" data-list-id="${list.id}">
          <button class="item-exit-btn">X</button>
          <p class="item-header" contenteditable>${item.title}</p>
          <p class="item-description" contenteditable>${item.description}</p>
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
      <div class="item-card" data-item-index="${item.index}" data-list-id="${list.id}">
      <button class="item-exit-btn">X</button>
      <p class="item-header" contenteditable>${item.title}</p>
      <p class="item-description" contenteditable>${item.description}</p>
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

  function addListItem(db, projectId) {
    let itemName = askPrompt("Enter the item name:", "Please enter a valid item name.")
    if(!itemName) return

    const transaction = makeTransaction(db, "projects", "readwrite");
    const store = transaction.objectStore("projects");
    const projectReq = store.get(projectId);

    const listId = document.getElementById("add-custom-list-btn").getAttribute("data-list-id")

    projectReq.onsuccess = (e) => {
      const projectObj = e.target.result;
      console.log(projectObj)

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
        console.log("Success in adding item!", ev);
        // Update the displayed list with the new item
        createListItemElement(db, projectObj.data.lists[listId], projectObj.data.lists[listId].items[newItem.index], document.querySelector(".custom-lists"))
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
  export {
    addProject, addChapter, saveChapter, accessProjects, createList, accessLists, addListItem, displayLists
  }
