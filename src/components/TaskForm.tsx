"use client";

import { useEffect, useState } from "react";

interface TaskFormProps {
  initial?: {
    title: string;
    description: string;
    dueDate: string;
    status: string;
    priority: string;
    contactId: string;
    companyId: string;
  };
  onSubmit: (data: Record<string, string>) => Promise<void>;
  onCancel: () => void;
  submitLabel?: string;
}

export default function TaskForm({ initial, onSubmit, onCancel, submitLabel = "Save" }: TaskFormProps) {
  const [form, setForm] = useState({
    title: initial?.title ?? "",
    description: initial?.description ?? "",
    dueDate: initial?.dueDate ?? "",
    status: initial?.status ?? "OPEN",
    priority: initial?.priority ?? "MEDIUM",
    contactId: initial?.contactId ?? "",
    companyId: initial?.companyId ?? "",
  });
  const [contacts, setContacts] = useState<{ id: string; name: string }[]>([]);
  const [companies, setCompanies] = useState<{ id: string; name: string }[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch("/api/contacts").then((r) => r.json()),
      fetch("/api/companies").then((r) => r.json()),
    ]).then(([c, co]) => { setContacts(c); setCompanies(co); });
  }, []);

  const field = (key: keyof typeof form) => ({
    value: form[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value })),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await onSubmit(form);
    setSaving(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="label">Title *</label>
        <input required className="input" {...field("title")} />
      </div>
      <div>
        <label className="label">Description</label>
        <textarea className="input min-h-[72px] resize-none" {...field("description")} />
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="label">Due Date</label>
          <input type="date" className="input" {...field("dueDate")} />
        </div>
        <div>
          <label className="label">Priority</label>
          <select className="input" {...field("priority")}>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
        </div>
        <div>
          <label className="label">Status</label>
          <select className="input" {...field("status")}>
            <option value="OPEN">Open</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="DONE">Done</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label">Contact</label>
          <select className="input" {...field("contactId")}>
            <option value="">— None —</option>
            {contacts.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Company</label>
          <select className="input" {...field("companyId")}>
            <option value="">— None —</option>
            {companies.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
      </div>
      <div className="flex justify-end gap-2 pt-1">
        <button type="button" onClick={onCancel} className="btn-secondary">Cancel</button>
        <button type="submit" disabled={saving} className="btn-primary">{saving ? "Saving…" : submitLabel}</button>
      </div>
    </form>
  );
}
