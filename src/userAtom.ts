import { atom } from "jotai";

export const userAtom = atom<{ name: string } | null>(null);
