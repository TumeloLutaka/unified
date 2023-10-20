// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";
import { getFirestore, collection, doc, getDoc, getDocs, addDoc, updateDoc, arrayUnion} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js";

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

  // Initialize collection references
  const shoppingListsCollection = collection(db, "shopping-lists")

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
  await addDoc(shoppingListsCollection, {
    categories:[
      "General"
    ],
    items: [],
    name: listName,
    users: [
      localStorage.getItem('unified-uid')
    ], 
  })
}

// Used to add a shopping list to the firestore databse shopping list collection
async function addShoppingListItem(itemName, itemNeed, itemHave, itemCost, itemCategory) {
  // Reference the specific document to add list item to 
  const docRef = doc(db, 'shopping-lists', localStorage.getItem('unified-current-list'))
  const updateData = {}

  //Check if category exists, if so add new category to list
  const docSnap = await getDoc(docRef);
  let addCategory = true
  docSnap.data().categories.forEach( category => {
    if(category === itemCategory) addCategory = false
  })
  // Update categories
  if(addCategory){
    // Use updateDoc to update the document with the array operation
    updateData.categories = arrayUnion(itemCategory)
  }

  // Setting up what data to update
  updateData.items = arrayUnion({name:itemName,need:itemNeed, have:itemHave, cost:itemCost, category:itemCategory })

  // Use updateDoc to update the document with the array operation
  updateDoc(docRef, updateData)
  .then(() => {
    console.log("Array updated successfully!");
  })
  .catch((error) => {
    console.error("Error updating array:", error);
  });
}

// Getting all shopping list from the firebase firestore
async function getMyShoppingLists(){
  const ShoppingLists = []

  const querySnapshot = await getDocs(shoppingListsCollection);
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    console.log(doc.id, " => ", doc.data());

    // Adding to shopping list array
    ShoppingLists.push(doc)
  });

  return ShoppingLists

}

// Getting all shopping list items for a particular shopping list
async function getShoppingListitems(docId) {
  // Reference the specific document to retrieve
  const docRef = doc(db, "shopping-lists", docId);
  const docSnap = await getDoc(docRef);

  // Create variable that holds all organized items and categories
  let categorisedItems = []
  
  // If document was successfully retrieved organize all items into their categories.
  if (docSnap.exists()) {
    // Loop through each category
    docSnap.data().categories.forEach( category => {
      let categoryItems = {
        name:category,
        items: []
      }
      
      // Loop through all items and check if their category field matches the current category if so, add to the category item
      docSnap.data().items.forEach( item => {
        if(item.category === category) categoryItems.items.push(item)
      })

      categorisedItems.push(categoryItems)
    })
    return categorisedItems
  } else {
    // docSnap.data() will be undefined in this case
    console.log("No such document!");
  }
}

async function editItem() {

  await updateDoc(docRef, newData)
}

export {
  addShoppingList,
  addShoppingListItem,
  editItem,
  getMyShoppingLists,
  getShoppingListitems,
  signIn
}