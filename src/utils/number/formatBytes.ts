export function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) {
    return "0 B";
  }

  const k = 1024;
  const units = ["B", "KB", "MB", "GB", "TB", "PB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const value = bytes / Math.pow(k, i);

  return `${parseFloat(value.toFixed(decimals))} ${units[i]}`;
}
