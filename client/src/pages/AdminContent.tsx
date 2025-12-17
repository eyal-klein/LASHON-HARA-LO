import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AdminContent() {
  return (
    <div className="container p-6" dir="rtl">
      <h1 className="text-3xl font-bold mb-6">ניהול תוכן</h1>
      
      <div className="grid gap-6">
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-xl font-bold mb-4">גלריה</h2>
            <p className="mb-4">ניהול תמונות וסרטונים בגלריה</p>
            <Button>נהל גלריה</Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h2 className="text-xl font-bold mb-4">פעילויות</h2>
            <p className="mb-4">ניהול אירועים והרצאות</p>
            <Button>נהל פעילויות</Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h2 className="text-xl font-bold mb-4">תוכן חופץ חיים</h2>
            <p className="mb-4">ניהול תוכן לצ'אטבוט</p>
            <Button>נהל תוכן</Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h2 className="text-xl font-bold mb-4">עמודים סטטיים</h2>
            <p className="mb-4">עריכת תוכן עמודי אודות, יצירת קשר וכו'</p>
            <Button>ערוך עמודים</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
