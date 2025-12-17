import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Link } from "wouter";
import { Navigation } from "@/components/Navigation";
import { toast } from "sonner";
import { 
  Heart, Gift, Users, School, 
  CheckCircle2, ArrowLeft, CreditCard
} from "lucide-react";

const donationAmounts = [36, 72, 180, 360, 720, 1800];

const impactInfo = [
  { amount: 36, description: "צמיד התחייבות אחד", icon: Gift },
  { amount: 72, description: "ערכת שגריר בסיסית", icon: Users },
  { amount: 180, description: "סדנה לכיתה אחת", icon: School },
  { amount: 360, description: "תוכנית לבית ספר קטן", icon: School },
  { amount: 720, description: "קמפיין ברשתות חברתיות", icon: Heart },
  { amount: 1800, description: "תוכנית שנתית לבית ספר", icon: School },
];

export default function Donate() {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(180);
  const [customAmount, setCustomAmount] = useState("");
  const [frequency, setFrequency] = useState<"one_time" | "monthly">("one_time");
  const [isProcessing, setIsProcessing] = useState(false);

  const finalAmount = customAmount ? parseInt(customAmount) : selectedAmount;

  const handleDonate = async () => {
    if (!finalAmount || finalAmount < 5) {
      toast.error("סכום התרומה המינימלי הוא ₪5");
      return;
    }

    setIsProcessing(true);
    
    // TODO: Integrate with Stripe when keys are available
    // For now, show a message
    toast.info("מערכת התרומות תהיה זמינה בקרוב! תודה על הכוונה לתרום.");
    
    setTimeout(() => {
      setIsProcessing(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Navigation />

      {/* Hero */}
      <section className="section-padding bg-gradient-to-b from-primary/10 to-background">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <Heart className="h-16 w-16 text-primary mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              תרמו <span className="text-primary">לשינוי</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              התרומה שלכם מאפשרת לנו להמשיך ולפעול למען חברה טובה יותר.
              כל שקל עוזר להפיץ את המסר לעוד אנשים.
            </p>
          </div>
        </div>
      </section>

      {/* Donation Form */}
      <section className="section-padding">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Amount Selection */}
            <div>
              <h2 className="text-2xl font-bold mb-6">בחרו סכום</h2>
              
              {/* Frequency Toggle */}
              <div className="flex gap-2 mb-6">
                <Button
                  variant={frequency === "one_time" ? "default" : "outline"}
                  onClick={() => setFrequency("one_time")}
                  className={frequency === "one_time" ? "btn-brand" : ""}
                >
                  תרומה חד פעמית
                </Button>
                <Button
                  variant={frequency === "monthly" ? "default" : "outline"}
                  onClick={() => setFrequency("monthly")}
                  className={frequency === "monthly" ? "btn-brand" : ""}
                >
                  תרומה חודשית
                </Button>
              </div>

              {/* Amount Buttons */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                {donationAmounts.map((amount) => (
                  <Button
                    key={amount}
                    variant={selectedAmount === amount && !customAmount ? "default" : "outline"}
                    className={`h-16 text-lg ${selectedAmount === amount && !customAmount ? "btn-brand" : ""}`}
                    onClick={() => {
                      setSelectedAmount(amount);
                      setCustomAmount("");
                    }}
                  >
                    ₪{amount}
                  </Button>
                ))}
              </div>

              {/* Custom Amount */}
              <div className="mb-6">
                <label className="text-sm font-medium mb-2 block">או הזינו סכום אחר:</label>
                <div className="relative">
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">₪</span>
                  <Input
                    type="number"
                    min="5"
                    className="pr-8 text-lg h-12"
                    placeholder="סכום אחר"
                    value={customAmount}
                    onChange={(e) => {
                      setCustomAmount(e.target.value);
                      setSelectedAmount(null);
                    }}
                  />
                </div>
              </div>

              {/* Impact Info */}
              {finalAmount && (
                <Card className="bg-secondary/50">
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-2">מה התרומה שלכם מאפשרת:</h4>
                    {impactInfo
                      .filter((info) => info.amount <= (finalAmount || 0))
                      .slice(-1)
                      .map((info) => (
                        <div key={info.amount} className="flex items-center gap-3">
                          <info.icon className="h-5 w-5 text-primary" />
                          <span>{info.description}</span>
                        </div>
                      ))}
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Summary & Checkout */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>סיכום התרומה</CardTitle>
                  <CardDescription>
                    {frequency === "monthly" ? "תרומה חודשית קבועה" : "תרומה חד פעמית"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Amount Display */}
                  <div className="text-center py-6 bg-secondary/50 rounded-lg">
                    <div className="text-5xl font-bold text-primary mb-2">
                      ₪{finalAmount || 0}
                    </div>
                    {frequency === "monthly" && (
                      <div className="text-muted-foreground">לחודש</div>
                    )}
                  </div>

                  {/* Benefits */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span>קבלה לצורכי מס (סעיף 46)</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span>תשלום מאובטח</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span>אפשרות לבטל בכל עת</span>
                    </div>
                  </div>

                  {/* Donate Button */}
                  <Button 
                    className="w-full btn-brand h-14 text-lg"
                    onClick={handleDonate}
                    disabled={!finalAmount || isProcessing}
                  >
                    {isProcessing ? (
                      "מעבד..."
                    ) : (
                      <>
                        <CreditCard className="ml-2 h-5 w-5" />
                        תרמו עכשיו
                      </>
                    )}
                  </Button>

                  {/* Security Note */}
                  <p className="text-xs text-center text-muted-foreground">
                    התשלום מאובטח באמצעות Stripe. פרטי כרטיס האשראי שלכם לא נשמרים אצלנו.
                  </p>
                </CardContent>
              </Card>

              {/* Other Ways */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="text-lg">דרכים נוספות לתרום</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                  <div>
                    <strong>העברה בנקאית:</strong>
                    <p className="text-muted-foreground">בנק הפועלים, סניף 123, חשבון 456789</p>
                  </div>
                  <div>
                    <strong>צ'ק:</strong>
                    <p className="text-muted-foreground">לפקודת עמותת "לשון הרע לא מדבר אליי"</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="section-padding bg-secondary/50">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-8">לאן הולך הכסף?</h2>
            <div className="grid sm:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-primary mb-2">60%</div>
                  <p className="text-sm text-muted-foreground">תוכניות חינוכיות בבתי ספר</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-primary mb-2">25%</div>
                  <p className="text-sm text-muted-foreground">קמפיינים והסברה</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-primary mb-2">15%</div>
                  <p className="text-sm text-muted-foreground">תפעול והנהלה</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-background py-8">
        <div className="container text-center">
          <p className="text-sm opacity-70">
            © {new Date().getFullYear()} עמותת "לשון הרע לא מדבר אליי" (ע.ר.)
          </p>
        </div>
      </footer>
    </div>
  );
}
