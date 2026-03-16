"use client";

import AdminLayout from "../../../components/layout/AdminLayout";

const stats = [
  { label: "Total Skills", value: "—" },
  { label: "Total Users", value: "—" },
  { label: "Total Roles", value: "—" },
  { label: "Learning Resources", value: "—" },
];

export default function AdminDashboardPage() {
  return (
    <AdminLayout title="Dashboard">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((item) => (
          <div
            key={item.label}
            className="bg-white dark:bg-gray-900 rounded-xl shadow p-6 flex flex-col gap-2"
          >
            <p className="text-sm text-gray-500 dark:text-gray-400">{item.label}</p>
            <p className="text-2xl font-semibold dark:text-white">{item.value}</p>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
