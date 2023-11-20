// Create a variable for the database using API/s, check through all
// the different API/s incase the user/s are using a different browser.
const indexed_DB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB
|| window.shimIndexedDB;

// Make a request to Open a database, if that database doesn't exist then create one.
const request = indexed_DB.open("fableForgerDb", 1);

//  Check for any errors, if there are any handle them
// using the indexedDB onerror method.
request.onerror = (event) => {
    console.error(`An error occured while loading the ${request}.`);
    console.error(event);
}

// Call the onupgradeneeded method to handle the 
// structure of our database.
request.onupgradeneeded = () => {
    const db = request.result;
    // Create storage for the database.
    const store = db.createObjectStore("books", { keyPath: "id", autoIncrement: true });
    store.createIndex("books_name", ["name"], { unique: true });
    store.createIndex("name_author_about", ["name", "author", "about"], { unique: true });
};

// Handle successful database opening.
request.onsuccess = () => {
    const db = request.result;
    const transaction = db.transaction("books", "readwrite");

    const store = transaction.objectStore("books");
    const bookDatabaseQuery = store.getAll();

    // This part is where we add data to our database.
    store.put({ id: 1, name: "The Alchemist", author: "Paulo Coelho", about: "Mysticism" });
    store.put({ id: 2, name: "The Da Vinci Code", author: "Dan Brown", about: "Mystery"});
    store.put({ id: 3, name: "The Hobbit", author: "J.R.R Tolkien", about: "Fantasy"});
    store.put({ id: 4, name: "Harry Potter and the Deathly Hallows", author: "J.K Rowling", about: "Fantasy"});

    bookDatabaseQuery.onsuccess = () => {
        bookDatabaseQuery.result.forEach(book => {
            // console.log(book.name);
            const listBar = document.querySelector(".list-bar");
            const ul = document.createElement("ul");
            ul.innerHTML = `<li><a class="bookname" href="#">${book.name}</a></li>`;

            listBar.append(ul);
        });

        console.log(`Database: `, bookDatabaseQuery.result);
    }

    transaction.oncomplete = () => {
        db.close();
    }
}