export function formatFileSize(bytes: number): string {
  const units = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  let unitIndex = 0;
  let size = bytes;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(2)} ${units[unitIndex]}`;
}

export function parseFileNameFromUrl(url: string) {
  return url.split('/').pop() ?? '';
}

export async function urlToFile(url: string): Promise<File> {
  const response = await fetch(url);
  const blob = await response.blob();
  const fileName = parseFileNameFromUrl(url);
  const file = new File([blob], fileName, { type: blob.type });

  return file;
}
