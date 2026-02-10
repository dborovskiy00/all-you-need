declare const process: { versions: { node: string } | null } | undefined;

export function isNode(): boolean {
  return (
    typeof process !== "undefined" &&
    process.versions != null &&
    process.versions.node != null
  );
}
