// CRUD operations for IndexedDB

//PROJECTS

// Function to add a new project
function addProject(db, projectData) {
    const transaction = db.transaction('projects', 'readwrite');
    const store = transaction.objectStore('projects');
    const request = store.add(projectData);

    request.onsuccess = () => {
        console.log('New project added successfully');
    };

    request.onerror = (error) => {
        console.error('Error adding project:', error);
    };
}
// Function to retrieve all projects
function getAllProjects(db) {
    const transaction = db.transaction('projects', 'readonly');
    const store = transaction.objectStore('projects');
    const request = store.getAll();

    request.onsuccess = () => {
        const projects = request.result;
        console.log('All projects:', projects);
        // Handle displaying or using the retrieved projects in your app
    };

    request.onerror = (error) => {
        console.error('Error fetching projects:', error);
    };
}
// Function to update a project
function updateProject(db, projectId, updatedProjectData) {
    const transaction = db.transaction('projects', 'readwrite');
    const store = transaction.objectStore('projects');
    const request = store.get(projectId);

    request.onsuccess = () => {
        const project = request.result;
        if (project) {
            // Update the project data
            Object.assign(project, updatedProjectData);
            const updateRequest = store.put(project);

            updateRequest.onsuccess = () => {
                console.log('Project updated successfully');
            };

            updateRequest.onerror = (error) => {
                console.error('Error updating project:', error);
            };
        } else {
            console.error('Project not found');
        }
    };

    request.onerror = (error) => {
        console.error('Error fetching project for update:', error);
    };
}
// Function to delete a project
function deleteProject(db, projectId) {
    const transaction = db.transaction('projects', 'readwrite');
    const store = transaction.objectStore('projects');
    const request = store.delete(projectId);

    request.onsuccess = () => {
        console.log('Project deleted successfully');
    };

    request.onerror = (error) => {
        console.error('Error deleting project:', error);
    };
}

//LISTS

// Function to add a list to a project
function addListToProject(db, projectId, listData) {
    const transaction = db.transaction('lists', 'readwrite');
    const store = transaction.objectStore('lists');
    const request = store.add({ projectId, ...listData });

    request.onsuccess = () => {
        console.log('New list added to project successfully');
    };

    request.onerror = (error) => {
        console.error('Error adding list to project:', error);
    };
}
// Function to retrieve all lists for a project
function getAllListsForProject(db, projectId) {
    const transaction = db.transaction('lists', 'readonly');
    const store = transaction.objectStore('lists');
    const index = store.index('projectId');

    const request = index.getAll(projectId);

    request.onsuccess = () => {
        const lists = request.result;
        console.log('All lists for project:', lists);
    };

    request.onerror = (error) => {
        console.error('Error fetching lists for project:', error);
    };
}
// Function to update a list
function updateList(db, listId, updatedListData) {
    const transaction = db.transaction('lists', 'readwrite');
    const store = transaction.objectStore('lists');
    const request = store.get(listId);

    request.onsuccess = () => {
        const list = request.result;
        if (list) {
            // Update the list data
            Object.assign(list, updatedListData);
            const updateRequest = store.put(list);

            updateRequest.onsuccess = () => {
                console.log('List updated successfully');
            };

            updateRequest.onerror = (error) => {
                console.error('Error updating list:', error);
            };
        } else {
            console.error('List not found');
        }
    };

    request.onerror = (error) => {
        console.error('Error fetching list for update:', error);
    };
}
// Function to delete a list from a project
function deleteListFromProject(db, listId) {
    const transaction = db.transaction('lists', 'readwrite');
    const store = transaction.objectStore('lists');
    const request = store.delete(listId);

    request.onsuccess = () => {
        console.log('List deleted successfully');
    };

    request.onerror = (error) => {
        console.error('Error deleting list:', error);
    };
}

//CHARACTERS

// Function to add a character to a project
function addCharacterToProject(db, projectId, characterData) {
    const transaction = db.transaction('characters', 'readwrite');
    const store = transaction.objectStore('characters');
    const request = store.add({ projectId, ...characterData });

    request.onsuccess = () => {
        console.log('New character added to project successfully');
    };

    request.onerror = (error) => {
        console.error('Error adding character to project:', error);
    };
}
// Function to retrieve all characters for a project
function getAllCharactersForProject(db, projectId) {
    const transaction = db.transaction('characters', 'readonly');
    const store = transaction.objectStore('characters');
    const index = store.index('projectId');

    const request = index.getAll(projectId);

    request.onsuccess = () => {
        const characters = request.result;
        console.log('All characters for project:', characters);
        // Handle displaying or using the retrieved characters in your app
    };

    request.onerror = (error) => {
        console.error('Error fetching characters for project:', error);
    };



    request.onerror = (error) => {
        console.error('Error fetching chapter for update:', error);
    };
}
// Function to update a character
function updateCharacter(db, characterId, updatedCharacterData) {
    const transaction = db.transaction('characters', 'readwrite');
    const store = transaction.objectStore('characters');
    const request = store.get(characterId);
  
    request.onsuccess = () => {
      const character = request.result;
      if (character) {
        // Update the character data
        Object.assign(character, updatedCharacterData);
        const updateRequest = store.put(character);
  
        updateRequest.onsuccess = () => {
          console.log('Character updated successfully');
        };
  
        updateRequest.onerror = (error) => {
          console.error('Error updating character:', error);
        };
      } else {
        console.error('Character not found');
      }
    };
  
    request.onerror = (error) => {
      console.error('Error fetching character for update:', error);
    };
  }
