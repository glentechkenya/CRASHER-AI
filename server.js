import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());

/* SERVE FRONTEND */
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

/* AI CHAT */
app.post("/api/chat", async (req, res) => {
  try {
    const response = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [{ role: "user", content: req.body.message }]
        })
      }
    );

    const data = await response.json();
    res.json({ reply: data.choices[0].message.content });

  } catch (e) {
    res.status(500).json({ reply: "AI error" });
  }
});

/* 🔥 THIS IS THE FIX */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Crusher AI LIVE on port " + PORT);
});
