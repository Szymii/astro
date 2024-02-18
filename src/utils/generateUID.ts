const array = new Uint32Array(1);

export function generateUID() {
  return self.crypto.getRandomValues(array)[0];
}
