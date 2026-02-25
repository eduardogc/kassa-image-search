import { useMutation } from '@tanstack/react-query';
import { searchByImage } from '../services/api';
import { useStore } from '../store';

export function useRefineSearch() {
    const { openrouterApiKey, setSearchResult } = useStore();

    const mutation = useMutation({
        mutationFn: ({ file, query }: { file: File; query?: string }) =>
            searchByImage(file, openrouterApiKey, query),
        onSuccess: (result) => {
            setSearchResult(result);
        },
    });

    return {
        refine: (file: File, query?: string) => mutation.mutate({ file, query }),
        isRefining: mutation.isPending,
        error: mutation.error instanceof Error ? mutation.error.message : null,
        reset: mutation.reset,
    };
}
