import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { GoogleGenAI, Type, ThinkingLevel } from "@google/genai";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: "10mb" }));

function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured in environment.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Endpoint 1: Generate an Equestrian + Entrepreneurial Leadership + Anime reflection
app.post("/api/gemini/reflection", async (req, res) => {
  try {
    const { theme, customPrompt } = req.body as {
      theme?: string;
      customPrompt?: string;
    };

    const ai = getGeminiClient();
    const userTopic =
      customPrompt?.trim() ||
      theme ||
      "Connecting Babson Entrepreneurial Thought & Action (ET&A) with equestrian partnership and community building";

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: `Create a warm, editorial, deeply thoughtful reflection tailored for Professor Lucy Turner (Assistant Professor of Practice in Management and Co-Director of FME at Babson College) from her Babson Summer Study student Amirbek (Amir) Orifjonov from Gulistan, Uzbekistan.
Topic / Lens requested: "${userTopic}"

Connect three worlds naturally and gracefully:
1. Babson College's Entrepreneurial Thought & Action (ET&A) and Foundations of Management and Entrepreneurship (FME).
2. Equestrian horsemanship (trust in the saddle, listening to your partner, cadence, and empathy).
3. Cozy storytelling / anime wisdom (like Silver Spoon, Spice and Wolf, Fanfare of Adolescence, or Sakura Quest) and building startup ecosystems in Uzbekistan.`,
      config: {
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        systemInstruction:
          "You write with calm editorial elegance, warmth, and intellectual rigor. Keep each field concise (2-3 sentences max) and inspiring.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: {
              type: Type.STRING,
              description: "An editorial serif headline for this reflection.",
            },
            equestrianParallel: {
              type: Type.STRING,
              description:
                "How horsemanship and equestrian trust illuminate this leadership principle.",
            },
            fmeTakeaway: {
              type: Type.STRING,
              description:
                "How this connects to Babson FME and Amirbek's venture ecosystem work in Uzbekistan.",
            },
            storyRecommendation: {
              type: Type.STRING,
              description:
                "A specific scene, theme, or takeaway from Silver Spoon, Spice and Wolf, Fanfare of Adolescence, or Sakura Quest for Professor Turner's next day off.",
            },
          },
          required: [
            "title",
            "equestrianParallel",
            "fmeTakeaway",
            "storyRecommendation",
          ],
        },
      },
    });

    const jsonText = (response.text ?? "{}").trim();
    const parsed = JSON.parse(jsonText);
    res.json(parsed);
  } catch (error: any) {
    console.error("Gemini reflection error:", error);
    res.status(500).json({
      error:
        error?.message ||
        "Unable to generate reflection right now. Please check your Gemini API key in Settings > Secrets.",
    });
  }
});

// Endpoint 2: Generate a subtle FME & Mentorship insight for a Summer Study memory frame
app.post("/api/gemini/memory-insight", async (req, res) => {
  try {
    const { caption, context } = req.body as {
      caption: string;
      context?: string;
    };

    const ai = getGeminiClient();
    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: `Write a brief, warm 2-sentence reflection from Amirbek (Amir) Orifjonov to Professor Lucy Turner about this Babson Summer Study July 2026 memory:
Caption: "${caption}"
Details: "${context || "Babson Summer Study virtual classroom session bridging Wellesley and Uzbekistan"}"
Highlight how Professor Turner's mentorship in this moment shaped Amirbek's approach to entrepreneurial leadership.`,
      config: {
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        systemInstruction:
          "Write in first-person ('I') from Amirbek to Professor Turner. Warm, genuine, concise (40-55 words max), no clichés.",
      },
    });

    res.json({
      insight: (response.text ?? "").trim(),
    });
  } catch (error: any) {
    console.error("Gemini memory insight error:", error);
    res.status(500).json({
      error:
        error?.message ||
        "Unable to generate memory insight at the moment.",
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
