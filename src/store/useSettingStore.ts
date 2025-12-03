import { create } from 'zustand';

interface SkyState {
  showSky: boolean;
  setShowSky: (value: boolean) => void;
}

const useSettingStore = create<SkyState>(set => ({
  showSky: false,
  setShowSky: (value: boolean) => set({ showSky: value })
}));

export default useSettingStore;
