// Import functions from firebase file
import { addShoppingList, addShoppingListItem, getMyShoppingLists, getShoppingListitems } from "./firebase.js"

// Get reference to UL for shopping 
const ulShoppingList = document.getElementById('shopping-lists')
getLists()

// Adding event listener to show-add-item-form button
document.getElementById('show-add-item-form').addEventListener('click', () => {
  // When this button is clicked, show add new list and hide add new button
  document.getElementById('show-add-item-form').style.display = "none" 
  document.getElementById('add-item-form').style.display = "block"
})

// Adding event listener to add-new button
document.getElementById('add-new').addEventListener('click', () => {
  document.getElementById('new-form-container').style.display = 'block'
})

// Adding event listener to cancel new list button
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
    addList(listName)
})

// Getting reference and adding event listener to shopping list items list form
const addItemForm = document.getElementById('add-item-form')
addItemForm.addEventListener('submit', (event) => {
    event.preventDefault()
    // Get list values
    const itemName = document.getElementById('add-item-name').value.trim()
    const itemNeed = document.getElementById('add-item-need').value.trim()
    const itemHave = document.getElementById('add-item-have').value.trim()
    const itemCost = document.getElementById('add-item-cost').value.trim()

    // Calling add function
    addItem(itemName, itemNeed, itemHave, itemCost)
})

// Calls firebase function to add list when form is submitted
async function addItem(itemName, itemNeed, itemHave, itemCost) {
    // Call firebase function to add new item to specific shopping list
  await addShoppingListItem(itemName, itemNeed, itemHave, itemCost)
  document.getElementById('add-item-form').style.display = 'none'
  document.getElementById('show-add-item-form').style.display = "block" 
  displayShoppingListItems(localStorage.getItem('unified-current-list'))
}

// Calls firebase function to add list when form is submitted
async function addList(listName) {
  await addShoppingList(listName)
  document.getElementById('new-form-container').style.display = 'none'
  getLists()
}

// Retrieves shopping lists from firestore database and creates buttons for them in side bar.
async function getLists() {
  // Calling firebase funciton to get shopping lists
  const shoppingLists = await getMyShoppingLists()

  // Clear list
  ulShoppingList.innerHTML = ""
  shoppingLists.forEach((doc) => {
    // Create a button element and set its innerHTML and click functionality
    const button = document.createElement('button');
    button.classList.add("shopping-list")
    button.innerHTML = `${doc.data().name}`;
    button.addEventListener('click', () => {
      // When button is clicked
      // Set the current local storage value of the list.
      localStorage.setItem('unified-current-list', doc.id)
      document.getElementById('list-name-header').innerText = doc.data().name
      displayShoppingListItems(doc.id)
    });

    const item = document.createElement('li')
    item.appendChild(button)
    ulShoppingList.appendChild(item)
  });

}

// Called when user clicks on a shopping list or adds new item to shopping list.
async function displayShoppingListItems(docId) {
  // Getting all items belonging to this shopping list.
  const items = await getShoppingListitems(docId)

  // Declaring variable for storing total
  let TOTAL = 0

  // Display items in list element
  const itemsList = document.getElementById('table-body')
  itemsList.innerHTML = ""
  items.forEach(item => {
    const newRow = document.createElement('tr')
    let cost = parseInt(item.cost)
    let need = parseInt(item.need)
    let have = parseInt(item.have)
    
    let totalCost = (need - have) * cost
    console.log(totalCost, TOTAL)
    TOTAL += totalCost
    newRow.innerHTML = `
      <td>${item.name}</td>
      <td>${item.need}</td>
      <td>${item.have}</td>
      <td>${item.cost}</td>
      <td>${totalCost}</td>
      <td><button>edit</button></td>
      <td"><button>delete</button></td>
    `
    itemsList.append(newRow)
  })

  document.getElementById('total-cost').innerText = `K${TOTAL}`
}