// Import the functions you need from the SDKs you need
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";

import app from "./index.js"

// Get reference to login form
const loginForm = document.getElementById('login-form')
loginForm.addEventListener('submit', (event) => {
  event.preventDefault()

  // Access the input fields valuess
  const email = document.getElementById('email').value.trim()
  const password = document.getElementById('password').value.trim()
  
  // Firebase authentication code.
  const auth = getAuth(app);
  signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
      window.location.href = "home.html";
  })
  .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
  });


})
