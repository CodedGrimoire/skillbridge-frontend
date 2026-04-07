"use client";

import { useState } from "react";
import SectionContainer from "../../components/ui/SectionContainer";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Textarea from "../../components/ui/Textarea";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", topic: "support", message: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      setError("Please fill all required fields");
      return;
    }
    setError(null);
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSent(true);
    }, 500);
  };

  return (
    <SectionContainer className="py-12 space-y-6">
      <div className="space-y-2">
        <Badge tone="primary">Contact</Badge>
        <h1 className="text-3xl font-semibold text-text">Get in touch</h1>
        <p className="text-muted max-w-2xl">Support, product questions, or partnership inquiries—our team responds within one business day.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="p-6 space-y-3 lg:col-span-2">
          <h2 className="text-xl font-semibold">Contact form</h2>
          {error && <p className="text-danger text-sm">{error}</p>}
          {sent && <p className="text-success text-sm">Thanks! We received your message.</p>}
          <form className="space-y-3" onSubmit={onSubmit}>
            <div className="grid md:grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-muted mb-1">Name</p>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div>
                <p className="text-xs text-muted mb-1">Email</p>
                <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
              </div>
            </div>
            <div>
              <p className="text-xs text-muted mb-1">Topic</p>
              <select
                className="sb-input"
                value={form.topic}
                onChange={(e) => setForm({ ...form, topic: e.target.value })}
              >
                <option value="support">Support</option>
                <option value="product">Product question</option>
                <option value="partnership">Partnership</option>
              </select>
            </div>
            <div>
              <p className="text-xs text-muted mb-1">Message</p>
              <Textarea
                rows={5}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                required
              />
            </div>
            <Button type="submit" loading={sending}>Send message</Button>
          </form>
        </Card>

        <Card className="p-6 space-y-3">
          <h3 className="text-lg font-semibold">Contact options</h3>
          <div className="space-y-2 text-sm text-text">
            <p>Email: <a className="text-primary" href="mailto:support@skillbridge.ai">support@skillbridge.ai</a></p>
            <p>Sales: <a className="text-primary" href="mailto:hello@skillbridge.ai">hello@skillbridge.ai</a></p>
            <p>LinkedIn: <a className="text-primary" href="https://www.linkedin.com" target="_blank" rel="noreferrer">/company/skillbridge</a></p>
            <p>Twitter/X: <a className="text-primary" href="https://twitter.com" target="_blank" rel="noreferrer">@skillbridge</a></p>
          </div>
          <p className="text-xs text-muted">We typically reply within 24 hours on business days.</p>
        </Card>
      </div>
    </SectionContainer>
  );
}

