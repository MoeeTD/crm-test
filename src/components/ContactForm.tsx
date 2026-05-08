"use client";

import { useEffect, useState } from "react";

interface Company {
  id: string;
  name: string;
}

interface ContactFormProps {
  initial?: {
    name: string;
    email: string;
    phone: string;
    role: string;
    companyId: string;
  };
  onSubmit: (data: Record<string, string>) => Promise<void>;
  onCancel: () => void;
  submitLabel?: string;
}

export default function ContactForm({ initial, onSubmit, onCancel, submitLabel = "Save" }: ContactFormProps) {
  const [form, setForm] = useState({
    name: initial?.name ?? "",
    email: initial?.email ?? "",
    phone: initial?.phone ?? "",
    role: initial?.role ?? "",
    companyId: initial?.companyId ?? "",
  });
  const [companies, setCompanies] = useState<Company[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/companies").then((r) => r.json()).then(setCompanies);
  }, []);

  const field = (key: keyof typeof form) => ({
    value: form[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
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
        <label className="label">Name *</label>
        <input required className="input" {...field("name")} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label">Email</label>
          <input type="email" className="input" {...field("email")} />
        </div>
        <div>
          <label className="label">Phone</label>
          <input className="input" {...field("phone")} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label">Role</label>
          <input className="input" {...field("role")} />
        </div>
        <div>
          <label className="label">Company</label>
          <select className="input" {...field("companyId")}>
            <option value="">— None —</option>
            {companies.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
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
