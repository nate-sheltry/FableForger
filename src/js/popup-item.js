
function setUpPopUp(){
    const elements = document.querySelectorAll('.item-card');
    elements.forEach(element => {
        deleteConfirmation(element.querySelector('.item-delete-btn'));
        closeElement(element.querySelector('.item-exit-btn'));
        saveData(element.querySelector('.item-save-btn'));
    })
}

function getData(element){
    const title = element.querySelector('.item-header').textContent;
    const description = element.querySelector('.item-description').textContent;
    return [title, description]
}

function saveData(element){
    element.addEventListener('pointerdown', (e)=>{
        const [title, description] = getData(e.target.parentElement);

        //overwrite data in database.

    });
}


function closeElement(element){
    element.addEventListener('pointerdown', (e)=>{
        const [title, description] = getData(e.target.parentElement);

        // dbItem = item in database

        // if(title != dbItem.title || description != dbItem.description){
        //     const confirmation = confirm(`Changes made to the ${e.target.parentElement.querySelector('.item-header').textContent} item will not be saved, are you sure?`);
        //     if(!confirmation) return
        // }
        
        e.target.parentElement.remove();
    })

}

function deleteConfirmation(element){
    element.addEventListener('pointerdown', (e)=>{
        //If we implement user preferences, wrap the confirmation inside the if statement.
        // if(userConfirmDelete == true){}

        const confirmation = confirm(`Are you sure you would like to delete the ${e.target.parentElement.querySelector('.item-header').textContent} item?`);
        if(!confirmation) return

        //Delete Item From DB Code Here

        //Remove Element from Document.
        e.target.parentElement.remove();
    })
}

setUpPopUp();