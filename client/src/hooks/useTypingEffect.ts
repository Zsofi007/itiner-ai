import { useEffect, useState } from "react";

export function useTypingEffect(text: string, enabled: boolean, msPerChar = 12) {
  const [out, setOut] = useState("");

  useEffect(() => {
    if (!enabled || !text) {
      setOut(text);
      return;
    }
    setOut("");
    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      setOut(text.slice(0, i));
      if (i >= text.length) window.clearInterval(id);
    }, msPerChar);
    return () => window.clearInterval(id);
  }, [text, enabled, msPerChar]);

  return enabled ? out : text;
}
