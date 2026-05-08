"use client";

import { useState } from "react";

const PLATFORMS = ["INSTAGRAM", "TIKTOK", "YOUTUBE", "TWITTER", "FACEBOOK", "OTHER"] as const;
const NICHES = ["Beauty", "Fashion", "Fitness", "Food", "Gaming", "Lifestyle", "Tech", "Travel", "Other"];
const STATUSES = ["ACTIVE", "INACTIVE", "BLACKLISTED"] as const;
const SEXES = ["MALE", "FEMALE"] as const;
export const TRAITS = [
  { id: "face",        label: "Face" },
  { id: "voiceover",   label: "Voice Over" },
  { id: "speaking",    label: "Speaking" },
  { id: "hook_master", label: "Hook Master" },
  { id: "storytelling",label: "Storytelling" },
  { id: "comedy",      label: "Comedy" },
  { id: "educational", label: "Educational" },
  { id: "review",      label: "Review" },
  { id: "ugc",         label: "UGC" },
  { id: "trend_setter",label: "Trend Setter" },
];

interface InfluencerFormProps {
  initial?: {
    name: string;
    email: string;
    phone: string;
    phone2: string;
    location: string;
    city: string;
    sex: string;
    platform: string;
    handle: string;
    followers: string;
    engagementRate: string;
    niche: string;
    traits: string;
    ratePerPost: string;
    status: string;
  };
  onSubmit: (data: Record<string, string>) => Promise<void>;
  onCancel: () => void;
  submitLabel?: string;
}

export default function InfluencerForm({ initial, onSubmit, onCancel, submitLabel = "Save" }: InfluencerFormProps) {
  const [form, setForm] = useState({
    name: initial?.name ?? "",
    email: initial?.email ?? "",
    phone: initial?.phone ?? "",
    phone2: initial?.phone2 ?? "",
    location: initial?.location ?? "",
    city: initial?.city ?? "",
    sex: initial?.sex ?? "",
    platform: initial?.platform ?? "INSTAGRAM",
    handle: initial?.handle ?? "",
    followers: initial?.followers ?? "",
    engagementRate: initial?.engagementRate ?? "",
    niche: initial?.niche ?? "",
    ratePerPost: initial?.ratePerPost ?? "",
    status: initial?.status ?? "ACTIVE",
  });
  const [selectedTraits, setSelectedTraits] = useState<Set<string>>(
    () => new Set((initial?.traits ?? "").split(",").filter(Boolean))
  );
  const [saving, setSaving] = useState(false);

  const field = (key: keyof typeof form) => ({
    value: form[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value })),
  });

  const toggleTrait = (id: string) => {
    setSelectedTraits((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await onSubmit({ ...form, traits: Array.from(selectedTraits).join(",") });
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
          <label className="label">Phone 1</label>
          <input className="input" {...field("phone")} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label">Phone 2</label>
          <input className="input" {...field("phone2")} />
        </div>
        <div />
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="label">City</label>
          <input className="input" placeholder="e.g. Riyadh" {...field("city")} />
        </div>
        <div>
          <label className="label">Country</label>
          <input className="input" placeholder="e.g. Saudi Arabia" {...field("location")} />
        </div>
        <div>
          <label className="label">Sex</label>
          <select className="input" {...field("sex")}>
            <option value="">— Select —</option>
            {SEXES.map((s) => (
              <option key={s} value={s}>{s.charAt(0) + s.slice(1).toLowerCase()}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label">Handle</label>
          <input className="input" placeholder="@username" {...field("handle")} />
        </div>
        <div>
          <label className="label">Primary Platform</label>
          <select className="input" {...field("platform")}>
            {PLATFORMS.map((p) => (
              <option key={p} value={p}>{p.charAt(0) + p.slice(1).toLowerCase()}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label">Niche</label>
          <select className="input" {...field("niche")}>
            <option value="">— Select —</option>
            {NICHES.map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Status</label>
          <select className="input" {...field("status")}>
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s.charAt(0) + s.slice(1).toLowerCase()}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="label">Followers</label>
          <input type="number" min="0" className="input" {...field("followers")} />
        </div>
        <div>
          <label className="label">Eng. Rate (%)</label>
          <input type="number" min="0" max="100" step="0.1" className="input" {...field("engagementRate")} />
        </div>
        <div>
          <label className="label">Rate / Post ($)</label>
          <input type="number" min="0" step="0.01" className="input" {...field("ratePerPost")} />
        </div>
      </div>
      <div>
        <label className="label mb-2">Traits</label>
        <div className="flex flex-wrap gap-2">
          {TRAITS.map(({ id, label }) => {
            const on = selectedTraits.has(id);
            return (
              <button
                key={id}
                type="button"
                onClick={() => toggleTrait(id)}
                className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                  on
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-slate-600 border-slate-300 hover:border-blue-400"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>
      <div className="flex justify-end gap-2 pt-1">
        <button type="button" onClick={onCancel} className="btn-secondary">Cancel</button>
        <button type="submit" disabled={saving} className="btn-primary">{saving ? "Saving…" : submitLabel}</button>
      </div>
    </form>
  );
}
