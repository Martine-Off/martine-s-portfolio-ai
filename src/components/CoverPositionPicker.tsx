const POSITIONS: { value: string; label: string }[] = [
  { value: "left top", label: "Haut gauche" },
  { value: "center top", label: "Haut centre" },
  { value: "right top", label: "Haut droite" },
  { value: "left center", label: "Centre gauche" },
  { value: "center", label: "Centre" },
  { value: "right center", label: "Centre droite" },
  { value: "left bottom", label: "Bas gauche" },
  { value: "center bottom", label: "Bas centre" },
  { value: "right bottom", label: "Bas droite" },
];

type Props = {
  imageUrl: string;
  value: string;
  onChange: (value: string) => void;
};

export function CoverPositionPicker({ imageUrl, value, onChange }: Props) {
  if (!imageUrl) return null;
  const current = value || "center";

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
      <div className="w-full sm:max-w-xs">
        <div className="relative w-full overflow-hidden rounded-md border border-border bg-muted" style={{ aspectRatio: "16 / 9" }}>
          <img
            src={imageUrl}
            alt="Aperçu du cadrage"
            className="h-full w-full object-cover"
            style={{ objectPosition: current }}
          />
        </div>
        <p className="mt-1 text-xs text-muted-foreground">Aperçu : {current}</p>
      </div>
      <div className="grid w-fit grid-cols-3 gap-1.5" role="radiogroup" aria-label="Position de l'image">
        {POSITIONS.map((p) => {
          const active = current === p.value;
          return (
            <button
              key={p.value}
              type="button"
              onClick={() => onChange(p.value)}
              aria-label={p.label}
              aria-checked={active}
              role="radio"
              className={`h-11 w-11 rounded-md border transition ${
                active
                  ? "border-accent bg-accent/15 ring-2 ring-accent"
                  : "border-border bg-background hover:bg-muted"
              }`}
            >
              <span
                className={`mx-auto block h-2 w-2 rounded-full ${active ? "bg-accent" : "bg-muted-foreground/40"}`}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
