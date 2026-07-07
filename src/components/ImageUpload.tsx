import { useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { createSignedUpload } from "@/lib/projects.functions";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Props {
  value: string | null | undefined;
  onChange: (url: string) => void;
  pathPrefix?: string;
  className?: string;
  label?: string;
}

export function ImageUpload({ value, onChange, pathPrefix = "uploads", label = "Choisir une image" }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const createUpload = useServerFn(createSignedUpload);

  async function upload(file: File) {
    if (!file.type.startsWith("image/")) {
      toast.error("Veuillez sélectionner une image");
      return;
    }
    setBusy(true);
    try {
      const ext = file.name.split(".").pop() || "bin";
      const path = `${pathPrefix}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const signed = await createUpload({ data: { path } });
      const res = await fetch(signed.signedUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });
      if (!res.ok) throw new Error("Échec de l'upload");
      const { data } = supabase.storage.from("project-images").getPublicUrl(path);
      onChange(data.publicUrl);
      toast.success("Image téléversée");
    } catch (err: any) {
      toast.error(err.message || "Erreur d'upload");
    } finally {
      setBusy(false);
    }
  }


  return (
    <div
      className={`rounded-md border-2 border-dashed border-border bg-background p-3 ${dragOver ? "border-accent" : ""}`}
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragOver(false);
        const f = e.dataTransfer.files?.[0];
        if (f) upload(f);
      }}
    >
      {value ? (
        <div className="space-y-2">
          <img src={value} alt="Aperçu" className="max-h-48 rounded border border-border object-contain" />
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={busy}
              className="min-h-11 rounded border border-border px-3 py-2 text-sm hover:bg-muted disabled:opacity-50"
            >
              {busy ? "…" : "Changer l'image"}
            </button>
            <button
              type="button"
              onClick={() => onChange("")}
              className="min-h-11 rounded border border-border px-3 py-2 text-sm text-destructive hover:bg-muted"
            >
              Retirer
            </button>
          </div>

        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          className="min-h-11 w-full rounded px-3 py-6 text-sm text-muted-foreground hover:bg-muted disabled:opacity-50"
        >
          {busy ? "Envoi…" : label}
          <span className="mt-1 hidden text-xs opacity-60 sm:block">ou glisser-déposer</span>
        </button>

      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) upload(f);
          e.target.value = "";
        }}
      />
    </div>
  );
}
