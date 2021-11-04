// firebase.js
import fb from "firebase/app"
export const firebase = !fb.apps.length ? fb.initializeApp(firebaseConfig) : fb.app()