// Function to add a new entry (Create operation)
function addEntry(db, storeName, data) {
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.add(data);
  
    request.onsuccess = () => {
      console.log('New entry added successfully');
    };
  
    request.onerror = (error) => {
      console.error('Error adding entry:', error);
    };
  }
  
  // Function to retrieve all entries (Read operation)
  function getAllEntries(db, storeName) {
    const transaction = db.transaction(storeName, 'readonly');
    const store = transaction.objectStore(storeName);
    const request = store.getAll();
  
    request.onsuccess = () => {
      const entries = request.result;
      console.log('All entries:', entries);
      // Handle displaying or using the retrieved entries 
    };
  
    request.onerror = (error) => {
      console.error('Error fetching entries:', error);
    };
  }
  
  // Function to update an existing entry (Update operation)
  function updateEntry(db, storeName, id, newData) {
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.get(id);
  
    request.onsuccess = () => {
      const data = request.result;
      if (data) {
        // Update the data
        Object.assign(data, newData);
        const updateRequest = store.put(data);
  
        updateRequest.onsuccess = () => {
          console.log('Entry updated successfully');
        };
  
        updateRequest.onerror = (error) => {
          console.error('Error updating entry:', error);
        };
      } else {
        console.error('Entry not found');
      }
    };
  
    request.onerror = (error) => {
      console.error('Error fetching entry for update:', error);
    };
  }
  
  // Function to delete an entry (Delete operation)
  function deleteEntry(db, storeName, id) {
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.delete(id);
  
    request.onsuccess = () => {
      console.log('Entry deleted successfully');
    };
  
    request.onerror = (error) => {
      console.error('Error deleting entry:', error);
    };
  }
  
  // Usage examples:  
  // Adding a new entry
  //const newChapter = {
    //title: 'Chapter 1',
    //content: 'Once upon a time...',
    //characters: ['Sarah', 'James'],
    //locations: ['Forest', 'Castle'],
    // Other relevant data
  //};
  
  //addEntry(db, 'books', newChapter);
  
  // Retrieving all entries
  //getAllEntries(db, 'books');
  
  // Updating an existing entry (assuming '2' is the ID of the entry to update)
  //const updatedChapterData = {
    //content: 'Updated content...',
    // Update other fields as needed
  //};
  
  //updateEntry(db, 'books', 2, updatedChapterData);
  
  // Deleting an entry with ID '3'
  //deleteEntry(db, 'books', 3);

  export { addEntry, getAllEntries, updateEntry, deleteEntry };