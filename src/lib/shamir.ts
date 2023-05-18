interface Shamir {
  split: (value: Uint8Array, n: number, k: number) => Promise<Uint8Array[]>;
  combine: (parts: Uint8Array[]) => Promise<Uint8Array>;
}

interface WasmExports {
  shamirSplit: (value: Uint8Array, n: number, k: number) => Uint8Array[];
  shamirCombine: (...parts: Uint8Array[]) => Uint8Array;
}

function getShamir(): Shamir {
  return {
    split: async (value: Uint8Array, n: number, k: number) => {
      return (window as unknown as WasmExports).shamirSplit(value, n, k);
    },
    combine: async (parts: Uint8Array[]) => {
      return (window as unknown as WasmExports).shamirCombine(...parts);
    },
  } as Shamir;
}

export type {Shamir};
export {getShamir};
