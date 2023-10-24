// Import functions from firebase file
import { 
  addShoppingList, 
  addShoppingListItem, 
  deleteShoppingList,
  deleteShoppingListCategory, 
  deleteShoppingListItem, 
  editShoppingListItem, 
  getMyShoppingLists, 
  getShoppingListitems 
} from "./firebase.js"

// Get reference to UL for shopping 
const ulShoppingList = document.getElementById('shopping-lists')
const formContainer = document.getElementById('form-container')
const btnCreateListForm = document.getElementById('btn-create-list-form')
const btnAddItemForm = document.getElementById('btn-add-item-form')
const btnDeleteList = document.getElementById('list-name-delete-btn')

getLists()

// Adding event listener to add-new-list button
btnCreateListForm.addEventListener('click', () => {
  getForm('new-list-form')
})

// Adding event listener to show-add-item-form button
btnAddItemForm.addEventListener('click', () => {
  getForm('add-item-form')
})

// Adding event listener to show-add-item-form button
btnDeleteList.addEventListener('click', () => {
  if(confirm('Delete Shopping List?')){
    deleteList(btnDeleteList.getAttribute('data-listId'))
  }
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
      // change display type to flex
      child.style.display = 'flex'
    }
  })

  // Get all cancel buttons and add event listeners to them
  const btnCancelForms = document.querySelectorAll('.btn-cancel-form')
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
    const listId = document.getElementById('add-item-list').value
    const categoryId = document.getElementById('add-item-category').value.trim()
    const itemName = document.getElementById('add-item-name').value.trim()
    const itemNeed = document.getElementById('add-item-need').value.trim()
    const itemHave = document.getElementById('add-item-have').value.trim()
    const itemCost = document.getElementById('add-item-cost').value.trim()

    // Calling add function
    addItem(listId, categoryId, itemName, itemNeed, itemHave, itemCost)
})

const editItemForm = document.getElementById('edit-item-form')
editItemForm.addEventListener('submit', (event) => {
    event.preventDefault()
    // Get list values 
    const listId = document.getElementById('edit-item-list').value
    const categoryId = document.getElementById('edit-item-category').value
    const itemName = document.getElementById('edit-item-name').value
    const itemNeed = document.getElementById('edit-item-need').value.trim()
    const itemHave = document.getElementById('edit-item-have').value.trim()
    const itemCost = document.getElementById('edit-item-cost').value.trim()

    // Calling add function
    editItem(listId, categoryId, itemName, itemNeed, itemHave, itemCost)
})

// Calls firebase function to add list when form is submitted
async function addList(listName) {
  await addShoppingList(listName)
  document.getElementById('form-container').style.display = 'none'
  getLists()
}

// Calls firebase function to add list when form is submitted
async function addItem(listId, categoryId, itemName, itemNeed, itemHave, itemCost) {
    // Call firebase function to add new item to specific shopping list
  await addShoppingListItem(listId, categoryId, itemName, itemNeed, itemHave, itemCost)

  // After item is added hide form
  document.getElementById('form-container').style.display = 'none'
  document.getElementById('add-item-form').style.display = 'none'
  displayShoppingListItems(listId)
}

// Calls firebase function to delete category from shopping list
async function deleteCategory(listId, categoryId) {
  await deleteShoppingListCategory(listId, categoryId)
  displayShoppingListItems(listId)
}

// Calls firebase function to delete an item from a category
async function deleteItem(listId, categoryId, itemName) {
  await deleteShoppingListItem(listId, categoryId, itemName)
  displayShoppingListItems(listId)
}

// Calls firebase function to delete a shopping list
async function deleteList(listId) {
  await deleteShoppingList(listId)

  // When list is deleted reload list of shopping lists
  document.getElementById('shopping-list-view').style.display = "none"
  getLists()
}

