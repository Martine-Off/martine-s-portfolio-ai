import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { checkIsAdmin } from "@/lib/projects.functions";

export const Route = createFileRoute("/_authenticated/admin")({
  beforeLoad: async () => {
    const result = await checkIsAdmin();
    if (!result.isAdmin) throw redirect({ to: "/auth" });
  },
  component: () => <Outlet />,
});
