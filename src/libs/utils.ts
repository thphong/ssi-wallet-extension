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