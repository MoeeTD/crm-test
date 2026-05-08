"use client";

import { useState } from "react";

interface CompanyFormProps {
  initial?: {
    name: string;
    website: string;
    industry: string;
    phone: string;
    address: string;
  };
  onSubmit: (data: Record<string, string>) => Promise<void>;
  onCancel: () => void;
  submitLabel?: string;
}

export default function CompanyForm({ initial, onSubmit, onCancel, submitLabel = "Save" }: CompanyFormProps) {
  const [form, setForm] = useState({
    name: initial?.name ?? "",
    website: initial?.website ?? "",
    industry: initial?.industry ?? "",
    phone: initial?.phone ?? "",
    address: initial?.address ?? "",
  });
  const [saving, setSaving] = useState(false);

  const field = (key: keyof typeof form) => ({
    value: form[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
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
        <label className="label">Company Name *</label>
        <input required className="input" {...field("name")} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label">Website</label>
          <input className="input" placeholder="https://…" {...field("website")} />
        </div>
        <div>
          <label className="label">Industry</label>
          <input className="input" {...field("industry")} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label">Phone</label>
          <input className="input" {...field("phone")} />
        </div>
        <div>
          <label className="label">Address</label>
          <input className="input" {...field("address")} />
        </div>
      </div>
      <div className="flex justify-end gap-2 pt-1">
        <button type="button" onClick={onCancel} className="btn-secondary">Cancel</button>
        <button type="submit" disabled={saving} className="btn-primary">{saving ? "Saving…" : submitLabel}</button>
      </div>
    </form>
  );
}
