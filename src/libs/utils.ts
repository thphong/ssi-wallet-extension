export function validateDidUrl(url: string) {
  return !!url && url.toLowerCase().endsWith("did.json");
}

export function stringToColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  // Convert hash → hex color
  let color = "#";
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += ("00" + value.toString(16)).slice(-2);
  }
  return color;
}

export function shortenDid(did: string, maxLength = 35): string {
  if (did.length <= maxLength) return did;

  const keep = maxLength - 3; // reserve for "..."
  const front = Math.ceil(keep / 2);
  const back = Math.floor(keep / 2);

  return did.slice(0, front) + "..." + did.slice(did.length - back);
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(date).replace(/\s/g, "-");
}

export function toDisplayString(content: unknown): string {
  if (typeof content === "string") {
    return content.trim();
  }
  try {
    return JSON.stringify(content, null, 2); // formatted JSON
  } catch {
    return String(content); // fallback for circular structures
  }
}

export function downloadJSON(obj: any, filename = "data.json") {
  // Convert object → JSON string
  const jsonStr = toDisplayString(obj);

  // Create a Blob from the string
  const blob = new Blob([jsonStr], { type: "application/json" });

  // Create a temporary <a> element
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;

  // Trigger the download
  a.click();

  // Cleanup
  URL.revokeObjectURL(url);
}