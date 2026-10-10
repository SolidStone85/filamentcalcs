// Shared evidence labels for the reference tables (spool tares, drying
// settings, material datasheet rows). Every published number says what
// was measured, who says so, and when the source was last checked, so a
// reader can tell a manufacturer spec from a forum measurement.

export type EvidenceType =
  | "manufacturer" // the brand's own spec, datasheet or help article
  | "community-db" // a crowdsourced database entry
  | "community" // individual user measurements (forum or Reddit posts)
  | "unverified"; // shown for context only; no checked source supports it

export const EVIDENCE_LABEL: Record<EvidenceType, string> = {
  manufacturer: "Manufacturer",
  "community-db": "Community database",
  community: "User measurements",
  unverified: "Unverified",
};

export type Source = {
  label: string;
  url: string;
  checked: string; // ISO date the source was last read
};
