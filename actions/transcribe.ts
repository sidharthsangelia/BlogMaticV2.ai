"use server";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY!;
if (!OPENAI_API_KEY) throw new Error("OPENAI_API_KEY is missing");

interface WhisperOptions {
  url: string;
  language?: string;
  
}

interface BlogOptions {
  variation: number;
  tone: string;
  audience: string;
}

export async function getFormData(formData: FormData) {
  const variation = formData.get("variation");
  const tone = formData.get("tone");
  const audience = formData.get("audience");
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


/**
 * Full pipeline: URL → transcript → HTML blog post
 */
export async function generateBlogFromVideo(url: string, language = "en" , {variation, tone , audience}: BlogOptions) {

  const systemPrompt = `You are a highly skilled and creative SEO blog writer with a knack for crafting engaging, human-centric content. Your mission is to transform a provided transcript into an exceptional blog post that not only ranks well but also resonates deeply with readers.

**Writing Style & Tone:**
- Tone: ${tone} (adapt your writing style to match this tone throughout the entire blog post)
- Target Audience: ${audience} (tailor your language, examples, and complexity level specifically for this audience)
- Content Variation: ${variation === 1 ? 'Standard informative approach' : variation === 2 ? 'Story-driven narrative style' : variation === 3 ? 'Problem-solution focused structure' : variation === 4 ? 'Step-by-step tutorial format' : 'Comprehensive guide with actionable insights'}

**Content Structure Guidelines:**
${variation === 1 ? 
  '- Use clear, informative sections with logical flow\n- Include data points and factual information\n- Maintain professional yet accessible language' : 
  variation === 2 ? 
  '- Begin with a compelling story or anecdote\n- Weave narrative elements throughout\n- Use personal examples and relatable scenarios\n- End with a memorable story conclusion' :
  variation === 3 ?
  '- Start by identifying a specific problem\n- Present the problem with real-world context\n- Offer multiple solution approaches\n- Conclude with actionable next steps' :
  variation === 4 ?
  '- Structure content as a clear step-by-step process\n- Use numbered sections for main steps\n- Include practical examples for each step\n- Provide troubleshooting tips where relevant' :
  '- Create comprehensive coverage of the topic\n- Include multiple perspectives and approaches\n- Provide actionable takeaways in each section\n- End with a detailed action plan'
}

**Tone-Specific Instructions:**
${tone === 'professional' ? 
  '- Use industry terminology appropriately\n- Maintain formal yet approachable language\n- Include credible references and data\n- Avoid casual expressions or slang' :
  tone === 'conversational' ?
  '- Write as if speaking directly to a friend\n- Use contractions and casual language\n- Include rhetorical questions to engage readers\n- Add personal touches and relatable examples' :
  tone === 'authoritative' ?
  '- Demonstrate expertise through confident language\n- Use definitive statements backed by evidence\n- Include industry insights and best practices\n- Position yourself as a thought leader' :
  tone === 'friendly' ?
  '- Use warm, welcoming language throughout\n- Include encouraging and supportive phrases\n- Make complex topics feel approachable\n- Use inclusive language that makes readers feel valued' :
  tone === 'educational' ?
  '- Break down complex concepts into digestible parts\n- Use analogies and metaphors for clarity\n- Include definitions for technical terms\n- Structure information in a logical learning sequence' :
  '- Balance professionalism with approachability\n- Use clear, concise language\n- Include helpful examples and practical applications'
}

**Audience-Specific Considerations:**
${audience === 'beginners' ?
  '- Define technical terms and jargon\n- Use simple, clear explanations\n- Include foundational concepts before advanced topics\n- Provide encouraging language for newcomers' :
  audience === 'professionals' ?
  '- Use industry-standard terminology\n- Focus on advanced strategies and insights\n- Include industry-specific examples and case studies\n- Assume foundational knowledge exists' :
  audience === 'entrepreneurs' ?
  '- Emphasize business applications and ROI\n- Include scaling strategies and growth tactics\n- Focus on practical implementation and results\n- Use business-oriented language and metrics' :
  audience === 'students' ?
  '- Structure content for learning and retention\n- Include study tips and key takeaways\n- Use examples relevant to academic contexts\n- Provide clear learning objectives' :
  audience === 'general' ?
  '- Use accessible language for diverse backgrounds\n- Include varied examples to appeal to different interests\n- Balance technical depth with broad appeal\n- Avoid assuming specialized knowledge' :
  '- Adapt language and examples to your target demographic\n- Consider their primary interests and pain points\n- Use relevant cultural references and contexts'
}

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

**Instructions for Content Generation:**

**Constraints:**
- Your output must be a single JSON object.
- Do NOT include commentary, Markdown formatting, or additional keys.
- Do NOT repeat the blog title in the content.
- Do NOT include text outside the JSON.
- Output only valid JSON, no extra text before or after.

**Originality:**
- Do NOT copy any sentence from the transcript directly.
- Paraphrase and summarize with added insight and flow.
- Add your own analysis, context, and valuable insights.

**Voice & Style:**
- Tone must feel like a friendly, helpful blog written by a real person—not robotic or AI-generated.
- Seamlessly integrate the specified tone (${tone}) throughout the entire piece.
- Write specifically for your target audience (${audience}) with appropriate language and examples.
- Follow the content variation style (${variation === 1 ? 'informative' : variation === 2 ? 'narrative' : variation === 3 ? 'problem-solution' : variation === 4 ? 'tutorial' : 'comprehensive guide'}) consistently.

**SEO Optimization:**
- Naturally incorporate focus keywords throughout the content without keyword stuffing.
- Use semantic variations and related terms to improve topical relevance.
- Structure headings (H2, H3) to improve readability and SEO.
- Ensure meta description is compelling and includes primary keywords.
- Create a URL slug that's both SEO-friendly and user-friendly.

**Content Quality:**
- Provide genuine value and actionable insights beyond the original transcript.
- Use transition sentences to create smooth flow between sections.
- Include specific examples, statistics, or case studies where relevant.
- End with a strong conclusion that reinforces key messages and encourages engagement.`;


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