import './App.css';
import {auth, firestore} from "./firebase"
import {useAuthState} from "react-firebase-hooks/auth";
import { GoogleAuthProvider, signInWithPopup, signInAnonymously } from "firebase/auth";
import { collection, query, orderBy, limit, addDoc, serverTimestamp, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import {useCollectionData} from "react-firebase-hooks/firestore"
import { useRef, useState } from 'react';
import DeleteIcon from '@material-ui/icons/Delete';

function App() {

  const [user] = useAuthState(auth);
  return (
    <div className="app">
      {user ? <ChatRoom /> : <SignIn />}
    </div>
  );
}

function ChatRoom() {
  const demo = useRef('')
  const messagesRef = collection(firestore, 'messages');
  const q = query(messagesRef, orderBy('createdAt', "asc"), limit(30))

  const [messages] = useCollectionData(q, {idField: 'id'})
  const [formValue, setFormValue] = useState('')

  const sendMessage = async(e) => {
    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;

    await addDoc(collection(firestore, "messages"), {
      text: formValue,
      createdAt: serverTimestamp(),
      uid: uid,
      photoURL: photoURL
    })
      .then(docRef => {updateDoc(docRef, {id: docRef.id})})
      .catch(err => console.error(err))

    setFormValue('')

    demo.current.scrollIntoView({behavior: "smooth"});
  }
 
  return(
    <div className='chat'>
      <div className="header">
        <SignOut />
      </div>
      <div className='messages'>
        {messages && messages.map(msg => <ChatMessage className="message" key={msg.id} message={msg} />)}

        <div ref={demo}></div>
      </div>

      <form onSubmit={sendMessage}>
        <input value={formValue} onChange={(e) => setFormValue(e.target.value)} />
        <button className='btn' type='submit'>Send</button>
      </form>
    </div>
  )
}

function SignIn() {
  const signInWithGoogle = (auth) => {
    const provider = new GoogleAuthProvider()

    signInWithPopup(auth, provider)
  }

  return(
    <div className='signIn-page'>
      <h1>Login</h1>
      <button onClick={() => signInWithGoogle(auth)} >Sign In with Google</button>
      <button onClick={() => signInAnonymously(auth)}>Sign In as a Guest</button>
    </div>
  )
}

function SignOut() {
  return auth.currentUser && (
    <div>
      <button className='btn' onClick={() => auth.signOut()}>Sign Out</button>
    </div>
  )
}

function ChatMessage(msg) {
  const text = msg.message.text;
  const uid = msg.message.uid;
  const id = msg.message.id;

  const messageClass = uid === auth.currentUser.uid ? "sent" : "received";
  return(
    <div className={`message ${messageClass}`}>
      {uid === auth.currentUser.uid ? <button onClick={() => deleteDoc(doc(firestore, 'messages', `${id}`))}><DeleteIcon /></button>: ''}
      <p>{text}</p>
    </div>
  )
}

export default App;
