import React, { useState, useEffect } from 'react';
import axios from "axios";
import './App.css';
import PenIcon from './icons/pen-icon.png';
import TrashIcon from './icons/trash-icon.png';

function App() {
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [allData, setAllData] = useState([]);
  const [edit, setEdit] = useState(false);
  const [editID, setEditID] = useState('');
  const [messageCount, setMessageCount] = useState(0);
  const [newMessageCount, setNewMessageCount] = useState(0);

  const fetchData = async () => {
    const response = await axios.get("http://localhost:5001/posts");
    setAllData(response.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (username && message) {
      const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const timestampISO = new Date().toISOString(); // Use ISO 8601 format
      const body = {
        username: username,
        message: message,
        timestamp: timestamp,
        timestampISO: timestampISO
      };
      const response = await axios.post("http://localhost:5001/messages", body);
      setMessage('');
      setUsername('');
      setMessageCount(0);
      fetchData();
    } else {
      alert("fill in all fields");
    }
  };

  const deletePost = async (id) => {
    const response = await axios.delete(`http://localhost:5001/posts/${id}`);
    fetchData();
  };

const handleEditPost = async (e) => { // Add the event parameter
  e.preventDefault(); // Prevent the default form submission behavior
  const id = editID;
  const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const timestampISO = new Date().toISOString(); // Use ISO 8601 format

  if (newUsername && newMessage) {
    const body = {
      username: newUsername,
      message: newMessage,
      timestamp: `Edited: ${timestamp}`,
      timestampISO: timestampISO
    };

    const response = await axios.put(`http://localhost:5001/posts/${id}`, body);
    console.log(`http://localhost:5001/posts/${id}`);
    fetchData();
    clearEdit();
  } else {
    alert('please fill in all fields')
  }
};


  const editState = (id, username, message) => {
    setEditID(id);
    setEdit(true);
    setNewUsername(username);
    setNewMessage(message);
    setNewMessageCount(message.length);
  }

  const clearEdit = () => {
    setEditID("");
    setEdit(false);
    setNewUsername('');
    setNewMessage('');
    setNewMessageCount(0);
  }

  const clearCreate = () => {
    setUsername('');
    setMessage('');
    setMessageCount(0);
  }

  const sortPostsByLatest = () => {
    const sortedData = [...allData].sort((a, b) => new Date(b.timestampISO) - new Date(a.timestampISO));
    setAllData(sortedData);
    console.log(sortedData);
  };

  const sortPostsByEarliest = () => {
    const sortedData = [...allData].sort((a, b) => new Date(a.timestampISO) - new Date(b.timestampISO));
    setAllData(sortedData);
    console.log(sortedData);
  };


  return (
    <>
      {edit &&
        <div>
          <div className="background-blur"></div>
          <form onSubmit={handleEditPost}> 
            <div className='edit-form'>
              <h1 className='title'>Edit Post</h1>
              <div className='input'>
                <input
                  maxLength="40"
                  placeholder='Username'
                  className='username-box'
                  type="text"
                  value={newUsername} // Bind the input value to the state
                  onChange={(e) => setNewUsername(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === ' ') {
                      e.preventDefault(); // Prevent the space character from being entered
                    }
                  }}
                />
              </div>  
              <div className='input'>
                <div className='area-input'>
                  <textarea
                    maxLength="216"
                    placeholder='Message'
                    className='message-box'
                    type="text"
                    value={newMessage} // Bind the input value to the state
                    onChange={(e) => {
                      setNewMessage(e.target.value);
                      setNewMessageCount(e.target.value.length);
                    }}/>
                  <div className='char-counter'>{newMessageCount} / 216</div>
                </div>
              </div>
              
              <div className='input'>
                <button type='submit' className='edit-button'>Submit</button>
                <button onClick={clearEdit} className='cancel-button'>Cancel</button>
              </div>
            </div>
          </form>
        </div>
      }

      <form onSubmit={handleSubmit} className='create-form-box'> 
        <div className='create-form'>
          <h1 className='title'>Create Post</h1>
          <div className='input-box'>
            <div className='input'>
              <input
                maxLength="40"
                placeholder='Username'
                className='username-box'
                type="text"
                value={username} // Bind the input value to the state
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === ' ') {
                      e.preventDefault(); // Prevent the space character from being entered
                    }
                  }}
              />
            </div>

            <div className='input'>
              <div className='area-input'>
                <textarea
                maxLength="216"
                placeholder='Message'
                className='message-box'
                type="text"
                value={message} // Bind the input value to the state
                onChange={(e) => {
                  setMessage(e.target.value);
                  setMessageCount(e.target.value.length);
                }}
              />
              <div className='char-counter'>{messageCount} / 216</div>

              </div>
              
            </div>
            
            <div className='input'>
              <button type='submit' className='create-button'>Create</button>
              <button type='button' onClick={clearCreate} className='clear-button'>Clear</button>
            </div>

          </div>
        </div>
      </form>
      
      <div className='messages-container'>
        <div className='posts-title'>Current Posts</div>
        <div className='sort-buttons'>
          <button onClick={sortPostsByLatest} className='sort-button' style={{
            marginRight: "10px",
            marginLeft: "10px"
          }}> Sort by Latest</button> 
          <button onClick={sortPostsByEarliest} className='sort-button'>Sort by Earliest</button> 
        </div>
      
        <div className='messages-grid'>
        {allData.map((post, index) => (
          <div key={index} className='message'>
            <div className='inner-message'>
              <p className='post-username'>{post.username}</p>
              <p className='post-message'>{post.message}</p>
              <p className='post-timestamp'>{post.timestamp}</p> 
            </div>
            <div className='buttons'>
                <button onClick={() => deletePost(post.id)} className='trash-button'>
                  <img src={TrashIcon} alt='Trash Icon' className='trash-img'/>
                </button>
                <button onClick={() => editState(post.id, post.username, post.message)} className='pen-button'>
                  <img src={PenIcon} alt='Pen Icon' className='pen-img'/>
                </button>
              </div>
          </div>
        ))}
          
        </div>
      </div>
    </>
  );
}

export default App;
