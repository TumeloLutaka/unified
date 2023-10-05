// Import the functions you need from the SDKs you need
import { getFirestore, doc, getDoc, setDoc} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js";

import app from "./index.js";
const db = getFirestore(app);

async function getAccountDocument() {
    const docRef = doc(db, "accounts", "1"); // replace '1' with your document id
    const docSnap = await getDoc(docRef);
  
    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
    } else {
      console.log("No such document!");
    }
  }
  
  getAccountDocument();

  // Adding event listener to add-new button
  document.getElementById('add-new').addEventListener('click', () => {
    addList()
  })

  async function addList() {
    await setDoc(doc(db, "shopping-lsit"), {
        name: "Los Angeles",
        state: "CA",
        country: "USA"
    })
  }
