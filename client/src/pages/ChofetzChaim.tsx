import { useState } from "react";
import { Link } from "wouter";
import { AIChatBox, Message } from "@/components/AIChatBox";
import { trpc } from "@/lib/trpc";
import { BookOpen, ArrowRight, Sparkles } from "lucide-react";

export default function ChofetzChaim() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "system",
      content: `אתה עוזר מומחה בהלכות לשון הרע ושמירת הלשון, מבוסס על ספרי החפץ חיים.
תפקידך לענות על שאלות בנושא לשון הרע, רכילות ושמירת הלשון.
ענה בעברית, בצורה ברורה ומכבדת.
כשרלוונטי, ציין מקורות מספרי החפץ חיים.
אם אינך בטוח בתשובה, אמור זאת בכנות.`
    }
  ]);

  const chatMutation = trpc.chofetzChaim.chat.useMutation({
    onSuccess: (response) => {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: response.answer
      }]);
    },
    onError: (error) => {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "מצטער, אירעה שגיאה. אנא נסה שוב."
      }]);
      console.error("Chat error:", error);
    }
  });

  const handleSendMessage = (content: string) => {
    const userMessage: Message = { role: "user", content };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    
    chatMutation.mutate({
      question: content,
      conversationHistory: messages.filter(m => m.role !== "system").slice(-10)
    });
  };

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b">
        <div className="container flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold">
              לשון הרע <span className="text-primary">לא מדבר</span> אליי
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">אודות</Link>
            <Link href="/activities" className="text-muted-foreground hover:text-foreground transition-colors">הפעילות שלנו</Link>
            <Link href="/join" className="text-muted-foreground hover:text-foreground transition-colors">הצטרפו אלינו</Link>
            <Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">צרו קשר</Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 bg-gradient-to-b from-primary/5 to-background">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
              <BookOpen className="w-5 h-5" />
              <span className="font-medium">בינה מלאכותית לשמירת הלשון</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              שאל את <span className="text-primary">החפץ חיים</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              צ'אטבוט חכם המבוסס על ספרי החפץ חיים בנושא שמירת הלשון.
              שאל שאלות וקבל תשובות מבוססות מקורות.
            </p>
          </div>
        </div>
      </section>

      {/* Chat Section */}
      <section className="py-8">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <AIChatBox
              messages={messages}
              onSendMessage={handleSendMessage}
              isLoading={chatMutation.isPending}
              placeholder="שאל שאלה בנושא שמירת הלשון..."
              height="500px"
              emptyStateMessage="שאל שאלה בנושא לשון הרע ושמירת הלשון"
              suggestedPrompts={[
                "מהי לשון הרע?",
                "מה ההבדל בין לשון הרע לרכילות?",
                "האם מותר לספר לשון הרע לתועלת?",
                "מה העונש על לשון הרע?",
                "איך אפשר לתקן לשון הרע?"
              ]}
            />
          </div>
        </div>
      </section>

      {/* Info Cards */}
      <section className="py-12 bg-muted/30">
        <div className="container">
          <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-6">
            <div className="bg-card p-6 rounded-xl border">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-bold mb-2">מבוסס על מקורות</h3>
              <p className="text-sm text-muted-foreground">
                התשובות מבוססות על ספרי החפץ חיים ופוסקים נוספים
              </p>
            </div>
            <div className="bg-card p-6 rounded-xl border">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-bold mb-2">בינה מלאכותית</h3>
              <p className="text-sm text-muted-foreground">
                טכנולוגיית AI מתקדמת להבנת שאלות ומתן תשובות מדויקות
              </p>
            </div>
            <div className="bg-card p-6 rounded-xl border">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <ArrowRight className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-bold mb-2">למידה מתמשכת</h3>
              <p className="text-sm text-muted-foreground">
                המערכת משתפרת כל הזמן עם תוכן ומקורות נוספים
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-8">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-sm text-muted-foreground">
              <strong>הערה:</strong> הצ'אטבוט מספק מידע כללי בלבד ואינו מהווה תחליף לפסיקת רב.
              לשאלות הלכתיות מעשיות, יש לפנות לרב מוסמך.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t">
        <div className="container text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} עמותת לשון הרע לא מדבר אליי. כל הזכויות שמורות.
          </p>
        </div>
      </footer>
    </div>
  );
}
