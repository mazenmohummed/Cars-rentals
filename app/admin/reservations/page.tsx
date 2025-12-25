import { requireAdmin } from "@/lib/auth";
import AdminReservationsClient from "./_components/admin-client";

export default async function AdminReservationsPage() {
  // This runs on the server. If not admin, it redirects or throws 403.
  await requireAdmin();

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Reservation Management</h1>
      <AdminReservationsClient />
    </div>
  );
}