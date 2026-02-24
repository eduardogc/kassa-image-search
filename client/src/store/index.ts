import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { SearchResponse } from '../types';

interface SearchState {
    openrouterApiKey: string;
    setOpenrouterApiKey: (key: string) => void;
    searchResult: SearchResponse | null;
    setSearchResult: (result: SearchResponse | null) => void;
    searchFileBlob: string | null;
    setSearchFileBlob: (blobUrl: string | null) => void;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
}

export const useStore = create<SearchState>()(
    persist(
        (set) => ({
            openrouterApiKey: '',
            setOpenrouterApiKey: (key) => set({ openrouterApiKey: key }),
            searchResult: null,
            setSearchResult: (result) => set({ searchResult: result }),
            searchFileBlob: null,
            setSearchFileBlob: (blobUrl) => set({ searchFileBlob: blobUrl }),
            searchQuery: '',
            setSearchQuery: (query) => set({ searchQuery: query }),
        }),
        {
            name: 'kassa-storage',
            partialize: (state) => ({ openrouterApiKey: state.openrouterApiKey }),
        }
    )
);
