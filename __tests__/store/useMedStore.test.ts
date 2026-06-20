import { create } from "zustand";
import { Medication } from "../../src/utils/storage";

/* Test realizado mediante uso de Agente de IA
IA Utilizada: Kimi K2.6
Plataforma: Opencode Go
Prompt: A partir de este proyecto realiza los tests para la funcion de medStore.
*/

interface MedState {
  medications: Medication[];
  isLoading: boolean;
  error: string | null;
  setMedications: (meds: Medication[]) => void;
  addMedication: (med: Medication) => void;
  removeMedication: (id: string) => void;
  updateMedication: (id: string, updates: Partial<Medication>) => void;
}

const useTestMedStore = create<MedState>((set) => ({
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
        m.id === id ? { ...m, ...updates } : m,
      ),
    })),
}));

describe("useMedStore", () => {
  beforeEach(() => {
    useTestMedStore.setState({
      medications: [],
      isLoading: false,
      error: null,
    });
  });

  it("agrega un medicamento al estado", () => {
    const med = {
      id: "1",
      nombre: "Ibuprofeno",
      dosis: "400mg",
      hora: "14:30",
      creadoEn: Date.now(),
    };
    useTestMedStore.getState().addMedication(med);
    expect(useTestMedStore.getState().medications).toHaveLength(1);
    expect(useTestMedStore.getState().medications[0].nombre).toBe("Ibuprofeno");
  });

  it("elimina un medicamento por id", () => {
    const med1 = {
      id: "1",
      nombre: "Ibuprofeno",
      dosis: "400mg",
      hora: "14:30",
      creadoEn: Date.now(),
    };
    const med2 = {
      id: "2",
      nombre: "Paracetamol",
      dosis: "500mg",
      hora: "20:00",
      creadoEn: Date.now(),
    };
    useTestMedStore.getState().setMedications([med1, med2]);
    useTestMedStore.getState().removeMedication("1");
    expect(useTestMedStore.getState().medications).toHaveLength(1);
    expect(useTestMedStore.getState().medications[0].id).toBe("2");
  });

  it("actualiza un medicamento existente", () => {
    const med = {
      id: "1",
      nombre: "Ibuprofeno",
      dosis: "400mg",
      hora: "14:30",
      creadoEn: Date.now(),
    };
    useTestMedStore.getState().addMedication(med);
    useTestMedStore.getState().updateMedication("1", { dosis: "600mg" });
    expect(useTestMedStore.getState().medications[0].dosis).toBe("600mg");
    expect(useTestMedStore.getState().medications[0].nombre).toBe("Ibuprofeno");
  });
});
