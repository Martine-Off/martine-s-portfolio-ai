import { createFileRoute } from "@tanstack/react-router";
import EditProjectRoute from "./admin.projets.$id";
export const Route = createFileRoute("/_authenticated/admin/projets/nouveau")({
  component: () => {
    const Comp = (EditProjectRoute as any).options?.component ?? (() => null);
    return <Comp />;
  },
});
