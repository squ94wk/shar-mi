interface Shamir {
  split: (value: Uint8Array, n: number, k: number) => Promise<Uint8Array[]>;
  combine: (...parts: Uint8Array[]) => Promise<Uint8Array>;
}

interface WasmExports {
  shamirSplit: (value: Uint8Array, n: number, k: number) => Promise<Uint8Array[]>;
  shamirCombine: (...parts: Uint8Array[]) => Promise<Uint8Array>;
}

function getShamir(): Shamir {
  return {
    split: (window as unknown as WasmExports).shamirSplit,
    combine: (window as unknown as WasmExports).shamirCombine,
  } as Shamir;
}

export type {Shamir};
export {getShamir};
