import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { searchByImage } from '../services/api';
import { useStore } from '../store';

export function useSearch() {
    const navigate = useNavigate();
    const { openrouterApiKey, setSearchQuery, setSearchResult } = useStore();

    const mutation = useMutation({
        mutationFn: ({ file, query }: { file: File; query?: string }) =>
            searchByImage(file, openrouterApiKey, query),
        onSuccess: (result, { query }) => {
            setSearchQuery(query ?? '');
            setSearchResult(result);
            navigate('/results');
        },
    });

    return {
        search: (file: File, query?: string) => mutation.mutate({ file, query }),
        isSearching: mutation.isPending,
        error: mutation.error instanceof Error ? mutation.error.message : null,
        reset: mutation.reset,
    };
}
