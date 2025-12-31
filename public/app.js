const chat=document.getElementById("chat");
const input=document.getElementById("input");
const sendBtn=document.getElementById("sendBtn");
const menu=document.getElementById("menu");
const menuBtn=document.getElementById("menuBtn");
const themeToggle=document.getElementById("themeToggle");
const micBtn=document.getElementById("micBtn");
const uploadBtn=document.getElementById("uploadBtn");
const fileInput=document.getElementById("fileInput");

let memory=[];

// MENU
function toggleMenu(){menu.classList.toggle("open");}
menuBtn.onclick=toggleMenu;

// THEME
themeToggle.onclick=()=>{document.body.classList.toggle("light");}

// SEND MESSAGE
async function send(){
  const text=input.value.trim();
  if(!text) return;
  input.value="";
  memory.push({role:"user",content:text});
  addMessage(text,"user");

  const typing=addMessage('<div class="dots"><span>.</span><span>.</span><span>.</span></div>',"ai");

  try{
    const r=await fetch("/crasher/chat",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({prompt:text,memory})
    });
    const j=await r.json();
    typing.remove();
    memory.push({role:"assistant",content:j.reply});
    addMessage(formatReply(j.reply),"ai");
  }catch{
    typing.remove();
    addMessage("Connection error.","ai");
  }
}
sendBtn.onclick=send;
input.addEventListener("keydown",e=>{if(e.key==="Enter")send();});

// RESET & DOWNLOAD
function resetChat(){chat.innerHTML="";memory=[];toggleMenu();}
function downloadApp(){alert("APK build coming soon");}

// ADD MESSAGE
function addMessage(text,cls){
  const d=document.createElement("div");
  d.className=`card ${cls}`;
  d.innerHTML=text;
  chat.appendChild(d);
  chat.scrollTop=chat.scrollHeight;
  return d;
}

// FORMAT CODE BLOCKS WITH COPY
function formatReply(reply){
  return reply.replace(/```([\s\S]*?)```/g,(_,code)=>`<pre><div class="copy" onclick="navigator.clipboard.writeText(\`${code}\`)">Copy</div>${code}</pre>`);
}

// VOICE RECOGNITION
let recognizing=false;
let recognition;
if('webkitSpeechRecognition' in window){
  recognition=new webkitSpeechRecognition();
  recognition.continuous=false;
  recognition.lang='en-US';
  recognition.onresult=e=>{
    const text=e.results[0][0].transcript;
    input.value=text;
  }
  recognition.onend=()=>{recognizing=false;}
}

micBtn.onclick=()=>{
  if(!recognition) return alert("Voice not supported");
  if(!recognizing){recognition.start();recognizing=true;}
  else{recognition.stop();recognizing=false;}
}

// FILE UPLOAD
uploadBtn.onclick=()=>fileInput.click();
fileInput.onchange=()=>{
  const files=[...fileInput.files];
  files.forEach(file=>{
    if(file.type.startsWith("image/")){
      const reader=new FileReader();
      reader.onload=e=>addMessage(`<img src="${e.target.result}" style="max-width:100%;border-radius:12px;">`,"user");
      reader.readAsDataURL(file);
    }else{
      addMessage(`Uploaded file: ${file.name}`,"user");
    }
  });
  fileInput.value="";
}
