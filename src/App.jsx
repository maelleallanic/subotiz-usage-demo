import { useEffect, useState } from "react";
import { createCheckoutSession, processPayment, TOKEN_PACKS } from "./subotiz";

export default function App() {
  const [tokens, setTokens] = useState(0);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  async function buyTokens() {
    const pack = TOKEN_PACKS[0];
    const session = await createCheckoutSession(pack.priceId, pack.tokens);
    if (session.data?.session_url) {
      window.location.href = session.data.session_url;
    } else {
      console.error("no session url", session);
    }
  }

  async function sendMessage() {
    if (!input.trim() || tokens < 1) return;

    const res = await fetch("/api/use-token", {
      method: "POST",
    });

    const data = await res.json();

    if (!res.ok) {
      console.error(data);
      setTokens(data.tokens || 0);
      return;
    }

    setMessages((m) => [...m, { user: input, bot: "meow" }]);
    setTokens(data.tokens);
    setInput("");
  }

  useEffect(() => {
    async function loadTokens() {
      const res = await fetch("/api/tokens");
      const data = await res.json();
      setTokens(data.tokens);
    }

    loadTokens();
  }, []);

  return (
    <div style={{ maxWidth: 400, margin: "40px auto", fontFamily: "monospace" }}>
      <h2>meowbot</h2>
      <p>tokens: {tokens}</p>
      <button onClick={buyTokens}>buy 1 token ($5.00)</button>

      <div style={{ marginTop: 20 }}>
        {messages.map((m, i) => (
          <div key={i}>
            <p>you: {m.user}</p>
            <p>bot: {m.bot}</p>
          </div>
        ))}
      </div>

      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        placeholder="type anything..."
        disabled={tokens < 1}
      />
      <button onClick={sendMessage} disabled={tokens < 1}>send (1 token)</button>
    </div>
  );
}