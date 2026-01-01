const chat = document.getElementById("chat");
const input = document.getElementById("input");
const sendBtn = document.getElementById("sendBtn");
const menu = document.getElementById("menu");
const menuBtn = document.getElementById("menuBtn");

let memory = [];

/* GLOBAL FUNCTIONS (IMPORTANT) */
window.toggleMenu = () => {
  menu.classList.toggle("open");
};

window.resetChat = () => {
  chat.innerHTML = "";
  memory = [];
  toggleMenu();
};

window.downloadApp = () => {
  alert("APK build ready via PWA Builder");
};

/* MENU BUTTON */
menuBtn.addEventListener("click", toggleMenu);

/* ADD MESSAGE */
function addMessage(text, cls) {
  const d = document.createElement("div");
  d.className = `card ${cls}`;
  d.innerHTML = text;
  chat.appendChild(d);
  chat.scrollTop = chat.scrollHeight;
  return d;
}

/* SEND MESSAGE */
async function sendMessage() {
  const text = input.value.trim();
  if (!text) return;

  input.value = "";
  memory.push({ role: "user", content: text });
  addMessage(text, "user");

  const typing = addMessage(
    `<div class="dots"><span>.</span><span>.</span><span>.</span></div>`,
    "ai"
  );

  try {
    const r = await fetch("/crasher/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: text, memory })
    });

    const j = await r.json();
    typing.remove();

    memory.push({ role: "assistant", content: j.reply });

    const reply = j.reply.replace(
      /```([\s\S]*?)```/g,
      (_, code) =>
        `<pre style="position:relative">
          <button onclick="navigator.clipboard.writeText(\`${code}\`)"
            style="position:absolute;top:6px;right:6px">Copy</button>
          ${code}
        </pre>`
    );

    addMessage(reply, "ai");

  } catch {
    typing.remove();
    addMessage("Connection error.", "ai");
  }
}

/* EVENTS */
sendBtn.addEventListener("click", sendMessage);
input.addEventListener("keydown", e => {
  if (e.key === "Enter") sendMessage();
});
