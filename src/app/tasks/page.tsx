"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import Modal from "@/components/Modal";
import TaskForm from "@/components/TaskForm";

interface Task {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  dueDate: string | null;
  contact: { id: string; name: string } | null;
  company: { id: string; name: string } | null;
}

const statusBadge = {
  OPEN: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
  IN_PROGRESS: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  DONE: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
} as const;

const priorityBadge = {
  HIGH: "bg-red-50 text-red-600 ring-1 ring-red-200",
  MEDIUM: "bg-amber-50 text-amber-600 ring-1 ring-amber-200",
  LOW: "bg-slate-100 text-slate-500",
} as const;

const pillBase = "px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors";
const pillActive = `${pillBase} bg-slate-900 text-white`;
const pillInactive = `${pillBase} bg-white border border-slate-300 text-slate-600 hover:bg-slate-50 hover:border-slate-400`;

const statusFilters = [
  { value: "", label: "All" },
  { value: "OPEN", label: "Open" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "DONE", label: "Done" },
];

const priorityFilters = [
  { value: "", label: "All" },
  { value: "HIGH", label: "High" },
  { value: "MEDIUM", label: "Medium" },
  { value: "LOW", label: "Low" },
];

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);

  const reload = () => {
    fetch("/api/tasks").then((r) => r.json()).then(setTasks);
  };

  useEffect(() => { reload(); }, []);

  const filtered = useMemo(() => {
    return tasks.filter((t) => {
      if (statusFilter && t.status !== statusFilter) return false;
      if (priorityFilter && t.priority !== priorityFilter) return false;
      return true;
    });
  }, [tasks, statusFilter, priorityFilter]);

  const handleCreate = async (data: Record<string, string>) => {
    await fetch("/api/tasks", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    setShowModal(false);
    reload();
  };

  const handleUpdate = async (data: Record<string, string>) => {
    if (!editTask) return;
    await fetch(`/api/tasks/${editTask.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    setEditTask(null);
    reload();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this task?")) return;
    await fetch(`/api/tasks/${id}`, { method: "DELETE" });
    reload();
  };

  const handleStatusChange = async (task: Task, status: string) => {
    await fetch(`/api/tasks/${task.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...task, status }) });
    reload();
  };

  const isOverdue = (task: Task) =>
    task.dueDate && new Date(task.dueDate) < new Date() && task.status !== "DONE";

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Tasks</h1>
          <p className="text-sm text-slate-500 mt-0.5">{filtered.length} {statusFilter ? statusFilter.toLowerCase().replace("_", " ") : "total"}</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary">+ New Task</button>
      </div>

      <div className="flex flex-wrap items-center gap-4 mb-5">
        <div className="flex gap-1.5">
          {statusFilters.map(({ value, label }) => (
            <button key={value} onClick={() => setStatusFilter(value)} className={statusFilter === value ? pillActive : pillInactive}>
              {label}
            </button>
          ))}
        </div>
        <div className="w-px h-6 bg-slate-200" />
        <div className="flex gap-1.5">
          {priorityFilters.map(({ value, label }) => (
            <button key={value} onClick={() => setPriorityFilter(value)} className={priorityFilter === value ? pillActive : pillInactive}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="table-wrap">
        <table className="w-full text-sm">
          <thead className="border-b border-slate-200 bg-slate-50">
            <tr>
              <th className="th">Status</th>
              <th className="th">Task</th>
              <th className="th">Priority</th>
              <th className="th">Linked To</th>
              <th className="th">Due Date</th>
              <th className="th w-20"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-sm text-slate-400">
                  No tasks found.
                </td>
              </tr>
            )}
            {filtered.map((t) => (
              <tr key={t.id} className="hover:bg-slate-50 transition-colors group">
                <td className="td">
                  <select
                    value={t.status}
                    onChange={(e) => handleStatusChange(t, e.target.value)}
                    className={`text-xs rounded-full px-2.5 py-0.5 font-semibold border-0 outline-none cursor-pointer ${statusBadge[t.status as keyof typeof statusBadge]}`}
                  >
                    <option value="OPEN">Open</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="DONE">Done</option>
                  </select>
                </td>

                <td className="td max-w-xs">
                  <span className={`font-medium ${t.status === "DONE" ? "line-through text-slate-400" : "text-slate-900"}`}>
                    {t.title}
                  </span>
                  {t.description && (
                    <p className="text-xs text-slate-400 mt-0.5 truncate max-w-[260px]">{t.description}</p>
                  )}
                </td>

                <td className="td">
                  <span className={`text-xs rounded-full px-2.5 py-0.5 font-semibold ${priorityBadge[t.priority as keyof typeof priorityBadge]}`}>
                    {t.priority.charAt(0) + t.priority.slice(1).toLowerCase()}
                  </span>
                </td>

                <td className="td">
                  <div className="flex flex-col gap-0.5">
                    {t.contact && (
                      <Link href={`/contacts/${t.contact.id}`} className="text-xs text-slate-500 hover:text-blue-600 transition-colors">
                        {t.contact.name}
                      </Link>
                    )}
                    {t.company && (
                      <Link href={`/companies/${t.company.id}`} className="text-xs text-slate-500 hover:text-blue-600 transition-colors">
                        {t.company.name}
                      </Link>
                    )}
                    {!t.contact && !t.company && <span className="text-slate-300 text-xs">—</span>}
                  </div>
                </td>

                <td className="td">
                  {t.dueDate ? (
                    <span className={`text-sm tabular-nums font-medium ${isOverdue(t) ? "text-red-500" : "text-slate-500"}`}>
                      {new Date(t.dueDate).toLocaleDateString()}
                    </span>
                  ) : <span className="text-slate-300">—</span>}
                </td>

                <td className="td">
                  <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => setEditTask(t)} className="text-xs text-slate-500 hover:text-slate-800 font-medium transition-colors">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(t.id)} className="text-xs text-slate-400 hover:text-red-500 font-medium transition-colors">
                      Del
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <Modal title="New Task" onClose={() => setShowModal(false)}>
          <TaskForm onSubmit={handleCreate} onCancel={() => setShowModal(false)} submitLabel="Create Task" />
        </Modal>
      )}

      {editTask && (
        <Modal title="Edit Task" onClose={() => setEditTask(null)}>
          <TaskForm
            initial={{
              title: editTask.title,
              description: editTask.description ?? "",
              dueDate: editTask.dueDate ? editTask.dueDate.split("T")[0] : "",
              status: editTask.status,
              priority: editTask.priority,
              contactId: editTask.contact?.id ?? "",
              companyId: editTask.company?.id ?? "",
            }}
            onSubmit={handleUpdate}
            onCancel={() => setEditTask(null)}
            submitLabel="Save Changes"
          />
        </Modal>
      )}
    </div>
  );
}
