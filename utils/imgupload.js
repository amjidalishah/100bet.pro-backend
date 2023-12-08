// Import the functions you need from the SDKs you need

const { initializeApp } = require("firebase/app");
require('dotenv').config()

const {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytes,
  uploadBytesResumable,
} = require("firebase/storage");

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDnvG3bujEbu9VGmUGL3i5WRuCaD3N4ZAs",
  authDomain: "kudos-next.firebaseapp.com",
  projectId: "kudos-next",
  storageBucket: "kudos-next.appspot.com",
  messagingSenderId: "899472045604",
  appId: "1:899472045604:web:545f0eb0c744c8b19c8ab1",
  measurementId: "G-3EMHS3V6GL",
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

const storage = getStorage(app);








const imageLink=async(req,res)=>{
    
  try {
     const postImgBuffer = req.file.buffer;

     console.log(postImgBuffer,"postImagebferr")
     const dateTime = new Date().getTime();
     const storageRef = ref(
       storage,
       `/blog/${req.file.originalname + "" + dateTime}`
     );
     const metadata = {
       contentType: req.file.mimetype,
     };
     const snapshot = await uploadBytesResumable(storageRef, postImgBuffer, metadata);
      
     const post_img_url=await getDownloadURL(snapshot.ref)
     return post_img_url
 
  } catch (error) {
     console.log(error)
     return {"error":"unable to genrate link",error}
  }
}







module.exports = { storage,ref,getDownloadURL,uploadBytes,uploadBytesResumable ,imageLink};
