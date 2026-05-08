"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Modal from "@/components/Modal";
import ContactForm from "@/components/ContactForm";
import TaskForm from "@/components/TaskForm";

interface Note { id: string; content: string; createdAt: string }
interface Task { id: string; title: string; status: string; priority: string; dueDate: string | null }
interface Contact {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  role: string | null;
  companyId: string | null;
  company: { id: string; name: string } | null;
  tasks: Task[];
  notes: Note[];
}

const statusBadge = {
  OPEN: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
  IN_PROGRESS: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  DONE: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
} as const;

const priorityDot = {
  HIGH: "bg-red-400",
  MEDIUM: "bg-amber-400",
  LOW: "bg-emerald-400",
} as const;

export default function ContactDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [contact, setContact] = useState<Contact | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [taskOpen, setTaskOpen] = useState(false);
  const [noteText, setNoteText] = useState("");

  const load = useCallback(() => {
    fetch(`/api/contacts/${id}`).then((r) => r.json()).then(setContact);
  }, [id]);

  useEffect(() => { load(); }, [load]);

  const handleUpdate = async (data: Record<string, string>) => {
    await fetch(`/api/contacts/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    setEditOpen(false);
    load();
  };

  const handleDelete = async () => {
    if (!confirm("Delete this contact?")) return;
    await fetch(`/api/contacts/${id}`, { method: "DELETE" });
    router.push("/contacts");
  };

  const handleAddTask = async (data: Record<string, string>) => {
    await fetch("/api/tasks", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...data, contactId: id }) });
    setTaskOpen(false);
    load();
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteText.trim()) return;
    await fetch("/api/notes", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ content: noteText, contactId: id }) });
    setNoteText("");
    load();
  };

  const handleDeleteNote = async (noteId: string) => {
    await fetch(`/api/notes/${noteId}`, { method: "DELETE" });
    load();
  };

  const handleTaskStatus = async (taskId: string, task: Task, status: string) => {
    await fetch(`/api/tasks/${taskId}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...task, status }) });
    load();
  };

  if (!contact) return <div className="text-slate-400">Loading…</div>;

  return (
    <div className="max-w-3xl">
      <div className="flex items-start justify-between mb-6">
        <div>
          <Link href="/contacts" className="text-sm text-slate-400 hover:text-slate-600 mb-2 flex items-center gap-1 transition-colors">
            ← Contacts
          </Link>
          <h1 className="text-2xl font-semibold text-slate-900">{contact.name}</h1>
          {contact.role && <p className="text-sm text-slate-500 mt-0.5">{contact.role}</p>}
        </div>
        <div className="flex gap-2 mt-1">
          <button onClick={() => setEditOpen(true)} className="btn-secondary">Edit</button>
          <button onClick={handleDelete} className="btn-danger">Delete</button>
        </div>
      </div>

      <div className="card mb-6">
        <dl className="grid grid-cols-3 gap-6 text-sm">
          <div>
            <dt className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Email</dt>
            <dd className="text-slate-800 font-medium">{contact.email ?? <span className="text-slate-300 font-normal">—</span>}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Phone</dt>
            <dd className="text-slate-800 font-medium">{contact.phone ?? <span className="text-slate-300 font-normal">—</span>}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Company</dt>
            <dd>
              {contact.company ? (
                <Link href={`/companies/${contact.company.id}`} className="text-blue-600 hover:text-blue-700 font-medium hover:underline">
                  {contact.company.name}
                </Link>
              ) : <span className="text-slate-300">—</span>}
            </dd>
          </div>
        </dl>
      </div>

      <section className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-slate-900">Tasks</h2>
          <button onClick={() => setTaskOpen(true)} className="btn-secondary text-xs px-3 py-1.5">+ Add task</button>
        </div>
        {contact.tasks.length === 0 ? (
          <p className="text-sm text-slate-400">No tasks yet.</p>
        ) : (
          <div className="table-wrap">
            <table className="w-full text-sm">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <th className="th">Status</th>
                  <th className="th">Title</th>
                  <th className="th">Priority</th>
                  <th className="th">Due Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {contact.tasks.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                    <td className="td">
                      <select
                        value={t.status}
                        onChange={(e) => handleTaskStatus(t.id, t, e.target.value)}
                        className={`text-xs rounded-full px-2.5 py-0.5 font-semibold border-0 outline-none cursor-pointer ${statusBadge[t.status as keyof typeof statusBadge]}`}
                      >
                        <option value="OPEN">Open</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="DONE">Done</option>
                      </select>
                    </td>
                    <td className={`td font-medium ${t.status === "DONE" ? "line-through text-slate-400" : "text-slate-800"}`}>
                      {t.title}
                    </td>
                    <td className="td">
                      <span className={`inline-block w-2 h-2 rounded-full ${priorityDot[t.priority as keyof typeof priorityDot]}`} title={t.priority} />
                    </td>
                    <td className="td text-slate-500">
                      {t.dueDate ? new Date(t.dueDate).toLocaleDateString() : <span className="text-slate-300">—</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section>
        <h2 className="font-semibold text-slate-900 mb-3">Notes</h2>
        <form onSubmit={handleAddNote} className="flex gap-2 mb-4">
          <input
            className="input flex-1"
            placeholder="Add a note…"
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
          />
          <button type="submit" className="btn-primary">Add</button>
        </form>
        <div className="space-y-3">
          {contact.notes.length === 0 && (
            <p className="text-sm text-slate-400">No notes yet.</p>
          )}
          {contact.notes.map((n) => (
            <div key={n.id} className="card py-4 px-5 flex items-start gap-4">
              <p className="flex-1 text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">{n.content}</p>
              <div className="flex flex-col items-end gap-1.5 shrink-0">
                <span className="text-xs text-slate-400">{new Date(n.createdAt).toLocaleDateString()}</span>
                <button onClick={() => handleDeleteNote(n.id)} className="text-xs text-slate-400 hover:text-red-500 transition-colors">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {editOpen && (
        <Modal title="Edit Contact" onClose={() => setEditOpen(false)}>
          <ContactForm
            initial={{ name: contact.name, email: contact.email ?? "", phone: contact.phone ?? "", role: contact.role ?? "", companyId: contact.companyId ?? "" }}
            onSubmit={handleUpdate}
            onCancel={() => setEditOpen(false)}
            submitLabel="Save Changes"
          />
        </Modal>
      )}

      {taskOpen && (
        <Modal title="Add Task" onClose={() => setTaskOpen(false)}>
          <TaskForm onSubmit={handleAddTask} onCancel={() => setTaskOpen(false)} submitLabel="Add Task" />
        </Modal>
      )}
    </div>
  );
}
