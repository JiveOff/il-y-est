import firebaseConfig from "../config/firebase";
import { initializeApp } from "firebase/app";
import "firebase/database";
import Vue from "vue";

const firebaseApp = initializeApp(firebaseConfig);

Vue.prototype.$firebase = firebaseApp;

export default firebaseApp;
