"use client";

import { useEffect, useState, useMemo } from "react";
import Modal from "@/components/Modal";
import InfluencerForm, { TRAITS } from "@/components/InfluencerForm";

interface Influencer {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  phone2: string | null;
  location: string | null;
  city: string | null;
  sex: string | null;
  platform: string;
  handle: string | null;
  followers: number | null;
  engagementRate: number | null;
  niche: string | null;
  traits: string | null;
  ratePerPost: number | null;
  status: string;
}

const PLATFORM_COLORS: Record<string, string> = {
  INSTAGRAM: "bg-pink-100 text-pink-700",
  TIKTOK: "bg-slate-800 text-white",
  YOUTUBE: "bg-red-100 text-red-700",
  TWITTER: "bg-sky-100 text-sky-700",
  FACEBOOK: "bg-blue-100 text-blue-700",
  OTHER: "bg-slate-100 text-slate-600",
};

const STATUS_COLORS: Record<string, string> = {
  ACTIVE: "bg-emerald-100 text-emerald-700",
  INACTIVE: "bg-slate-100 text-slate-500",
  BLACKLISTED: "bg-red-100 text-red-700",
};

const SEX_COLORS: Record<string, string> = {
  MALE: "bg-blue-100 text-blue-700",
  FEMALE: "bg-fuchsia-100 text-fuchsia-700",
};

const TRAIT_LABEL: Record<string, string> = Object.fromEntries(TRAITS.map((t) => [t.id, t.label]));

const PLATFORMS = ["INSTAGRAM", "TIKTOK", "YOUTUBE", "TWITTER", "FACEBOOK", "OTHER"];
const STATUSES = ["ACTIVE", "INACTIVE", "BLACKLISTED"];
const SEXES = ["MALE", "FEMALE"];

function capitalize(s: string) {
  return s.charAt(0) + s.slice(1).toLowerCase();
}

function formatFollowers(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return n.toString();
}

function TraitsBadges({ raw }: { raw: string | null }) {
  if (!raw) return <span className="text-slate-300">—</span>;
  const ids = raw.split(",").filter(Boolean);
  const visible = ids.slice(0, 3);
  const rest = ids.length - 3;
  return (
    <div className="flex flex-wrap gap-1">
      {visible.map((id) => (
        <span key={id} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-50 text-indigo-700">
          {TRAIT_LABEL[id] ?? id}
        </span>
      ))}
      {rest > 0 && (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-500">
          +{rest}
        </span>
      )}
    </div>
  );
}

