// Import functions from firebase file
import { addShoppingList, addShoppingListItem, getMyShoppingLists, getShoppingListitems } from "./firebase.js"

getLists()

// Adding event listener to add-new button
document.getElementById('add-new').addEventListener('click', () => {
  document.getElementById('new-form-container').style.display = 'block'
})

document.getElementById('new-list-cancel-btn').addEventListener('click', () => {
  document.getElementById('new-form-container').style.display = 'none'
})

// Getting reference and adding event listener to new list form
const addListForm = document.getElementById('new-list-form')
addListForm.addEventListener('submit', (event) => {
    event.preventDefault()
    // Get list name value
    const listName = document.getElementById('list-name').value.trim()
    // Call firebase function to add new list
    addShoppingList(listName, ulShoppingList)
    document.getElementById('new-form-container').style.display = 'none'
})

// Getting reference and adding event listener to shopping list items list form
const addItemForm = document.getElementById('add-item-form')
addItemForm.addEventListener('submit', (event) => {
    event.preventDefault()
    // Get list name value
    const itemName = document.getElementById('add-item').value.trim()
    // Call firebase function to add new item to specific shopping list
    addShoppingListItem(itemName)
})

// Retrieves shopping lists from firestore database and creates buttons for them in side bar.
async function getLists() {
  // Get reference to UL for shopping 
  const ulShoppingList = document.getElementById('shopping-lists')
  // Calling firebase funciton to get shopping lists
  const shoppingLists = await getMyShoppingLists(ulShoppingList)

  // Clear list
  ulShoppingList.innerHTML = ""
  shoppingLists.forEach((doc) => {
    // Create a button element and set its innerHTML and click functionality
    const button = document.createElement('button');
    button.innerHTML = `${doc.data().name}`;
    button.addEventListener('click', () => {
      displayShoppingListItems(doc.id)
    });

    const item = document.createElement('li')
    item.appendChild(button)
    ulShoppingList.appendChild(item)
  });

}

// Called when user clicks on a shopping list
async function displayShoppingListItems(docId) {
  const items = await getShoppingListitems(docId)

  // Display items in list element
  const itemsList = document.getElementById('item-list')
  itemsList.innerHTML = ""
  items.forEach(item => {
    itemsList.append(document.createElement('h1').innerText = item)
  })

}