// Calls firebase function to edit an item already in the list.
async function editItem(listId, categoryId, itemName, itemNeed, itemHave, itemCost) {
  // Call firebase funcion to edit item
  await editShoppingListItem(listId, categoryId, itemName, itemNeed, itemHave, itemCost)

  // After item is added hide form
  document.getElementById('form-container').style.display = 'none'
  document.getElementById('edit-item-form').style.display = 'none'
  displayShoppingListItems(listId)
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
    // Add event listener to list button
    button.addEventListener('click', () => {
      // When button is clicked show list
      document.getElementById('shopping-list-view').style.display = "flex"

      // Change add item form hidden input value
      document.getElementById('add-item-list').value = doc.id 
      document.getElementById('edit-item-list').value = doc.id 

      // Changing name of displayed list
      document.getElementById('list-name-header').innerText = doc.data().name
      // Change delete button attribute value
      document.getElementById('list-name-delete-btn').setAttribute("data-listId", doc.id);


      // Display list items
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
  const categoriesQuerySnapshot = await getShoppingListitems(docId)

  // Grand total
  let GRANDTOTAL = 0

  // Display items in list element
  const itemsList = document.getElementById('list-view-categories')
  itemsList.innerHTML = ""

  //  Loop through each category and create a table on each
  categoriesQuerySnapshot.forEach( category => {
    // Create a list element 
    const newCategory = document.createElement('li')
    // Add the table to the innerHTML of the list element
    const tableElement = document.createElement('table')
    const theadElement = document.createElement('thead')
    const tbodyElement = document.createElement('tbody')

    // Create button for deleting a category
    const categoryHeaderDiv = document.createElement('div')
    categoryHeaderDiv.classList.add('category-header')
    const deleteCategoryButton = document.createElement('button')
    deleteCategoryButton.innerText = 'Delete'
    // Add delete functionality
    deleteCategoryButton.addEventListener('click', () => {
      if(confirm("Delete Category?")) {
        // Delete category when confirmation happens
        const listId = document.getElementById('edit-item-list').value 
        deleteCategory(listId, category.id)
      }
    })
    categoryHeaderDiv.appendChild(deleteCategoryButton)

    newCategory.innerHTML = `<h2 class="category-header">${category.id}</h2>`
    newCategory.appendChild(categoryHeaderDiv)
    theadElement.innerHTML = `
    <tr style='font-size:12px; height: 20px; color:#858585'>
        <th style='width: 40%'>Name</th>
        <th>Need</th>
        <th>Have</th>
        <th>Cost</th>
        <th>Total</th>
        <th style="text-align:center; width: 50px;">Edit</th>
        <th style="text-align:center; width: 50px;">Delete</th>
    </tr>
    `

    // Loop through each item and add a row for the item
    let totalCategoryCost = 0
    let unitCost = 0
    
    // Loop through each category field
    const data = category.data()
    Object.keys(data).forEach(key => {
      // Calculating the cost of the items. If have more items than need set 0
      const x = data[key].have > data[key].need ? 0 : parseInt(data[key].need) - parseInt(data[key].have)
      unitCost = parseInt(data[key].cost) * x
      totalCategoryCost += unitCost

      // Create row for each item
      const itemRow = document.createElement('tr')
      itemRow.innerHTML = `
      <tr>
        <td>${key}</td>
        <td>${data[key].need}</td>
        <td>${data[key].have}</td>
        <td>${data[key].cost}</td>
        <td>${unitCost}</td>
        <td class="editColumn"
          data-item-category="${category.id}" 
          data-item-name="${key}" 
          data-item-need="${data[key].need}" 
          data-item-have="${data[key].have}" 
          data-item-cost="${data[key].cost}">
        </td>
        <td class="deleteColumn" data-item-category="${category.id}" data-item-name="${key}"></td>
      </tr>`

      // Adding row HTML to body
      tbodyElement.appendChild(itemRow)
    })

    // Add final row to table 
    tbodyElement.innerHTML += `
      <tr class="bottom-row">
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
    const editButton = document.createElement('input')
    editButton.type = "image"
    editButton.src = "../images/edit.png"
    editButton.classList.add('BtnImg')
    editButton.addEventListener('click', () => {
      // Set form hidden input id to selected item
      document.getElementById('edit-item-category').value = col.getAttribute('data-item-category')
      document.getElementById('edit-item-name').value = col.getAttribute('data-item-name')

      // Setting edit header
      document.getElementById('edit-item-name-header-category').innerText = col.getAttribute('data-item-category')
      document.getElementById('edit-item-name-header-name').innerText = col.getAttribute('data-item-name')
      
      // Initialize all input values
      document.getElementById('edit-item-need').value = col.getAttribute('data-item-need')
      document.getElementById('edit-item-cost').value = col.getAttribute('data-item-cost')
      document.getElementById('edit-item-have').value = col.getAttribute('data-item-have')

      getForm('edit-item-form')
    })
    col.appendChild(editButton)
  })

  // Get all delete button columns
  document.querySelectorAll(".deleteColumn").forEach(col => {
    // Create button
    const deleteButton = document.createElement('input')
    deleteButton.type = "image"
    deleteButton.src = "../images/delete.png"
    deleteButton.classList.add('BtnImg')
    deleteButton.addEventListener('click', () => {
      // When this button is clicked the item should be deleted
      const listId = document.getElementById('edit-item-list').value 
      const categoryId = col.getAttribute('data-item-category')
      const itemName = col.getAttribute('data-item-name')

      // Calling firebase function to perform delete functionality on database
      deleteItem(listId, categoryId, itemName)
    })
    col.appendChild(deleteButton)
  })

  document.getElementById('total-cost').innerText = `K${GRANDTOTAL}`
}