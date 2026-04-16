import { create } from 'zustand';

export type TitleStore = {
  getTitle: string;
  setTitle: (value: string) => void;
};

export const useTitle = create<TitleStore>((set) => ({
  getTitle: '',
  setTitle: (value) => set({ getTitle: value })
}));
