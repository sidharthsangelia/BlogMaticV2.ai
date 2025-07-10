"use server";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY!;
if (!OPENAI_API_KEY) throw new Error("OPENAI_API_KEY is missing");

interface WhisperOptions {
  url: string;
  language?: string;
}

/* ───────────── 1. Transcribe via Whisper ───────────── */
export async function transcribeWithWhisper({
  url,
  language = "en",
}: WhisperOptions): Promise<string> {
  const videoRes = await fetch(url);
  if (!videoRes.ok) throw new Error("Couldn't fetch media");
  const data = new Uint8Array(await videoRes.arrayBuffer());

  const form = new FormData();
  form.append("model", "whisper-1");
  form.append(
    "file",
    new Blob([data], {
      type: videoRes.headers.get("content-type") || "video/mp4",
    }),
    "upload.mp4"
  );
  form.append("language", language);
  form.append("temperature", "0");

  const whisperRes = await fetch(
    "https://api.openai.com/v1/audio/transcriptions",
    { method: "POST", headers: { Authorization: `Bearer ${OPENAI_API_KEY}` }, body: form }
  );
  if (!whisperRes.ok) {
    const err = await whisperRes.json().catch(() => ({}));
    throw new Error(`Whisper failed (${whisperRes.status}): ${err.error?.message || "unknown"}`);
  }

  const { text } = (await whisperRes.json()) as { text: string };
  return text;
}

/* ───────────── 2. Make blog post from transcript ───────────── */
const systemPrompt = `You are a highly skilled and creative SEO blog writer with a knack for crafting engaging, human-centric content. Your mission is to transform a provided transcript into an exceptional blog post that not only ranks well but also resonates deeply with readers.

Your final output must be in JSON format, structured with the following keys:

{
  "title": "Your SEO-optimized H1 title goes here",
  "metaDescription": "A concise, keyword-rich meta description (50-160 characters) summarizing the blog post for search engines.",
  "slug": "a-seo-friendly-url-slug-with-keywords-hyphenated",
  "focusKeywords": [
    "primary keyword",
    "secondary keyword 1", 
    "secondary keyword 2"
  ],
  "relatedKeywords": [
    "related term 1",
    "related term 2",
    "long-tail keyword phrase"
  ],
  "content": [
    {
      "type": "paragraph",
      "text": "Your engaging introduction starts here..."
    },
    {
      "type": "heading",
      "level": 2,
      "text": "First Main Section Heading (H2)"
    },
    {
      "type": "paragraph", 
      "text": "Content for the first section..."
    }
  ],
  "conclusion": "Your insightful conclusion, summarizing key points and encouraging further engagement or action."
}

Instructions for Content Generation:
Constraints:
- Your output must be a single JSON object.
- Do NOT include commentary, Markdown formatting, or additional keys.
- Do NOT repeat the blog title in the content.
- Do NOT include text outside the JSON.
- Output only valid JSON, no extra text before or after.

Originality:
- Do NOT copy any sentence from the transcript directly.
- Paraphrase and summarize with added insight and flow.

Voice:
- Tone must feel like a friendly, helpful blog written by a real person—not robotic or AI-generated.`;

/**
 * Full pipeline: URL → transcript → HTML blog post
 */
export async function generateBlogFromVideo(url: string, language = "en") {
  // 1️⃣ get transcript
  const transcript = await transcribeWithWhisper({ url, language });

  // 2️⃣ send to GPT‑4o (or gpt‑4)
  const chatRes = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o",          // cheaper & just as good
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Here is the transcript:\n\n${transcript}` },
      ],
      temperature: 0.7,
      max_tokens: 2048,
    }),
  });

  if (!chatRes.ok) {
    const err = await chatRes.json().catch(() => ({}));
    throw new Error(`GPT failed (${chatRes.status}): ${err.error?.message || "unknown"}`);
  }

  const data = await chatRes.json();
  const blogPostJsonString: string = data.choices[0].message.content;
  
  // 🔥 FIX: Parse the JSON string to get the actual object
  let blogPostData;
  try {
    blogPostData = JSON.parse(blogPostJsonString);
  } catch (parseError) {
    console.error("Failed to parse JSON from OpenAI:", parseError);
    console.error("Raw content:", blogPostJsonString);
    throw new Error("OpenAI returned invalid JSON");
  }
  
  console.log("Transcript:", transcript);
  console.log("Parsed blog data:", blogPostData);
  
  return { transcript, blogPostHtml: blogPostData };
}