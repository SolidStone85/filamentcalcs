import { ScrollProgress } from "@/components/shared/ScrollProgress";

export default function GuidesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ScrollProgress />
      {children}
    </>
  );
}
