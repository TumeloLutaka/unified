import { signIn } from './firebase.js'

// Get reference to login form
const loginForm = document.getElementById('login-form')
loginForm.addEventListener('submit', (event) => {
  event.preventDefault()

  // Access the input fields valuess
  const email = document.getElementById('email').value.trim()
  const password = document.getElementById('password').value.trim()

  // Calling the firebase function to sign in user
  signIn(email, password)

})
