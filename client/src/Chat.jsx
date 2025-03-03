import React, {useState} from 'react'; 

function Chat({ chattingwith, chats, username, sendmessage}) { // 3 states and a function

    const [messagetext,setMessagetext] = useState(''); 

    
    const filteredchats = chats.filter((chat)=>{

        if(chat.type=== 'group' && chattingwith === 'Friends') return true; 

        else if(chat.type=== 'private' && chattingwith!=='Friends') {

            return (chat.from === username && chat.target === chattingwith) || (chat.from === chattingwith && chat.to === username); 
        }
        return false;
    })

    
    const handleSubmit = (e)=>{
        e.preventDefault(); // reloading the page. 

        if(messagetext.trim()!=='') {
            sendmessage(messagetext); 
            setMessagetext(''); 
        }
    }


    return(
    <div style={{ marginTop: '20px' }}>

        <h3>Chatting with: {chattingwith}</h3>
        <div style={{ border: '1px solid #ccc', padding: '10px', height: '300px', overflowY: 'scroll' }}>
            {filteredchats.map((chat,index)=>{
                <div key = {index}>
                    <strong>{(chat.from === username)? username: chat.from}</strong> {chat.text}
                </div>
            })}
    
        </div>

        <form onSubmit = {handleSubmit} style={{ marginTop: '10px' }}>
            <input type = "text" value = {messagetext} onChange = {(e)=>setMessagetext(e.target.value)} placeholder="Type your message..."
          style={{ width: '70%', marginRight: '10px' }}></input>

            <button type= "submit">Send</button>
        </form>

    </div>); 

}

export default Chat; 