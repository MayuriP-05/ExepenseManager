
    const username = document.querySelector(".user-name");
    username.innerHTML = localStorage.getItem("name");
    // console.log(username.innerHTML);
    // console.log(localStorage.getItem("name"));
  
    function logOut() {
      localStorage.removeItem("name");
      localStorage.removeItem("email");
      window.location.href = "index.html";
    }
const typingForm = document.querySelector(".typing-form");
const chatList = document.querySelector(".chat-list");
const suggestions=document.querySelectorAll(".suggestion-list .suggetion")
const toggleThemeButton=document.querySelector("#toggle-theme-button");
const deleteChatbutton= document.querySelector("#delete-chat-button");
let userMessage=null;

let isResponsegenerating=false;

const API_KEY="AIzaSyB03DpDObRWvskIe6epjrfhik9aMXYiv4o";
const API_URL=`https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_KEY}`;

const loadLocalstorageData=() =>{
    const savedchats=localStorage.getItem("savedChats");
    const isLightMode=(localStorage.getItem("themeColor")==="light_mode");
    //to apply stored theme even after refresh

    document.body.classList.toggle("light_mode",isLightMode);
    toggleThemeButton.innerText= isLightMode ? "dark_mode":"light_mode";
    
    chatList.innerHTML=savedchats|| ""; //restore saved chats
    document.body.classList.toggle("hide-header",savedchats);
    chatList.scrollTo(0,chatList.scrollHeight); //scroll to bottom automatically
}
loadLocalstorageData();
const createMessageElement=(content,...classes)=>{ //adding all passed classes
    const div=document.createElement("div");
    div.classList.add("message",...classes);
    div.innerHTML=content;
    return div;
}
//for typing or dysplaying word by word response
const showTypingEffect=(text, textElement) => {
    const words=text.split(' ');
    let currentWordIndex=0;

    const typingIntervel=setInterval(() => {
      //Append each word to text element with a space  
        textElement.innerText+=(currentWordIndex=== 0 ? '':' ') + words[currentWordIndex++];
        if(currentWordIndex===words.length){
            clearInterval(typingIntervel);
            isResponsegenerating=false;
            localStorage.setItem("savedChats",chatList.innerHTML)
            chatList.scrollTo(0,chatList.scrollHeight);
        }
    }, 75);
}

//fetching response from api by user message
const generateAPIResponse=async(incominngMessageDiv)=>{
const textElement=incominngMessageDiv.querySelector(".text"); //to get text received

    // send a post request to api with user's message
try{
const response=await fetch(API_URL,{
    method:"POST",
    headers:{"Content-Type": "application/json"},
    body:JSON.stringify({
        contents:[{
            role:"user",
            parts:[{text: userMessage}]
        }]
    })
});
const data= await response.json();
if(!response.ok) throw new Error(data.error.message);
// console.log(data);
const apiResponse=data?.candidates[0].content.parts[0].text;
// textElement.innerText=apiResponse;
// console.log(apiResponse);
showTypingEffect(apiResponse,textElement);
}
catch(error){
    isResponsegenerating=false;
textElement.innerText=error.message;
textElement.classList.add("error");
    // console.log(error);
}
finally{
    incominngMessageDiv.classList.remove("loading")
}
}

const showLoadingAnimation=()=>{
    const html=` <div class="message-content">
      <img src="gemini.svg" alt="userImg" class="avatar">
      <p class="text"></p>
     <div class="loading-indicator">
      <div class="loading-bar"></div>
      <div class="loading-bar"></div>
      <div class="loading-bar"></div>
     </div>
    </div>
    <span onclick="copyMessage(this)" class="icon material-symbols-outlined">
      content_copy
      </span>`;
const incominngMessageDiv =createMessageElement(html,"incoming","loading");
// outgoingMessageDiv.querySelector(".text").innerText=userMessage;
chatList.appendChild(incominngMessageDiv);
chatList.scrollTo(0,chatList.scrollHeight); //scroll to bottom automatically
generateAPIResponse(incominngMessageDiv);
}

const copyMessage=(copyIcon) =>{
    const messageText=copyIcon.parentElement.querySelector(".text").innerText;
    navigator.clipboard.writeText(messageText);
    copyIcon.innerText="done"; //show tick after mssg copied
    setInterval(() => copyIcon.innerText="content_copy",1000); //revert icon to original after 1 sec
}

const  handleoutgoingChat=() =>{
    userMessage=typingForm.querySelector(".typing-input").value.trim() || userMessage;
    if(!userMessage || isResponsegenerating)
    return;

    isResponsegenerating=true;
// console.log(userMessage); 
const html=` <div class="message-content">
      <img src="profile.png" alt="userImg" class="avatar">
      <p class="text"></p>
    </div>`;
const outgoingMessageDiv =createMessageElement(html,"outgoing");
outgoingMessageDiv.querySelector(".text").innerText=userMessage;
chatList.appendChild(outgoingMessageDiv);

typingForm.reset();
chatList.scrollTo(0,chatList.scrollHeight);
document.body.classList.add("hide-header"); //hide header after chat started
setTimeout(showLoadingAnimation,200);
}

//set suggestions as users message
suggestions.forEach(suggetion=>{
    suggetion.addEventListener("click",()=>{
    userMessage=suggetion.querySelector(".text").innerText;
    handleoutgoingChat();
    });
});

toggleThemeButton.addEventListener("click",(e)=>{
const isLightMode= document.body.classList.toggle("light_mode");
//to let the toggle effect lets on localStorage even after page refresh theme tobe saved
localStorage.setItem("themeColor", isLightMode ? "light_mode":"dark_mode" )
toggleThemeButton.innerText= isLightMode ? "dark_mode":"light_mode";
});

deleteChatbutton.addEventListener("click",(e)=>{
    if(confirm("Are u sure u want to delete all meassages??")){
        localStorage.removeItem("savedChats");
        loadLocalstorageData();
    }
})

typingForm.addEventListener("submit",(e)=>{
    e.preventDefault();
    handleoutgoingChat();
});