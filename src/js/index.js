let db = null;
let objectStore = null;
import { guid } from "./uid.js";
// console.log("Generated unique id:", guid());

const IDB = () => {
    //? Make request to create/open indexedDB.
    let indexed_DB = indexedDB.open("booksDB", 2);
    // console.log("Indexed DB:", indexed_DB);
    
    indexed_DB.addEventListener("error", (err) => {
        console.warn("Error", err);
    })

    indexed_DB.addEventListener("success", (ev) => {
        db = ev.target.result;
        console.log("Success:", db);

        let transaction = makeTransaction("bookStore", "readwrite");
        transaction.oncomplete = (ev) => {
            console.log(ev);
        }

        let book2 = addBook( guid(), "Rainy Dayz", "Abdul Mahl", false );

        let store = transaction.objectStore("bookStore");
        // let addToStoreRequest = store.add(book2);

        addToStoreRequest.addEventListener("success", (ev) => {
            console.log("Success in adding object", ev);
        })

        addToStoreRequest.addEventListener("error", (err) => {
            console.log("Erorr", err)
        })
    })

    indexed_DB.addEventListener("upgradeneeded", (ev) => {
        db = ev.target.result;
        let oldVersion = ev.oldVersion;
        let newVersion = ev.newVersion || db.version;
        console.log("Updated from version", oldVersion, "to version", newVersion);
        console.log("Upgrade:", db);

        if(!db.objectStoreNames.contains("bookStore")) {
            objectStore = db.createObjectStore("bookStore", {
                keyPath: "id"
            });
        }
    })

    indexed_DB.addEventListener("submit", (ev) => {

    })
}

function makeTransaction(storeName, mode) {
    let transaction = db.transaction(storeName, mode);
    transaction.onerror = (err) => {
        console.warn(err);
    }
    return transaction;
}

function addBook(id, bookname, author, isAvailable) {
    let obj = {
        id: id,
        bookname: bookname,
        author: author,
        isAvailable: isAvailable
    }
    return obj;
}

IDB();