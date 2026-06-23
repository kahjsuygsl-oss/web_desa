import { Sidebar } from "@/components/sidebar";
import { requireAuth } from "@/lib/session";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAuth();

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 overflow-x-hidden">
        <div className="mx-auto max-w-5xl p-6 md:p-8">{children}</div>
      </div>
    </div>
  );
}
