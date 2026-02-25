import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { getConfig, updateConfig } from '../services/api';
import type { RankingConfig } from '../types';

const CONFIG_KEY = ['config'] as const;

export function useConfig() {
    const queryClient = useQueryClient();
    const [saved, setSaved] = useState(false);

    const query = useQuery({
        queryKey: CONFIG_KEY,
        queryFn: getConfig,
    });

    const mutation = useMutation({
        mutationFn: (config: RankingConfig) => updateConfig(config),
        onSuccess: (updated) => {
            queryClient.setQueryData(CONFIG_KEY, updated);
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
        },
    });

    return {
        config: query.data ?? null,
        isLoading: query.isLoading,
        loadError: query.error instanceof Error ? query.error.message : null,
        save: mutation.mutate,
        isSaving: mutation.isPending,
        saveError: mutation.error instanceof Error ? mutation.error.message : null,
        saved,
    };
}
