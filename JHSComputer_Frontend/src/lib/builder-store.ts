import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CatalogPart, ManualQuantities, ManualSelection, PartCategory } from './v1-types';
import { emptyPartFilters, type PartFilterState } from './part-filters';
import { compuzoneCatalog, partCategories } from './compuzone-catalog';
import { clearManualSelection, loadManualQuantities, removeManualPart, saveManualQuantities, saveManualSelection, selectManualPart } from './v1-storage';

interface BuilderState {
  catalog: CatalogPart[];
  manualSelection: ManualSelection;
  manualQuantities: ManualQuantities;
  activeCategory: PartCategory | null;
  keyword: string;
  filters: PartFilterState;
  
  // Actions
  setCatalog: (catalog: CatalogPart[]) => void;
  setManualSelection: (selection: ManualSelection) => void;
  setManualQuantities: (quantities: ManualQuantities) => void;
  setPartQuantity: (category: PartCategory, quantity: number) => void;
  selectPart: (category: PartCategory, part: CatalogPart) => void;
  replacePart: (category: PartCategory, part: CatalogPart) => void;
  removePart: (category: PartCategory) => void;
  setActiveCategory: (category: PartCategory | null) => void;
  setKeyword: (keyword: string) => void;
  setFilters: (filters: PartFilterState | ((prev: PartFilterState) => PartFilterState)) => void;
  resetFilters: () => void;
  clearAll: () => void;
}

export const useBuilderStore = create<BuilderState>()(
  persist(
    (set) => ({
      catalog: compuzoneCatalog,
      manualSelection: {},
      manualQuantities: loadManualQuantities(),
      activeCategory: null,
      keyword: '',
      filters: emptyPartFilters,

      setCatalog: (catalog) => set({ catalog }),
      setManualSelection: (selection) => {
        saveManualSelection(selection);
        set({ manualSelection: selection });
      },

      setManualQuantities: (quantities) => {
        saveManualQuantities(quantities);
        set({ manualQuantities: quantities });
      },

      setPartQuantity: (category, quantity) => set((state) => {
        const next = { ...state.manualQuantities, [category]: Math.max(1, quantity) };
        saveManualQuantities(next);
        return { manualQuantities: next };
      }),
      
      selectPart: (category, part) => set((state) => {
        const currentIndex = partCategories.indexOf(category);
        const nextCategory = currentIndex >= 0 ? partCategories[currentIndex + 1] ?? null : null;
        selectManualPart(part);
        return {
          manualSelection: { ...state.manualSelection, [category]: part },
          manualQuantities: { ...state.manualQuantities, [category]: state.manualQuantities[category] ?? 1 },
          activeCategory: nextCategory,
          keyword: '',
          filters: { ...emptyPartFilters, compatibleOnly: state.filters.compatibleOnly },
        };
      }),

      replacePart: (category, part) => set((state) => {
        selectManualPart(part);
        return {
          manualSelection: { ...state.manualSelection, [category]: part },
          manualQuantities: { ...state.manualQuantities, [category]: state.manualQuantities[category] ?? 1 },
          keyword: '',
          filters: { ...emptyPartFilters, compatibleOnly: state.filters.compatibleOnly },
        };
      }),

      removePart: (category) => set((state) => {
        const next = { ...state.manualSelection };
        const nextQuantities = { ...state.manualQuantities };
        delete next[category];
        delete nextQuantities[category];
        removeManualPart(category);
        saveManualQuantities(nextQuantities);
        return { manualSelection: next, manualQuantities: nextQuantities };
      }),

      setActiveCategory: (category) => set((state) => {
        if (state.activeCategory === category) return state; // no change
        return {
          activeCategory: category,
          keyword: '', // reset search when changing category
          filters: { ...emptyPartFilters, compatibleOnly: state.filters.compatibleOnly },
        };
      }),

      setKeyword: (keyword) => set({ keyword }),

      setFilters: (filtersOrUpdater) => set((state) => {
        const nextFilters = typeof filtersOrUpdater === 'function' ? filtersOrUpdater(state.filters) : filtersOrUpdater;
        return { filters: nextFilters };
      }),

      resetFilters: () => set((state) => ({
        filters: { ...emptyPartFilters, compatibleOnly: state.filters.compatibleOnly },
      })),

      clearAll: () => {
        clearManualSelection();
        set({
          manualSelection: {},
          manualQuantities: {},
          activeCategory: null,
          keyword: '',
          filters: emptyPartFilters,
        });
      },
    }),
    {
      name: 'jhs-builder-storage', // name of the item in the storage (must be unique)
      partialize: (state) => ({ manualSelection: state.manualSelection, manualQuantities: state.manualQuantities }),
    }
  )
);