export default function InfluencersPage() {
  const [influencers, setInfluencers] = useState<Influencer[]>([]);
  const [search, setSearch] = useState("");
  const [platformFilter, setPlatformFilter] = useState("");
  const [nicheFilter, setNicheFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sexFilter, setSexFilter] = useState("");
  const [traitFilter, setTraitFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Influencer | null>(null);

  const reload = () => {
    fetch("/api/influencers").then((r) => r.json()).then(setInfluencers);
  };

  useEffect(() => { reload(); }, []);

  const niches = useMemo(() => {
    const set = new Set<string>();
    influencers.forEach((i) => { if (i.niche) set.add(i.niche); });
    return Array.from(set).sort();
  }, [influencers]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return influencers.filter((i) => {
      if (q && !i.name.toLowerCase().includes(q) && !(i.handle?.toLowerCase().includes(q))) return false;
      if (platformFilter && i.platform !== platformFilter) return false;
      if (nicheFilter && i.niche !== nicheFilter) return false;
      if (statusFilter && i.status !== statusFilter) return false;
      if (sexFilter && i.sex !== sexFilter) return false;
      if (traitFilter && !i.traits?.split(",").includes(traitFilter)) return false;
      return true;
    });
  }, [influencers, search, platformFilter, nicheFilter, statusFilter, sexFilter]);

  const handleCreate = async (data: Record<string, string>) => {
    await fetch("/api/influencers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setShowModal(false);
    reload();
  };

  const handleEdit = async (data: Record<string, string>) => {
    if (!editing) return;
    await fetch(`/api/influencers/${editing.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setEditing(null);
    reload();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this influencer?")) return;
    await fetch(`/api/influencers/${id}`, { method: "DELETE" });
    reload();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Influencers</h1>
          <p className="text-sm text-slate-500 mt-0.5">{filtered.length} influencers</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary">+ New Influencer</button>
      </div>

      <div className="flex flex-wrap gap-3 mb-5">
        <input
          className="input max-w-xs"
          placeholder="Search by name or handle…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select className="filter-select" value={platformFilter} onChange={(e) => setPlatformFilter(e.target.value)}>
          <option value="">All Platforms</option>
          {PLATFORMS.map((p) => <option key={p} value={p}>{capitalize(p)}</option>)}
        </select>
        {niches.length > 0 && (
          <select className="filter-select" value={nicheFilter} onChange={(e) => setNicheFilter(e.target.value)}>
            <option value="">All Niches</option>
            {niches.map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        )}
        <select className="filter-select" value={sexFilter} onChange={(e) => setSexFilter(e.target.value)}>
          <option value="">All</option>
          {SEXES.map((s) => <option key={s} value={s}>{capitalize(s)}</option>)}
        </select>
        <select className="filter-select" value={traitFilter} onChange={(e) => setTraitFilter(e.target.value)}>
          <option value="">All Traits</option>
          {TRAITS.map(({ id, label }) => <option key={id} value={id}>{label}</option>)}
        </select>
        <select className="filter-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All Statuses</option>
          {STATUSES.map((s) => <option key={s} value={s}>{capitalize(s)}</option>)}
        </select>
      </div>

      <div className="table-wrap overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-slate-200 bg-slate-50">
            <tr>
              <th className="th">Name</th>
              <th className="th">Sex</th>
              <th className="th">Platform</th>
              <th className="th">Handle</th>
              <th className="th">Followers</th>
              <th className="th">Eng. Rate</th>
              <th className="th">Niche</th>
              <th className="th">Traits</th>
              <th className="th">Rate / Post</th>
              <th className="th">Status</th>
              <th className="th"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.length === 0 && (
              <tr>
                <td colSpan={11} className="px-6 py-12 text-center text-sm text-slate-400">
                  No influencers found.
                </td>
              </tr>
            )}
            {filtered.map((inf) => (
              <tr key={inf.id} className="hover:bg-slate-50 transition-colors">
                <td className="td">
                  <button
                    onClick={() => setEditing(inf)}
                    className="font-semibold text-slate-900 whitespace-nowrap hover:text-blue-600 transition-colors text-left"
                  >
                    {inf.name}
                  </button>
                  {(inf.city || inf.location) && (
                    <div className="text-xs text-slate-400">
                      {[inf.city, inf.location].filter(Boolean).join(", ")}
                    </div>
                  )}
                </td>
                <td className="td">
                  {inf.sex ? (
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${SEX_COLORS[inf.sex] ?? "bg-slate-100 text-slate-600"}`}>
                      {capitalize(inf.sex)}
                    </span>
                  ) : <span className="text-slate-300">—</span>}
                </td>
                <td className="td">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${PLATFORM_COLORS[inf.platform] ?? "bg-slate-100 text-slate-600"}`}>
                    {capitalize(inf.platform)}
                  </span>
                </td>
                <td className="td text-slate-600">{inf.handle ?? <span className="text-slate-300">—</span>}</td>
                <td className="td text-slate-600 tabular-nums whitespace-nowrap">
                  {inf.followers != null ? formatFollowers(inf.followers) : <span className="text-slate-300">—</span>}
                </td>
                <td className="td text-slate-600 tabular-nums whitespace-nowrap">
                  {inf.engagementRate != null ? `${inf.engagementRate.toFixed(1)}%` : <span className="text-slate-300">—</span>}
                </td>
                <td className="td">
                  {inf.niche ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-violet-100 text-violet-700">
                      {inf.niche}
                    </span>
                  ) : <span className="text-slate-300">—</span>}
                </td>
                <td className="td min-w-[160px]">
                  <TraitsBadges raw={inf.traits} />
                </td>
                <td className="td text-slate-600 tabular-nums whitespace-nowrap">
                  {inf.ratePerPost != null ? `$${inf.ratePerPost.toLocaleString()}` : <span className="text-slate-300">—</span>}
                </td>
                <td className="td">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[inf.status] ?? "bg-slate-100 text-slate-600"}`}>
                    {capitalize(inf.status)}
                  </span>
                </td>
                <td className="td">
                  <div className="flex gap-2">
                    <button onClick={() => setEditing(inf)} className="text-xs text-slate-500 hover:text-blue-600 font-medium">Edit</button>
                    <button onClick={() => handleDelete(inf.id)} className="text-xs text-slate-500 hover:text-red-600 font-medium">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <Modal title="New Influencer" onClose={() => setShowModal(false)}>
          <InfluencerForm onSubmit={handleCreate} onCancel={() => setShowModal(false)} submitLabel="Create Influencer" />
        </Modal>
      )}

      {editing && (
        <Modal title="Edit Influencer" onClose={() => setEditing(null)}>
          <InfluencerForm
            initial={{
              name: editing.name,
              email: editing.email ?? "",
              phone: editing.phone ?? "",
              phone2: editing.phone2 ?? "",
              location: editing.location ?? "",
              city: editing.city ?? "",
              sex: editing.sex ?? "",
              platform: editing.platform,
              handle: editing.handle ?? "",
              followers: editing.followers?.toString() ?? "",
              engagementRate: editing.engagementRate?.toString() ?? "",
              niche: editing.niche ?? "",
              traits: editing.traits ?? "",
              ratePerPost: editing.ratePerPost?.toString() ?? "",
              status: editing.status,
            }}
            onSubmit={handleEdit}
            onCancel={() => setEditing(null)}
            submitLabel="Save Changes"
          />
        </Modal>
      )}
    </div>
  );
}
