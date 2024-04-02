import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import { initializeApp } from "firebase/app";
import firebaseConfig from "./firebase-config";
import { getFirestore, collection, query, orderBy, onSnapshot, addDoc } from "firebase/firestore";
import { format } from 'date-fns'; // date-fnsをインポート

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 簡単なアイコンのリスト（絵文字を使用）
const icons = ["😀", "😃", "😄", "😁", "😆", "😅", "😂", "🤣", "😊", "😇"];

const App = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const endOfMessagesRef = useRef(null);

  useEffect(() => {
    const messagesRef = collection(db, "messages");
    const q = query(messagesRef, orderBy("sentAt"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const messagesArray = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        sentAt: doc.data().sentAt.toDate(),
        icon: icons[Math.floor(Math.random() * icons.length)] // ランダムなアイコンを選択
      }));
      setMessages(messagesArray);
      scrollToBottom();
    });

    return () => unsubscribe();
  }, []);

  const handleSendMessage = async () => {
    const trimmedMessage = newMessage.trim();
    if (trimmedMessage !== '') {
      try {
        await addDoc(collection(db, "messages"), {
          text: trimmedMessage,
          sentAt: new Date(),
          icon: icons[Math.floor(Math.random() * icons.length)]
        });
        setNewMessage('');
      } catch (error) {
        console.error("Message could not be sent: ", error);
      }
    }
  };

  const scrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1 className='text-left'>雑談部屋</h1>
      </header>
      <div className="messages">
        {messages.map((msg) => (
          <div key={msg.id} className="message">
            <div className="message-icon">{msg.icon}</div>
            <div>
              <p className="message-info">ID: {msg.id} : {format(msg.sentAt, 'Pp')}</p>
              <p className="message-text">{msg.text}</p>
            </div>
          </div>
        ))}
        <div ref={endOfMessagesRef} />
      </div>

      <div className="message-input">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="メッセージを入力"
          autoFocus
        />

        <button className="send-button" onClick={handleSendMessage}>送信!</button>
      </div>
    </div>
  );
}

export default App;
