import { trpc } from "@/lib/trpc";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function AdminUsers() {
  const { data: commitments } = trpc.commitments.list.useQuery({ limit: 100, offset: 0 });
  const { data: subscribers } = trpc.subscribers.list.useQuery({ page: 1, limit: 100 });

  return (
    <div className="container p-6" dir="rtl">
      <h1 className="text-3xl font-bold mb-6">ניהול משתמשים</h1>
      
      <Card className="mb-6">
        <CardContent className="pt-6">
          <h2 className="text-xl font-bold mb-4">התחייבויות ({commitments?.length || 0})</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>שם</TableHead>
                <TableHead>אימייל</TableHead>
                <TableHead>טלפון</TableHead>
                <TableHead>תאריך</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {commitments?.slice(0, 10).map((c) => (
                <TableRow key={c.id}>
                  <TableCell>{c.name}</TableCell>
                  <TableCell>{c.email}</TableCell>
                  <TableCell>{c.phone}</TableCell>
                  <TableCell>{new Date(c.createdAt!).toLocaleDateString("he-IL")}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <h2 className="text-xl font-bold mb-4">מנויים לניוזלטר ({subscribers?.total || 0})</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>אימייל</TableHead>
                <TableHead>שם</TableHead>
                <TableHead>סטטוס</TableHead>
                <TableHead>תאריך</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subscribers?.items.slice(0, 10).map((s) => (
                <TableRow key={s.id}>
                  <TableCell>{s.email}</TableCell>
                  <TableCell>{s.firstName} {s.lastName}</TableCell>
                  <TableCell><Badge variant={s.isActive ? "default" : "secondary"}>{s.isActive ? "פעיל" : "לא פעיל"}</Badge></TableCell>
                  <TableCell>{new Date(s.createdAt!).toLocaleDateString("he-IL")}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
