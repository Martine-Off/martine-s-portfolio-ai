import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";

function serverPublicClient() {
  return createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_PUBLISHABLE_KEY!,
    { auth: { storage: undefined, persistSession: false, autoRefreshToken: false } },
  );
}

const getDiagnosticData = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = serverPublicClient();
  
  // 1. Liste des types de projets distincts
  const { data: allProjects, error: err1 } = await supabase
    .from("projects")
    .select("project_type");
    
  let distinctTypes: string[] = [];
  if (allProjects) {
    const types = new Set(allProjects.map(p => p.project_type).filter(Boolean));
    distinctTypes = Array.from(types) as string[];
  }

  // 2. Contenu retourné par getProfilePage (project_type = 'profil')
  const { data: profileProject, error: err2 } = await supabase
    .from("projects")
    .select("*")
    .eq("project_type", "profil")
    .maybeSingle();
    
  // Blocs associés au profil
  let profileBlocks = null;
  if (profileProject) {
    const { data: blocks } = await supabase
      .from("project_blocks")
      .select("*")
      .eq("project_id", profileProject.id)
      .order("display_order", { ascending: true });
    profileBlocks = blocks;
  }

  return {
    distinctTypes,
    err1: err1?.message,
    profileProject,
    err2: err2?.message,
    profileBlocks
  };
});

export const Route = createFileRoute("/debug-diagnostic")({
  loader: async () => {
    return await getDiagnosticData();
  },
  component: DebugDiagnosticComponent,
});

function DebugDiagnosticComponent() {
  const data = Route.useLoaderData();

  return (
    <div className="p-8 max-w-4xl mx-auto font-mono text-sm bg-black text-green-400 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-white">Diagnostic Supabase</h1>
      
      <div className="mb-8 p-4 border border-green-800 rounded">
        <h2 className="text-xl text-white mb-2">1. Types de projets distincts en base</h2>
        {data.err1 && <p className="text-red-500">Erreur : {data.err1}</p>}
        <ul className="list-disc pl-5">
          {data.distinctTypes.map(t => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </div>

      <div className="mb-8 p-4 border border-green-800 rounded">
        <h2 className="text-xl text-white mb-2">2. Résultat de (project_type = 'profil')</h2>
        {data.err2 && <p className="text-red-500">Erreur : {data.err2}</p>}
        
        <h3 className="text-lg text-white mt-4">Project (Table 'projects') :</h3>
        <pre className="overflow-x-auto whitespace-pre-wrap p-2 bg-gray-900 rounded mt-2 text-gray-300">
          {JSON.stringify(data.profileProject, null, 2)}
        </pre>

        <h3 className="text-lg text-white mt-4">Blocks (Table 'project_blocks') :</h3>
        <pre className="overflow-x-auto whitespace-pre-wrap p-2 bg-gray-900 rounded mt-2 text-gray-300">
          {JSON.stringify(data.profileBlocks, null, 2)}
        </pre>
      </div>
    </div>
  );
}
