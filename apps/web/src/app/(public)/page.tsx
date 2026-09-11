"use client";

import { useState } from "react";
import { submitFeedback } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function Home() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatus("submitting");
    setError(null);
    try {
      await submitFeedback(form);
      setStatus("success");
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Could not submit feedback");
    }
  };

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-10 px-4 py-16">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight">Welcome to Frehaymanot</h1>
        <p className="mt-2 text-muted-foreground">
          Sunday school resources, mezmurs, courses, and announcements.
        </p>
      </div>

      <section className="rounded-xl border bg-card p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Send feedback</h2>
        <p className="mt-1 mb-6 text-sm text-muted-foreground">
          Tell us how we can improve the site. Dashboard admins will review your message.
        </p>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Name
              </label>
              <Input
                id="name"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="message" className="text-sm font-medium">
              Message
            </label>
            <Textarea
              id="message"
              required
              rows={5}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
            />
          </div>
          {status === "success" && (
            <p className="text-sm text-green-700 dark:text-green-400">Thank you. Your feedback was sent.</p>
          )}
          {status === "error" && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" disabled={status === "submitting"}>
            {status === "submitting" ? "Sending..." : "Submit feedback"}
          </Button>
        </form>
      </section>
    </main>
  );
}
