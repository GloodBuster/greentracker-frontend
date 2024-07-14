export function areObjectsEqual(obj1: any, obj2: any): boolean {
  const obj1Keys = Object.keys(obj1);
  const obj2Keys = Object.keys(obj2);
  if (obj1Keys.length !== obj2Keys.length) {
    console.log('No son iguales');

    return false;
  }

  for (const key of obj1Keys) {
    if (obj1[key] !== obj2[key]) {
      return false;
    }
  }
  return true;
}

export function safeStringify(obj: any) {
  const seen = new WeakSet();
  return JSON.stringify(obj, (key, value) => {
    if (typeof value === 'object' && value !== null) {
      if (seen.has(value)) {
        return;
      }
      seen.add(value);
    }
    return value;
  });
}
