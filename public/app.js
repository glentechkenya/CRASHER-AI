const chat = document.getElementById("chat");
const input = document.getElementById("input");

function addMessage(html, cls) {
  const div = document.createElement("div");
  div.className = `card ${cls}`;
  div.innerHTML = html;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
  return div;
}

input.addEventListener("keydown", async e => {
  if (e.key !== "Enter") return;
  const text = input.value.trim();
  if (!text) return;

  input.value = "";
  addMessage(text, "user");

  const typing = addMessage(
    `<div class="dots"><span>.</span><span>.</span><span>.</span></div>`,
    "ai"
  );

  const res = await fetch("/crasher/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt: text })
  });

  const data = await res.json();
  typing.remove();

  const reply = data.reply.replace(/```([\s\S]*?)```/g, (_, code) =>
    `<pre><div class="copy" onclick="navigator.clipboard.writeText(\`${code}\`)">Copy</div>${code}</pre>`
  );

  addMessage(reply, "ai");
});
