const chat = document.getElementById("chat");
const input = document.getElementById("input");
const sendBtn = document.getElementById("send");

function addMessage(html, cls) {
  const div = document.createElement("div");
  div.className = `card ${cls}`;
  div.innerHTML = html;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
  return div;
}

async function sendMessage() {
  const text = input.value.trim();
  if (!text) return;

  input.value = "";
  addMessage(text, "user");

  const typing = addMessage(
    `<div class="dots"><span>.</span><span>.</span><span>.</span></div>`,
    "ai"
  );

  try {
    const res = await fetch("/crasher/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: text })
    });

    const data = await res.json();
    typing.remove();

    const reply = (data.reply || "…").replace(
      /```([\s\S]*?)```/g,
      (_, code) =>
        `<pre><div class="copy" onclick="navigator.clipboard.writeText(\`${code}\`)">Copy</div>${code}</pre>`
    );

    addMessage(reply, "ai");

  } catch {
    typing.remove();
    addMessage("Connection error.", "ai");
  }
}

sendBtn.onclick = sendMessage;
input.addEventListener("keydown", e => {
  if (e.key === "Enter") sendMessage();
});
