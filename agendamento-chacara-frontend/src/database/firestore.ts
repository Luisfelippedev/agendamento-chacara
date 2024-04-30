import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBuBU-_fQXZ6S4GprTP4wNQjA-lqmK0ndI",
    authDomain: "agendamento-chacara.firebaseapp.com",
    projectId: "agendamento-chacara",
    storageBucket: "agendamento-chacara.appspot.com",
    messagingSenderId: "163959004652",
    appId: "1:163959004652:web:d2ca658ad2b8811b1cb4c9"
  };

  const firestore = getFirestore(initializeApp(firebaseConfig));

  export { firestore };