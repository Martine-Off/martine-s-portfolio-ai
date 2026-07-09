import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) throw redirect({ to: "/auth" });
    // Vérification serveur du rôle admin — évite d'afficher la coquille admin
    // aux utilisateurs authentifiés sans privilèges.
    const { data: isAdmin, error: roleErr } = await supabase.rpc("has_role", {
      _user_id: data.user.id,
      _role: "admin",
    });
    if (roleErr || !isAdmin) throw redirect({ to: "/" });
    return { user: data.user };
  },
  component: () => <Outlet />,
});
