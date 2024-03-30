import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  // メッセージを送信する関数
  const sendMessage = async () => {
    // ここにバックエンドへメッセージを送信するコードを書く
  };

  // メッセージを受信するための関数
  useEffect(() => {
    // ここにバックエンドからメッセージを受信するコードを書く
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>チャットアプリ</h1>
      </header>
      <div className="message-area">
        {messages.map((msg, index) => (
          <div key={index}>{msg}</div>
        ))}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={sendMessage}>送信</button>
    </div>
  );
}

export default App;
