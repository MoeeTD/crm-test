"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import Modal from "@/components/Modal";
import ContactForm from "@/components/ContactForm";

interface Contact {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  role: string | null;
  company: { id: string; name: string } | null;
}

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [search, setSearch] = useState("");
  const [companyFilter, setCompanyFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [showModal, setShowModal] = useState(false);

  const reload = () => {
    fetch("/api/contacts").then((r) => r.json()).then(setContacts);
  };

  useEffect(() => { reload(); }, []);

  const companies = useMemo(() => {
    const map = new Map<string, string>();
    contacts.forEach((c) => { if (c.company) map.set(c.company.id, c.company.name); });
    return Array.from(map.entries()).sort((a, b) => a[1].localeCompare(b[1]));
  }, [contacts]);

  const roles = useMemo(() => {
    const set = new Set<string>();
    contacts.forEach((c) => { if (c.role) set.add(c.role); });
    return Array.from(set).sort();
  }, [contacts]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return contacts.filter((c) => {
      if (q && !c.name.toLowerCase().includes(q) && !(c.email?.toLowerCase().includes(q))) return false;
      if (companyFilter && c.company?.id !== companyFilter) return false;
      if (roleFilter && c.role !== roleFilter) return false;
      return true;
    });
  }, [contacts, search, companyFilter, roleFilter]);

  const handleCreate = async (data: Record<string, string>) => {
    await fetch("/api/contacts", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    setShowModal(false);
    reload();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Contacts</h1>
          <p className="text-sm text-slate-500 mt-0.5">{filtered.length} people</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary">+ New Contact</button>
      </div>

      <div className="flex flex-wrap gap-3 mb-5">
        <input
          className="input max-w-xs"
          placeholder="Search by name or email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {companies.length > 0 && (
          <select
            className="filter-select"
            value={companyFilter}
            onChange={(e) => setCompanyFilter(e.target.value)}
          >
            <option value="">All Companies</option>
            {companies.map(([id, name]) => (
              <option key={id} value={id}>{name}</option>
            ))}
          </select>
        )}
        {roles.length > 0 && (
          <select
            className="filter-select"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="">All Roles</option>
            {roles.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        )}
      </div>

      <div className="table-wrap">
        <table className="w-full text-sm">
          <thead className="border-b border-slate-200 bg-slate-50">
            <tr>
              <th className="th">Name</th>
              <th className="th">Email</th>
              <th className="th">Phone</th>
              <th className="th">Role</th>
              <th className="th">Company</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-sm text-slate-400">
                  No contacts found.
                </td>
              </tr>
            )}
            {filtered.map((c) => (
              <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                <td className="td font-semibold text-slate-900">
                  <Link href={`/contacts/${c.id}`} className="hover:text-blue-600 transition-colors">
                    {c.name}
                  </Link>
                </td>
                <td className="td text-slate-600">{c.email ?? <span className="text-slate-300">—</span>}</td>
                <td className="td text-slate-600">{c.phone ?? <span className="text-slate-300">—</span>}</td>
                <td className="td">
                  {c.role ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                      {c.role}
                    </span>
                  ) : <span className="text-slate-300">—</span>}
                </td>
                <td className="td">
                  {c.company ? (
                    <Link href={`/companies/${c.company.id}`} className="text-blue-600 hover:text-blue-700 hover:underline font-medium">
                      {c.company.name}
                    </Link>
                  ) : <span className="text-slate-300">—</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <Modal title="New Contact" onClose={() => setShowModal(false)}>
          <ContactForm onSubmit={handleCreate} onCancel={() => setShowModal(false)} submitLabel="Create Contact" />
        </Modal>
      )}
    </div>
  );
}
