const DEV_BACKEND_URL = "http://localhost:5000"; // your backend dev URL

export async function sendMessage(message: string, userId: string) {
  const url = window.location.hostname === "localhost" ? `${DEV_BACKEND_URL}/chat` : "/chat";

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000); // 10s timeout

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userMessage: message, sessionId: userId }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!res.ok) throw new Error("Failed to fetch chat response");
    return res.json();
  } catch (err) {
    console.error("Chat fetch error:", err);
    return { botResponse: "Sorry, I'm having trouble connecting. Please try again later." };
  }
}