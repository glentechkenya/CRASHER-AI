import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";

dotenv.config();

const app = express();
const upload = multer({ limits: { fileSize: 10 * 1024 * 1024 } });

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ status: "AI Crasher AI backend running" });
});

app.post("/api/chat", upload.single("file"), async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    // TEMP RESPONSE (AI will be connected next step)
    const reply = `AI Crasher AI received: ${message}`;

    res.json({
      reply,
      file: req.file
        ? {
            name: req.file.originalname,
            size: req.file.size,
            type: req.file.mimetype
          }
        : null
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`AI Crasher backend running on port ${PORT}`);
});
