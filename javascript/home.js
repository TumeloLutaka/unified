// Import functions from firebase file
import { 
  addShoppingList, 
  addShoppingListItem, editItem, getMyShoppingLists, getShoppingListitems 
} from "./firebase.js"

// Get reference to UL for shopping 
const ulShoppingList = document.getElementById('shopping-lists')
const formContainer = document.getElementById('form-container')
const btnCreateListForm = document.getElementById('btn-create-list-form')
const btnAddItemForm = document.getElementById('btn-add-item-form')

getLists()

// Adding event listener to add-new-list button
btnCreateListForm.addEventListener('click', () => {
  getForm('new-list-form')
})

// Adding event listener to show-add-item-form button
btnAddItemForm.addEventListener('click', () => {
  getForm('add-item-form')
})

// Function used to display selected form when form container is displayed
function getForm(formId) {
  // Change display of form container to block so it appears
  formContainer.style.display = 'block'
  // Get all form elements in form container
  const formContainerChildren = formContainer.querySelectorAll('form')
  formContainerChildren.forEach( child => {
    child.style.display = 'none'
    
    if(child.id === formId){
      console.log('Found')
      // change display type to flex
      child.style.display = 'flex'
    }
  })

  // Get all cancel buttons and add event listeners to them
  const btnCancelForms = document.querySelectorAll('.btn-cancel-form')
  // console.log(btnCancelForms)
  btnCancelForms.forEach( btn => {
    btn.addEventListener('click', () => {
      // Close form container when any of the button are pressed.
      formContainer.style.display = 'none'
    })
  })
}


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
    const itemCategory = document.getElementById('add-item-category').value.trim()

    // Calling add function
    addItem(itemName, itemNeed, itemHave, itemCost, itemCategory)
})

const editItemForm = document.getElementById('edit-item-form')
editItemForm.addEventListener('submit', (event) => {
    event.preventDefault()
    // Get list values
    const itemName = document.getElementById('edit-item-name').value.trim()
    const itemNeed = document.getElementById('edit-item-need').value.trim()
    const itemHave = document.getElementById('edit-item-have').value.trim()
    const itemCost = document.getElementById('edit-item-cost').value.trim()
    const itemCategory = document.getElementById('edit-item-category').value.trim()

    // Calling add function
    editItem()
})

// Calls firebase function to add list when form is submitted
async function addItem(itemName, itemNeed, itemHave, itemCost, itemCategory) {
    // Call firebase function to add new item to specific shopping list
  await addShoppingListItem(itemName, itemNeed, itemHave, itemCost, itemCategory)
  document.getElementById('form-container').style.display = 'none'
  document.getElementById('add-item-form').style.display = 'none'
  displayShoppingListItems(localStorage.getItem('unified-current-list'))
}

// Calls firebase function to add list when form is submitted
async function addList(listName) {
  await addShoppingList(listName)
  document.getElementById('form-container').style.display = 'none'
  getLists()
}

// Calls firebase function to edit an item already in the list.
async function editItem() {
  // Call firebase funcion
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
      // When button is clicked show list
      document.getElementById('shopping-list-view').style.display = "flex"

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
  const categories = await getShoppingListitems(docId)

  // Grand total
  let GRANDTOTAL = 0

  // Display items in list element
  const itemsList = document.getElementById('list-view-categories')
  itemsList.innerHTML = ""

  //  Loop through each category and create a table on each
  categories.forEach( category => {
    // Create a list element 
    const newCategory = document.createElement('li')
    // Add the table to the innerHTML of the list element
    const tableElement = document.createElement('table')
    const theadElement = document.createElement('thead')
    const tbodyElement = document.createElement('tbody')

    theadElement.innerHTML = `
    <h2>${category.name}</h2>
    <tr style='font-size:12px; color:#858585'>
        <th style='width: 40%'>Name</th>
        <th>Need</th>
        <th>Have</th>
        <th>Cost</th>
        <th>Total</th>
        <th style="width: 50px;">Edit</th>
        <th style="width: 50px;">Delete</th>
    </tr>
    `

    // Loop through each item and add a row for the item
    let totalCategoryCost = 0
    let unitCost = 0
    category.items.forEach( item => {
      // Calculating the cost of the items. If have more items than need set 0
      const x = item.have > item.need ? 0 : parseInt(item.need) - parseInt(item.have)
      unitCost = parseInt(item.cost) * x
      totalCategoryCost += unitCost

      // Create row for each item
      const itemRow = document.createElement('tr')
      itemRow.innerHTML = `
      <tr>
        <td>${item.name}</td>
        <td>${item.need}</td>
        <td>${item.have}</td>
        <td>${item.cost}</td>
        <td>${unitCost}</td>
        <td class="editColumn"></td>
        <td class="deleteColumn"></td>
      </tr>`

      // Adding row HTML to body
      tbodyElement.appendChild(itemRow)
    })

    // Add final row to table 
    tbodyElement.innerHTML += `
      <tr>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td>${totalCategoryCost}</td>
        <td></td>
        <td></td>
      </tr>`

      GRANDTOTAL+=totalCategoryCost

    tableElement.appendChild(theadElement)
    tableElement.appendChild(tbodyElement)
    newCategory.appendChild(tableElement)

    // Adding category to the innerHTML of the list element
    itemsList.appendChild(newCategory)
  })

  // Get all edit button columns
  document.querySelectorAll(".editColumn").forEach(col => {
    // Create button
    const editButton = document.createElement('button')
    editButton.innerHTML = "edit"
    editButton.addEventListener('click', () => {
      // Set form hidden input id to selected item

      getForm('edit-item-form')
    })
    col.appendChild(editButton)
  })

  // Get all delete button columns
  document.querySelectorAll(".deleteColumn").forEach(col => {
    // Create button
    const deleteButton = document.createElement('button')
    deleteButton.innerHTML = "delete"
    deleteButton.addEventListener('click', () => {
      getForm('edit-item-form')
    })
    col.appendChild(deleteButton)
  })

  document.getElementById('total-cost').innerText = `K${GRANDTOTAL}`
}