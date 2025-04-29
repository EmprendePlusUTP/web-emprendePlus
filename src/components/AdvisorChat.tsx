// src/components/AdvisorChat.tsx
import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useUserContext } from "../contexts/UserContext";
import { askAdvisor } from "../services/advisor";
import ModaldoFace from "./ModaldoFace";
import ChatInput from "./ChatInput";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const STORAGE_KEY = "advisor_chat_messages";

export const AdvisorChat: React.FC = React.memo(() => {
  const ctx = useUserContext();
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const didInitial = useRef(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({
        behavior: didInitial.current ? "smooth" : "auto",
      });
      didInitial.current = true;
    }
  }, [messages]);

  const send = async (content: string) => {
    if (!content.trim() || loading) return;
    const userMsg: Message = { role: "user", content };
    setMessages((ms) => [...ms, userMsg]);
    setLoading(true);
    try {
      const reply = await askAdvisor({
        user_id: ctx.userId,
        user_name: ctx.userName,
        business_name: ctx.businessName,
        currency: ctx.currency,
        sales_history: Object.fromEntries(
          ctx.salesHistory.map(({ date, revenue }) => [date, revenue])
        ),
        top_product: ctx.topProduct.name,
        product_list: ctx.productList.map((p) => ({
          id: p.id,
          name: p.name,
          monthly_sales: p.monthlySales,
          supplier: p.supplier,
          stock: p.stock,
        })),
        message: content,
      });
      setMessages((ms) => [...ms, { role: "assistant", content: reply }]);
    } catch {
      setMessages((ms) => [
        ...ms,
        { role: "assistant", content: "❌ Error al conectar con el asesor." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-neutral-800 shadow-lg rounded-lg">
      <div
        className="flex-1 overflow-y-auto p-4 space-y-4
                       [&::-webkit-scrollbar]:w-2
  [&::-webkit-scrollbar-track]:rounded-full
  [&::-webkit-scrollbar-track]:bg-gray-100
  [&::-webkit-scrollbar-thumb]:rounded-full
  [&::-webkit-scrollbar-thumb]:bg-gray-300
  dark:[&::-webkit-scrollbar-track]:bg-neutral-700
  dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500"
      >
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${
              m.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {m.role === "assistant" && (
              <div className="mr-2 w-10 h-10 flex items-center justify-center bg-blue-300 rounded-full">
                <ModaldoFace />
              </div>
            )}
            <div
              className={`max-w-[70%] p-3 rounded-lg ${
                m.role === "user"
                  ? "bg-blue-100 text-gray-800 dark:bg-blue-900 dark:text-white"
                  : "bg-gray-100 text-gray-800 dark:bg-neutral-700 dark:text-neutral-200"
              }`}
            >
              {m.role === "assistant" ? (
                <div className="prose prose-sm dark:prose-invert">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {m.content}
                  </ReactMarkdown>
                </div>
              ) : (
                m.content
              )}
            </div>
          </div>
        ))}
        <div ref={scrollRef} />
      </div>
      <ChatInput onSend={send} loading={loading} />
    </div>
  );
});
