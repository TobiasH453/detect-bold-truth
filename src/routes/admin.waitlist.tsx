import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { listWaitlistSignups } from "@/lib/admin.functions";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const Route = createFileRoute("/admin/waitlist")({
  head: () => ({
    meta: [
      { title: "Waitlist Admin" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: WaitlistAdminPage,
});

type Signup = { id: string; email: string; created_at: string };

function WaitlistAdminPage() {
  const fetchSignups = useServerFn(listWaitlistSignups);
  const [password, setPassword] = useState("");
  const [signups, setSignups] = useState<Signup[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetchSignups({ data: { password } });
      setSignups(res.signups);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load");
      setSignups(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell showNav={false}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Waitlist signups</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Newest first. Enter the admin password to view.
          </p>
        </div>

        <form onSubmit={load} className="flex gap-2">
          <Input
            type="password"
            placeholder="Admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
          />
          <Button type="submit" disabled={loading || !password}>
            {loading ? "Loading…" : signups ? "Refresh" : "View"}
          </Button>
        </form>

        {error && (
          <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </div>
        )}

        {signups && (
          <div className="rounded-lg border border-border">
            <div className="px-4 py-2 border-b border-border text-xs uppercase tracking-widest text-muted-foreground font-semibold">
              {signups.length} signup{signups.length === 1 ? "" : "s"}
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Joined</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {signups.map((s, i) => (
                  <TableRow key={s.id}>
                    <TableCell className="text-muted-foreground">{i + 1}</TableCell>
                    <TableCell className="font-medium break-all">{s.email}</TableCell>
                    <TableCell className="text-muted-foreground whitespace-nowrap">
                      {new Date(s.created_at).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
                {signups.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-muted-foreground py-6">
                      No signups yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </AppShell>
  );
}
