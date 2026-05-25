import { useEffect, useMemo, useRef, useState } from 'react';
import { Bot, FileText, Loader2, MessageSquareText, Send, Sparkles, UserRound } from 'lucide-react';
import AppShell from '../components/layout/AppShell';
import { getChatHistory, sendChatMessage } from '../api/chatApi';

const quickPrompts = [
  'Summarize my uploaded files',
  'Suggest charts for my data',
  'What business insights can I generate?',
  'Create a dashboard plan'
];

const formatDate = (value) => {
  if (!value) {
    return '';
  }

  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(new Date(value));
};

export default function ChatPage() {
  const bottomRef = useRef(null);
  const [history, setHistory] = useState([]);
  const [message, setMessage] = useState('');
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState('');

  const chatMessages = useMemo(() => {
    return history.flatMap((item) => [
      {
        id: `${item.id}-user`,
        role: 'user',
        content: item.userMessage,
        createdAt: item.createdAt
      },
      {
        id: `${item.id}-assistant`,
        role: 'assistant',
        content: item.assistantMessage,
        model: item.model,
        createdAt: item.createdAt
      }
    ]);
  }, [history]);

  const loadHistory = async () => {
    setIsLoadingHistory(true);
    setError('');

    try {
      const response = await getChatHistory();
      setHistory(response);
    } catch (historyError) {
      setError(historyError.response?.data?.message || 'Could not load chat history.');
    } finally {
      setIsLoadingHistory(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages.length, isSending]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const trimmedMessage = message.trim();
    if (!trimmedMessage) {
      return;
    }

    setIsSending(true);
    setError('');
    setMessage('');

    try {
      const response = await sendChatMessage(trimmedMessage);
      setHistory((current) => [...current, response]);
    } catch (chatError) {
      setError(chatError.response?.data?.message || 'Could not send message. Check backend and GitHub Models key.');
      setMessage(trimmedMessage);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <AppShell>
      <header className="border-b border-slate-200 bg-white px-4 py-4 dark:border-slate-800 dark:bg-slate-950 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-medium text-cyan-600 dark:text-cyan-300">AI workspace</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-normal text-slate-950 dark:text-white">AI Chat</h1>
          </div>
          <div className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
            <Sparkles size={16} aria-hidden="true" />
            GitHub Models
          </div>
        </div>
      </header>

      <div className="grid min-h-0 flex-1 gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[1fr_320px] lg:px-8">
        <section className="flex min-h-[calc(100vh-150px)] flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="border-b border-slate-200 px-5 py-4 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-md bg-cyan-50 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300">
                <MessageSquareText size={20} aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-slate-950 dark:text-white">Analytics Assistant</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">Ask about files, charts, dashboards, and insights.</p>
              </div>
            </div>
          </div>

          {error ? <p className="mx-5 mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}

          <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5">
            {isLoadingHistory ? (
              <div className="flex h-full items-center justify-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <Loader2 className="animate-spin" size={18} aria-hidden="true" />
                Loading chat history
              </div>
            ) : chatMessages.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <Bot className="text-slate-400" size={40} aria-hidden="true" />
                <p className="mt-3 text-sm font-semibold text-slate-900 dark:text-white">Start a new analysis conversation</p>
                <p className="mt-1 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
                  Ask for summaries, chart ideas, dashboard plans, or business insights from your uploaded file library.
                </p>
              </div>
            ) : (
              chatMessages.map((item) => {
                const isUser = item.role === 'user';
                const Icon = isUser ? UserRound : Bot;

                return (
                  <div className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`} key={item.id}>
                    {!isUser ? (
                      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-cyan-50 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300">
                        <Icon size={18} aria-hidden="true" />
                      </div>
                    ) : null}
                    <div className={`max-w-[min(760px,85%)] rounded-lg px-4 py-3 ${isUser ? 'bg-slate-950 text-white dark:bg-white dark:text-slate-950' : 'bg-slate-50 text-slate-800 dark:bg-slate-950 dark:text-slate-100'}`}>
                      <p className="whitespace-pre-wrap text-sm leading-6">{item.content}</p>
                      <p className={`mt-2 text-xs ${isUser ? 'text-slate-300 dark:text-slate-500' : 'text-slate-500 dark:text-slate-400'}`}>
                        {item.model ? `${item.model} - ` : ''}{formatDate(item.createdAt)}
                      </p>
                    </div>
                    {isUser ? (
                      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                        <Icon size={18} aria-hidden="true" />
                      </div>
                    ) : null}
                  </div>
                );
              })
            )}
            {isSending ? (
              <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
                <Loader2 className="animate-spin" size={18} aria-hidden="true" />
                DataStory AI is thinking
              </div>
            ) : null}
            <div ref={bottomRef} />
          </div>

          <form className="border-t border-slate-200 p-4 dark:border-slate-800" onSubmit={handleSubmit}>
            <div className="flex gap-3">
              <textarea
                className="min-h-12 flex-1 resize-none rounded-md border border-slate-300 px-3 py-3 text-sm outline-none transition focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:ring-cyan-950"
                maxLength={4000}
                onChange={(event) => setMessage(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && !event.shiftKey) {
                    event.preventDefault();
                    event.currentTarget.form?.requestSubmit();
                  }
                }}
                placeholder="Ask: summarize my PDF, suggest charts, find insights..."
                rows={1}
                value={message}
              />
              <button
                className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-cyan-600 text-white transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:bg-slate-400"
                disabled={isSending || !message.trim()}
                type="submit"
              >
                {isSending ? <Loader2 className="animate-spin" size={18} aria-hidden="true" /> : <Send size={18} aria-hidden="true" />}
              </button>
            </div>
          </form>
        </section>

        <aside className="space-y-5">
          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-base font-semibold text-slate-950 dark:text-white">Quick Prompts</h2>
            <div className="mt-4 space-y-2">
              {quickPrompts.map((prompt) => (
                <button
                  className="w-full rounded-md border border-slate-200 px-3 py-2 text-left text-sm font-medium text-slate-700 transition hover:border-cyan-500 hover:bg-cyan-50 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-cyan-950"
                  key={prompt}
                  onClick={() => setMessage(prompt)}
                  type="button"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-950 dark:text-white">
              <FileText size={18} aria-hidden="true" />
              Current Scope
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
              Chat can use your file names, file types, upload history, and previous messages. Full CSV, Excel, and PDF parsing will deepen answers in the next phase.
            </p>
          </section>
        </aside>
      </div>
    </AppShell>
  );
}
