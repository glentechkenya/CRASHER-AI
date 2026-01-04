const chatWindow = document.getElementById("chatWindow");
const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const fileInput = document.getElementById("fileInput");

const BACKEND_URL = "https://YOUR_RENDER_BACKEND_URL.onrender.com";

chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const message = userInput.value;
  if (!message) return;

  appendMessage("user", message);
  userInput.value = "";

  const formData = new FormData();
  formData.append("message", message);
  if (fileInput.files[0]) {
    formData.append("file", fileInput.files[0]);
  }

  appendMessage("bot", "Typing...");

  try {
    const res = await fetch(`${BACKEND_URL}/api/chat`, {
      method: "POST",
      body: formData
    });

    const data = await res.json();
    const lastBotMsg = chatWindow.querySelector(".bot:last-child");
    if (lastBotMsg) lastBotMsg.remove(); // remove "Typing..."

    appendMessage("bot", data.reply);

    if (data.file) {
      appendMessage("bot", `📎 Received file: ${data.file.name} (${data.file.size} bytes)`);
    }

  } catch (err) {
    console.error(err);
    const lastBotMsg = chatWindow.querySelector(".bot:last-child");
    if (lastBotMsg) lastBotMsg.remove();
    appendMessage("bot", "❌ Error connecting to server");
  }

  fileInput.value = "";
});

function appendMessage(sender, text) {
  const msg = document.createElement("div");
  msg.classList.add("message", sender);
  msg.textContent = text;
  chatWindow.appendChild(msg);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}
