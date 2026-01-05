const chat = document.getElementById("chat");
const input = document.getElementById("input");
const typing = document.getElementById("typing");

function add(text, cls){
  const div=document.createElement("div");
  div.className="bubble "+cls;
  div.innerHTML=text.replace(/```([\\s\\S]*?)```/g,
    (_,c)=>`<pre><code>${c.replace(/</g,"&lt;")}</code></pre>`);
  chat.appendChild(div);
  chat.scrollTop=chat.scrollHeight;
}

async function send(){
  const msg=input.value.trim();
  if(!msg)return;
  add(msg,"user");
  input.value="";
  typing.style.display="block";

  const res=await fetch("/api/chat",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({message:msg})
  });

  const data=await res.json();
  typing.style.display="none";
  add(data.reply,"bot");
}
