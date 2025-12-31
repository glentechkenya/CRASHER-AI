const chat = document.getElementById("chat");
const input = document.getElementById("input");
const sendBtn = document.getElementById("sendBtn");
const menu = document.getElementById("menu");
const menuBtn = document.getElementById("menuBtn");

let memory = [];

function toggleMenu(){
  menu.classList.toggle("open");
}

menuBtn.onclick = toggleMenu;

function addMessage(text, cls){
  const d=document.createElement("div");
  d.className=`card ${cls}`;
  d.innerHTML=text;
  chat.appendChild(d);
  chat.scrollTop=chat.scrollHeight;
  return d;
}

async function send(){
  const text=input.value.trim();
  if(!text) return;
  input.value="";

  memory.push({role:"user",content:text});
  addMessage(text,"user");

  const typing=addMessage(
    `<div class="dots"><span>.</span><span>.</span><span>.</span></div>`,
    "ai"
  );

  try{
    const r=await fetch("/crasher/chat",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({prompt:text, memory})
    });

    const j=await r.json();
    typing.remove();

    memory.push({role:"assistant",content:j.reply});
    addMessage(j.reply,"ai");
  }catch{
    typing.remove();
    addMessage("Connection error.","ai");
  }
}

sendBtn.onclick=send;
input.addEventListener("keydown",e=>{
  if(e.key==="Enter") send();
});

function resetChat(){
  chat.innerHTML="";
  memory=[];
  toggleMenu();
}

function downloadApp(){
  alert("APK build coming next step");
}
