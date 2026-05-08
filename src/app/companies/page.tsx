"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import Modal from "@/components/Modal";
import CompanyForm from "@/components/CompanyForm";

interface Company {
  id: string;
  name: string;
  website: string | null;
  industry: string | null;
  phone: string | null;
  _count: { contacts: number };
}

const pillBase = "px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-colors";
const pillActive = `${pillBase} bg-slate-900 text-white`;
const pillInactive = `${pillBase} bg-white border border-slate-300 text-slate-600 hover:bg-slate-50 hover:border-slate-400`;

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [search, setSearch] = useState("");
  const [industryFilter, setIndustryFilter] = useState("");
  const [showModal, setShowModal] = useState(false);

  const reload = () => {
    fetch("/api/companies").then((r) => r.json()).then(setCompanies);
  };

  useEffect(() => { reload(); }, []);

  const industries = useMemo(() => {
    const set = new Set<string>();
    companies.forEach((c) => { if (c.industry) set.add(c.industry); });
    return Array.from(set).sort();
  }, [companies]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return companies.filter((c) => {
      if (q && !c.name.toLowerCase().includes(q)) return false;
      if (industryFilter && c.industry !== industryFilter) return false;
      return true;
    });
  }, [companies, search, industryFilter]);

  const handleCreate = async (data: Record<string, string>) => {
    await fetch("/api/companies", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    setShowModal(false);
    reload();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Companies</h1>
          <p className="text-sm text-slate-500 mt-0.5">{filtered.length} organizations</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary">+ New Company</button>
      </div>

      <div className="flex flex-wrap gap-3 mb-5">
        <input
          className="input max-w-xs"
          placeholder="Search companies…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {industries.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            <button onClick={() => setIndustryFilter("")} className={industryFilter === "" ? pillActive : pillInactive}>
              All
            </button>
            {industries.map((ind) => (
              <button key={ind} onClick={() => setIndustryFilter(ind === industryFilter ? "" : ind)} className={industryFilter === ind ? pillActive : pillInactive}>
                {ind}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="table-wrap">
        <table className="w-full text-sm">
          <thead className="border-b border-slate-200 bg-slate-50">
            <tr>
              <th className="th">Company</th>
              <th className="th">Industry</th>
              <th className="th">Website</th>
              <th className="th">Phone</th>
              <th className="th">Contacts</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-sm text-slate-400">
                  No companies yet.
                </td>
              </tr>
            )}
            {filtered.map((c) => (
              <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                <td className="td font-semibold text-slate-900">
                  <Link href={`/companies/${c.id}`} className="hover:text-blue-600 transition-colors">
                    {c.name}
                  </Link>
                </td>
                <td className="td">
                  {c.industry ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                      {c.industry}
                    </span>
                  ) : <span className="text-slate-300">—</span>}
                </td>
                <td className="td">
                  {c.website ? (
                    <a href={c.website} target="_blank" rel="noreferrer" className="text-blue-600 hover:text-blue-700 hover:underline font-medium">
                      {c.website.replace(/^https?:\/\//, "")}
                    </a>
                  ) : <span className="text-slate-300">—</span>}
                </td>
                <td className="td text-slate-600">{c.phone ?? <span className="text-slate-300">—</span>}</td>
                <td className="td">
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-blue-50 text-blue-700 text-xs font-bold">
                    {c._count.contacts}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <Modal title="New Company" onClose={() => setShowModal(false)}>
          <CompanyForm onSubmit={handleCreate} onCancel={() => setShowModal(false)} submitLabel="Create Company" />
        </Modal>
      )}
    </div>
  );
}
