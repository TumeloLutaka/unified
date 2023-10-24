// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";
import { getFirestore, collection, doc, addDoc, setDoc, getDocs, updateDoc, deleteDoc, deleteField } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyB6x6gS5mCYJTegzK5fkokQ1mKYmiEhWBU",
    authDomain: "unified-f47b3.firebaseapp.com",
    projectId: "unified-f47b3",
    storageBucket: "unified-f47b3.appspot.com",
    messagingSenderId: "847647684132",
    appId: "1:847647684132:web:a88853032cc26512598ab1"
  };
  
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app)

  // Login functionalit
function signIn(email, password){
  // Firebase authentication code.
  const auth = getAuth(app);
  signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
      // Signed in 
      localStorage.setItem('unified-uid', userCredential.user.uid)
      const user = userCredential.user;
      window.location.href = "home.html";
  })
  .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
  });
}

// Used to add a shopping list to the firestore databse shopping list collection
async function addShoppingList(listName) {
  const newList = await addDoc(
    collection(db, "shopping-lists"), 
    {
      name: listName,
      users: 
      [
        localStorage.getItem('unified-uid')
      ], 
  })
  
  // Adding the categories sub collection to the new list.
  await setDoc(
    doc(db, "shopping-lists", newList.id, "categories", "General"), 
    {}
  )
}

// Used to add a shopping list to the firestore databse shopping list collection
async function addShoppingListItem(listId, categoryId, itemName, itemNeed, itemHave, itemCost) {
  // Reference the specific document category subcollection to add list item to 
  const data = {
    [itemName]: 
    {
      need: itemNeed,
      have: itemHave,
      cost: itemCost
    }
  }

  console.log("working")
  await setDoc(
    doc(db, 'shopping-lists', listId, "categories", categoryId),
    data,
    {merge: true}
  )
}

async function deleteShoppingList() {

}

// calling firebase to remove a document from categories subcollection
async function deleteShoppingListCategory(listId, categoryId) {

  deleteDoc(doc(db, "shopping-lists", listId, "categories", categoryId))
}

// Calling firebase to remove a single field from a category document
async function deleteShoppingListItem(listId, categoryId, itemName) {
  // Use the updateDoc method to delete the field
  const deleteData = {
    [itemName]: deleteField(),
  };

  updateDoc(
    doc(db, "shopping-lists", listId, "categories", categoryId),
    deleteData
  )
}

// Edit the details of an already existing item
async function editShoppingListItem(listId, categoryId, itemName, itemNeed, itemHave, itemCost) {
  // TODO: Only items that are different should be updated.
  const newData = 
  {
    [itemName]: 
    {
      need: itemNeed,
      have: itemHave,
      cost: itemCost
    }
  }

  await updateDoc(
    doc(db, "shopping-lists", listId, "categories", categoryId),
    newData
  )
}

// Getting all shopping list from the firebase firestore
async function getMyShoppingLists(){
  const ShoppingLists = []

  const querySnapshot = await getDocs(collection(db, "shopping-lists"));
  querySnapshot.forEach((doc) => {
    // Adding to shopping list array
    ShoppingLists.push(doc)
  });

  return ShoppingLists
}

// Getting all shopping list items for a particular shopping list
async function getShoppingListitems(docId) {
  // Reference the specific document to retrieve
  const querySnapshot = await getDocs(collection(db, "shopping-lists", docId, "categories"))
  return querySnapshot 
}

export {
  addShoppingList,
  addShoppingListItem,
  deleteShoppingListCategory,
  deleteShoppingListItem,
  editShoppingListItem,
  getMyShoppingLists,
  getShoppingListitems,
  signIn
}