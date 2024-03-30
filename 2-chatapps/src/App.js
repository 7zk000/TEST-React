import React, { useState, useEffect } from 'react';
import './App.css';
import { initializeApp } from "firebase/app";
import firebaseConfig from "./firebase-config";
import { getFirestore, collection, query, orderBy, onSnapshot, addDoc } from "firebase/firestore";


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

function App() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {

    const messagesRef = collection(db, "messages");

    const q = query(messagesRef, orderBy("sentAt"));


    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const messagesArray = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMessages(messagesArray);
    });


    return () => unsubscribe();
  }, []);


  const handleSendMessage = async () => {
    if (newMessage.trim() !== '') {
      await addDoc(collection(db, "messages"), {
        text: newMessage,
        sentAt: new Date()
      });
      setNewMessage('');
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>チャットアプリ</h1>
      </header>
      <div className="messages">
        {messages.map((msg) => (
          <p key={msg.id}>{msg.text}</p>
        ))}
      </div>
      <div className="message-input">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="メッセージを入力"
        />
        <button onClick={handleSendMessage}>送信</button>
      </div>
    </div>
  );
}

export default App;
