const UNCOMPLETED_LIST_BOOKSHELF_ID = "books";
const COMPLETED_LIST_BOOKSHELF_ID = "completed-books";
const BOOKSHELF_ITEMID = "itemId";
 
function makeBookshelf(data, author, year, isCompleted) {
 
    const textTitle = document.createElement("h2");
    textTitle.innerText = data;
 
    const textAuthor = document.createElement("h4");
    textAuthor.innerText = author;
 
    const textYear = document.createElement("p");
    textYear.innerText = year;
 
    const textContainer = document.createElement("div");
    textContainer.classList.add("item", "shadow")
    textContainer.append(textTitle, textAuthor, textYear);
 
    const container = document.createElement("div");
    container.classList.add("item", "shadow")
    container.append(textContainer);
 
    if (isCompleted) {
        container.append(
            createUndoButton(),
            createTrashButton()
        );
    } else {
        container.append(
            createCheckButton(),
        );
    }
 
    return container;
}
 
function createUndoButton() {
    return createButton("undo-button", function (event) {
        undoTitleFromCompleted(event.target.parentElement);
    });
}
 
function createTrashButton() {
    return createButton("trash-button", function (event) {
        removeTitleFromCompleted(event.target.parentElement);
    });
}
 
function createCheckButton() {
    return createButton("check-button", function (event) {
        addTitleToCompleted(event.target.parentElement);
    });
}
 
function createButton(buttonTypeClass, eventListener) {
    const button = document.createElement("button");
    button.classList.add(buttonTypeClass);
    button.addEventListener("click", function (event) {
        eventListener(event);
        event.stopPropagation();
    });
    return button;
}
 
function addBookshelf() {
    const uncompletedBOOKSHELFList = document.getElementById(UNCOMPLETED_LIST_BOOKSHELF_ID);
    const textBookshelf = document.getElementById("title").value;
    const textAuthor = document.getElementById("date").value;
    const year = document.getElementById("year").value;
 
    const bookshelf = makeBookshelf(textBookshelf, textAuthor, year, false);
    const bookshelfObject = composeBookshelfObject(textBookshelf, textAuthor, year, false);
 
    bookshelf[BOOKSHELF_ITEMID] = bookshelfObject.id;
    books.push(bookshelfObject);
 
    uncompletedBOOKSHELFList.append(bookshelf);
    updateDataToStorage();
}
 
function addTitleToCompleted(titleElement) {
    const listCompleted = document.getElementById(COMPLETED_LIST_BOOKSHELF_ID);
    const titleTitle = titleElement.querySelector(".inner > h2").innerText;
    const titleAuthor = titleElement.querySelector(".inner > h4").innerText;
    const titleYear = titleElement.querySelector(".inner > p").innerText;

    const newBookshelf = makeBookshelf(titleTitle, titleAuthor, titleYear, true);
    

    const bookshelf = findBookshelf(titleElement[BOOKSHELF_ITEMID]);
    bookshelf.isCompleted = true;
    newBookshelf[BOOKSHELF_ITEMID] = bookshelf.id;

    listCompleted.append(newBookshelf);
    titleElement.remove();

    updateDataToStorage();
}

function removeTitleFromCompleted(titleElement) {

    const bookshelfPosition = findBookshelfIndex(titleElement[BOOKSHELF_ITEMID]);
    books.splice(bookshelfPosition, 1);

    titleElement.remove();
    updateDataToStorage();
}

function undoTitleFromCompleted(titleElement) {
    const listUncompleted = document.getElementById(UNCOMPLETED_LIST_BOOKSHELF_ID);
    const titleTitle = titleElement.querySelector(".inner > h2").innerText;
    const titleAuthor = titleElement.querySelector(".inner > h4").innerText;
    const titleYear = titleElement.querySelector(".inner > p").innerText;
    
    const newBookshelf = makeBookshelf(titleTitle, titleAuthor, titleYear, false);

    const bookshelf = findBookshelf(titleElement[BOOKSHELF_ITEMID]);
    bookshelf.isCompleted = false;
    newBookshelf[BOOKSHELF_ITEMID] = bookshelf.id;

    listUncompleted.append(newBookshelf);
    titleElement.remove();
    
    updateDataToStorage();
}

function refreshDataFromBooks() {
    const listUncompleted = document.getElementById(UNCOMPLETED_LIST_BOOKSHELF_ID);
    let listCompleted = document.getElementById(COMPLETED_LIST_BOOKSHELF_ID);

    for(bookshelf of books){
        const newBookshelf = makeBookshelf(bookshelf.title, bookshelf.author, bookshelf.year, bookshelf.isCompleted);
        newBookshelf[BOOKSHELF_ITEMID] = bookshelf.id;

        if(bookshelf.isCompleted){
            listCompleted.append(newBookshelf);
        } else {
            listUncompleted.append(newBookshelf);
        }
    }
}