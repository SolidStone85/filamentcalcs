// Renders a text string with any occurrence of "3D" wrapped in the
// extruded teal span. Used on guide headlines to echo the homepage
// brand treatment. Case-sensitive match, only "3D" (not "3d" or "3 D").

type Props = { children: string };

export function Highlight3D({ children }: Props) {
  const parts = children.split(/(3D)/g);
  return (
    <>
      {parts.map((part, i) =>
        part === "3D" ? (
          <span key={i} className="text-3d">
            3D
          </span>
        ) : (
          part
        ),
      )}
    </>
  );
}
