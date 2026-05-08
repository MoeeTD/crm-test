"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Stats {
  contacts: number;
  companies: number;
  tasks: number;
  openTasks: number;
  influencers: number;
}

const tiles = [
  {
    key: "contacts" as const,
    label: "Total Contacts",
    href: "/contacts",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
        <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
      </svg>
    ),
  },
  {
    key: "companies" as const,
    label: "Companies",
    href: "/companies",
    iconBg: "bg-violet-100",
    iconColor: "text-violet-600",
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 01-1 1h-2a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    key: "openTasks" as const,
    label: "Open Tasks",
    href: "/tasks",
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
        <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
        <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    key: "tasks" as const,
    label: "Total Tasks",
    href: "/tasks",
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    key: "influencers" as const,
    label: "Influencers",
    href: "/influencers",
    iconBg: "bg-pink-100",
    iconColor: "text-pink-600",
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ),
  },
];

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch("/api/stats").then((r) => r.json()).then(setStats);
  }, []);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-900">Overview</h1>
        <p className="text-sm text-slate-500 mt-1">Your CRM at a glance</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-5">
        {tiles.map(({ key, label, href, iconBg, iconColor, icon }) => (
          <Link key={key} href={href} className="card hover:shadow-md hover:-translate-y-0.5 transition-all duration-150">
            <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl mb-4 ${iconBg} ${iconColor}`}>
              {icon}
            </div>
            <div className="text-3xl font-bold text-slate-900 tabular-nums mb-1">
              {stats ? stats[key] : <span className="text-slate-300">—</span>}
            </div>
            <div className="text-sm text-slate-500 font-medium">{label}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
