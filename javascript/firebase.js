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
      name: listName,
      users: [
        localStorage.getItem('unified-uid')
      ], 
      items: []
  })
}

// Used to add a shopping list to the firestore databse shopping list collection
async function addShoppingListItem(itemName, itemNeed, itemHave, itemCost) {
  // Reference the specific document to add list item to 
  const docRef = doc(db, 'shopping-lists', localStorage.getItem('unified-current-list'))

  // Setting up what data to update
  const updateData = {items: arrayUnion({name:itemName,need:itemNeed, have:itemHave, cost:itemCost })}

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
  
  if (docSnap.exists()) {
    console.log("Document data:", docSnap.data());
    return docSnap.data().items
  } else {
    // docSnap.data() will be undefined in this case
    console.log("No such document!");
  }
}

export {
  addShoppingList,
  addShoppingListItem,
  getMyShoppingLists,
  getShoppingListitems,
  signIn
}