import React, { useEffect, useState } from 'react';
import io from 'socket.io-client'; 
import Chat from './Chat'

const socket  = io('http://localhost:5000');

function App() {

    const username = useState("Ansh"); 
    const [chattingwith, setChattingwith] = useState('friends'); 
    const [chats, setChats] = useState([]); 


    useEffect(()=>{ // since the username is this client, it won't change and this will only run when component is mounted. UseEffect is a hook. 
        // sends unique socket id along with itself. socket is a customizable object that more properties can be attached to. 
        socket.emit('register',username); 

        socket.emit('joinroom','room1'); 

        socket.on('groupmessage',(message)=>{ // receiving "parsed" from backend. 

            setChats((prevchats)=>[...prevchats,message]); 
            
        })

        socket.on('privatemessage',(message)=>{
            setChats((prevchats)=>[...prevchats,message]); 
        })

        return()=>{
            socket.off('groupmessage');
            socket.off('privatemessage'); 
        }
    },[username]); 

    
    function sendMessage(text) {

        let message; 

        if(chattingwith=="friends") {

            message = {
                type:'group', room:'room1',from:username, text
            };
        }
        else{
            
            message = {
                type:'private',target:chattingwith,from:username,text
            };         
        }

        socket.emit('message',message); 
    }



    return(<div>
         <div style={{ padding: '20px' }}>
         <h2>RUConnect</h2>
        <div style={{ marginBottom: '10px' }}>
        <button onClick={()=>setChattingwith("Vishal")}>Vishal</button>
        <button onClick={()=>setChattingwith("Yash")}>Yash</button>
        <button onClick={()=>setChattingwith("Friends")}>Mehul</button>
        </div>
        <Chat chattingwith={chattingwith} chats = {chats} username={username} sendmessage = {sendMessage}/>
        </div>

    </div>)

    



}

export default App; 
