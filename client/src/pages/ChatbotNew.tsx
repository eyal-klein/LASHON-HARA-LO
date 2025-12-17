import { useState, useRef, useEffect } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, Send, Book, Sparkles, User, Bot } from "lucide-react";
import { Streamdown } from "streamdown";

function Header() {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container py-4">
        <nav className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <img src="/lh-logo.png" alt="לשון הרע לא מדבר אליי" className="h-12" />
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <Link href="/about" className="text-gray-600 hover:text-primary transition-colors">אודות</Link>
            <Link href="/activities-new" className="text-gray-600 hover:text-primary transition-colors">הפעילות שלנו</Link>
            <Link href="/gallery-new" className="text-gray-600 hover:text-primary transition-colors">גלריה</Link>
            <Link href="/join" className="text-gray-600 hover:text-primary transition-colors">הצטרפו אלינו</Link>
            <Link href="/donate" className="text-gray-600 hover:text-primary transition-colors">תרומה</Link>
            <Link href="/contact-new" className="text-gray-600 hover:text-primary transition-colors">צרו קשר</Link>
            <Link href="/chatbot-new" className="text-primary font-medium">שאל את חפץ חיים</Link>
          </div>
        </nav>
      </div>
    </header>
  );
}

interface Message {
  role: "user" | "assistant";
  content: string;
  sources?: Array<{ seif: number; klal: number; text: string }>;
}

export default function ChatbotNew() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data: stats } = trpc.chatbot.stats.useQuery();
  const { data: randomQuote } = trpc.chatbot.randomQuote.useQuery();

  const askMutation = trpc.chatbot.ask.useMutation({
    onSuccess: (data) => {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.answer,
          sources: data.sources,
        },
      ]);
      setIsTyping(false);
    },
    onError: () => {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "מצטער, אירעה שגיאה. נסה שוב.",
        },
      ]);
      setIsTyping(false);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMessage: Message = {
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    askMutation.mutate({
      question: input,
      conversationHistory: messages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
    });
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const suggestedQuestions = [
    "מה זה לשון הרע?",
    "מתי מותר לספר לשון הרע?",
    "מה ההבדל בין לשון הרע לרכילות?",
    "איך נזהרים מלשון הרע?",
  ];

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-l from-indigo-600 to-purple-600 text-white py-16">
        <div className="container">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              <Book className="h-12 w-12" />
              <h1 className="text-4xl md:text-5xl font-bold">
                שאל את חפץ חיים
              </h1>
            </div>
            <p className="text-xl text-indigo-100">
              שאל שאלות על הלכות לשון הרע ורכילות וקבל תשובות מבוססות על ספר חפץ חיים
            </p>
            {stats && (
              <div className="flex gap-6 mt-6">
                <div>
                  <div className="text-3xl font-bold">{stats.totalSeifim}</div>
                  <div className="text-sm text-indigo-200">סעיפים</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">{stats.totalKlalim}</div>
                  <div className="text-sm text-indigo-200">כללים</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Chat Section */}
      <section className="py-8">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            {/* Random Quote */}
            {randomQuote && messages.length === 0 && (
              <Card className="mb-6 bg-gradient-to-l from-purple-50 to-indigo-50 border-purple-200">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-purple-600" />
                    <CardTitle className="text-lg">ציטוט מחפץ חיים</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed">{randomQuote.text}</p>
                  <div className="mt-3 flex gap-2">
                    <Badge variant="outline">כלל {randomQuote.klal}</Badge>
                    <Badge variant="outline">סעיף {randomQuote.seif}</Badge>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Chat Card */}
            <Card className="shadow-lg">
              <CardHeader className="border-b">
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  שיחה עם חפץ חיים
                </CardTitle>
                <CardDescription>
                  שאל כל שאלה על הלכות לשון הרע ורכילות
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                {/* Messages */}
                <ScrollArea className="h-[500px] p-6" ref={scrollRef}>
                  {messages.length === 0 ? (
                    <div className="text-center py-12">
                      <Bot className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">התחל שיחה</h3>
                      <p className="text-muted-foreground mb-6">
                        שאל שאלה או בחר אחת מהשאלות המוצעות
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl mx-auto">
                        {suggestedQuestions.map((q, i) => (
                          <Button
                            key={i}
                            variant="outline"
                            className="text-right justify-start"
                            onClick={() => {
                              setInput(q);
                              setTimeout(() => {
                                const form = document.querySelector("form");
                                if (form) {
                                  form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
                                }
                              }, 100);
                            }}
                          >
                            {q}
                          </Button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {messages.map((message, index) => (
                        <div
                          key={index}
                          className={`flex gap-3 ${
                            message.role === "user" ? "justify-end" : "justify-start"
                          }`}
                        >
                          {message.role === "assistant" && (
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <Bot className="h-5 w-5 text-primary" />
                            </div>
                          )}
                          <div
                            className={`max-w-[80%] rounded-lg p-4 ${
                              message.role === "user"
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted"
                            }`}
                          >
                            <div className="prose prose-sm max-w-none dark:prose-invert">
                              <Streamdown>{message.content}</Streamdown>
                            </div>
                            {message.sources && message.sources.length > 0 && (
                              <div className="mt-3 pt-3 border-t border-border/50">
                                <div className="text-xs font-semibold mb-2">מקורות:</div>
                                <div className="flex flex-wrap gap-2">
                                  {message.sources.map((source, i) => (
                                    <Badge key={i} variant="secondary" className="text-xs">
                                      כלל {source.klal}, סעיף {source.seif}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                          {message.role === "user" && (
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                              <User className="h-5 w-5 text-primary-foreground" />
                            </div>
                          )}
                        </div>
                      ))}
                      {isTyping && (
                        <div className="flex gap-3">
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <Bot className="h-5 w-5 text-primary" />
                          </div>
                          <div className="bg-muted rounded-lg p-4">
                            <div className="flex gap-1">
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </ScrollArea>

                {/* Input */}
                <div className="border-t p-4">
                  <form onSubmit={handleSubmit} className="flex gap-2">
                    <Input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="שאל שאלה..."
                      disabled={isTyping}
                      className="flex-1"
                    />
                    <Button type="submit" disabled={isTyping || !input.trim()}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </form>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-12">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">לשון הרע לא מדבר אליי</h3>
              <p className="text-gray-400">
                עמותה ללא מטרות רווח למען הפצת המודעות לנזקי לשון הרע
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">קישורים מהירים</h4>
              <div className="space-y-2">
                <Link href="/about" className="block text-gray-400 hover:text-white transition-colors">אודות</Link>
                <Link href="/activities-new" className="block text-gray-400 hover:text-white transition-colors">הפעילות שלנו</Link>
                <Link href="/contact-new" className="block text-gray-400 hover:text-white transition-colors">צרו קשר</Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">צור קשר</h4>
              <p className="text-gray-400">
                info@lashonhara.co.il
              </p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} לשון הרע לא מדבר אליי. כל הזכויות שמורות.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
