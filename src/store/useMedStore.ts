import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Medication } from '../utils/storage';

interface MedState {
  medications: Medication[];
  isLoading: boolean;
  error: string | null;
  setMedications: (meds: Medication[]) => void;
  addMedication: (med: Medication) => void;
  removeMedication: (id: string) => void;
  updateMedication: (id: string, updates: Partial<Medication>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useMedStore = create<MedState>()(
  persist(
    (set) => ({
      medications: [],
      isLoading: false,
      error: null,
      setMedications: (meds) => set({ medications: meds }),
      addMedication: (med) =>
        set((state) => ({ medications: [...state.medications, med] })),
      removeMedication: (id) =>
        set((state) => ({
          medications: state.medications.filter((m) => m.id !== id),
        })),
      updateMedication: (id, updates) =>
        set((state) => ({
          medications: state.medications.map((m) =>
            m.id === id ? { ...m, ...updates } : m
          ),
        })),
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
    }),
    {
      name: '@mipildora_med_store',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