// Function to delete a character from a project
function deleteCharacterFromProject(db, projectId, characterId) {
    const transaction = db.transaction('characters', 'readwrite');
    const store = transaction.objectStore('characters');
    const request = store.delete(characterId);

    request.onsuccess = () => {
        console.log('Character deleted from project successfully');
    };

    request.onerror = (error) => {
        console.error('Error deleting character from project:', error);
    };
}

//LOCATIONS

// Function to add a location to a project
function addLocationToProject(db, projectId, locationData) {
    const transaction = db.transaction('locations', 'readwrite');
    const store = transaction.objectStore('locations');
    const request = store.add({ projectId, ...locationData });

    request.onsuccess = () => {
        console.log('New location added to project successfully');
    };

    request.onerror = (error) => {
        console.error('Error adding location to project:', error);
    };
}
// Function to retrieve all locations for a project
function getAllLocationsForProject(db, projectId) {
    const transaction = db.transaction('locations', 'readonly');
    const store = transaction.objectStore('locations');
    const index = store.index('projectId');

    const request = index.getAll(projectId);

    request.onsuccess = () => {
        const locations = request.result;
        console.log('All locations for project:', locations);
        // Handle displaying or using the retrieved locations in your app
    };

    request.onerror = (error) => {
        console.error('Error fetching locations for project:', error);
    };
}
// Function to update a location
function updateLocation(db, locationId, updatedLocationData) {
    const transaction = db.transaction('locations', 'readwrite');
    const store = transaction.objectStore('locations');
    const request = store.get(locationId);

    request.onsuccess = () => {
        const location = request.result;
        if (location) {
            // Update the location data
            Object.assign(location, updatedLocationData);
            const updateRequest = store.put(location);

            updateRequest.onsuccess = () => {
                console.log('Location updated successfully');
            };

            updateRequest.onerror = (error) => {
                console.error('Error updating location:', error);
            };
        } else {
            console.error('Location not found');
        }
    };

    request.onerror = (error) => {
        console.error('Error fetching location for update:', error);
    };
}
// Function to delete a location from a project
function deleteLocationFromProject(db, projectId, locationId) {
    const transaction = db.transaction('locations', 'readwrite');
    const store = transaction.objectStore('locations');
    const request = store.delete(locationId);

    request.onsuccess = () => {
        console.log('Location deleted from project successfully');
    };

    request.onerror = (error) => {
        console.error('Error deleting location from project:', error);
    };
}

//CHAPTERS

// Function to add a chapter to a project
function addChapterToProject(db, projectId, chapterData) {
    const transaction = db.transaction('chapters', 'readwrite');
    const store = transaction.objectStore('chapters');
    const request = store.add({ projectId, ...chapterData });

    request.onsuccess = () => {
        console.log('New chapter added to project successfully');
    };

    request.onerror = (error) => {
        console.error('Error adding chapter to project:', error);
    };
}
// Function to retrieve all chapters for a project
function getAllChaptersForProject(db, projectId) {
    const transaction = db.transaction('chapters', 'readonly');
    const store = transaction.objectStore('chapters');
    const index = store.index('projectId');

    const request = index.getAll(projectId);

    request.onsuccess = () => {
        const chapters = request.result;
        console.log('All chapters for project:', chapters);
        // Handle displaying or using the retrieved chapters in your app
    };

    request.onerror = (error) => {
        console.error('Error fetching chapters for project:', error);
    };
}
// Function to update a chapter
function updateChapter(db, chapterId, updatedChapterData) {
    const transaction = db.transaction('chapters', 'readwrite');
    const store = transaction.objectStore('chapters');
    const request = store.get(chapterId);

    request.onsuccess = () => {
        const chapter = request.result;
        if (chapter) {
            // Update the chapter data
            Object.assign(chapter, updatedChapterData);
            const updateRequest = store.put(chapter);

            updateRequest.onsuccess = () => {
                console.log('Chapter updated successfully');
            };

            updateRequest.onerror = (error) => {
                console.error('Error updating chapter:', error);
            };
        } else {
            console.error('Chapter not found');
        }
    };

    request.onerror = (error) => {
        console.error('Error fetching chapter for update:', error);
    };
}
// Function to delete a chapter from a project
function deleteChapterFromProject(db, projectId, chapterId) {
    const transaction = db.transaction('chapters', 'readwrite');
    const store = transaction.objectStore('chapters');
    const request = store.delete(chapterId);

    request.onsuccess = () => {
        console.log('Chapter deleted from project successfully');
    };

    request.onerror = (error) => {
        console.error('Error deleting chapter from project:', error);
    };
}

// Export CRUD functions
export {
    addProject,
    getAllProjects,
    updateProject,
    deleteProject,
    addListToProject,
    getAllListsForProject,
    updateList,
    deleteListFromProject,
    addCharacterToProject,
    getAllCharactersForProject,
    updateCharacter,
    deleteCharacterFromProject,
    addLocationToProject,
    getAllLocationsForProject,
    updateLocation,
    deleteLocationFromProject,
    addChapterToProject,
    getAllChaptersForProject,
    updateChapter,
    deleteChapterFromProject
};