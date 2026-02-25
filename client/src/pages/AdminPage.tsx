import { useEffect, useState } from 'react';
import { useConfig } from '../hooks/useConfig';
import type { RankingConfig } from '../types';
import { useStore } from '../store';
import { WeightSlider } from '../components/WeightSlider';
import { ParamField } from '../components/ParamField';
import * as s from './AdminPage.styles';

export function AdminPage() {
    const { openrouterApiKey, setOpenrouterApiKey } = useStore();
    const { config: remoteConfig, isLoading, loadError, save, isSaving, saveError, saved } = useConfig();

    const [config, setConfig] = useState<RankingConfig | null>(null);

    useEffect(() => {
        if (remoteConfig && !config) setConfig(remoteConfig);
    }, [remoteConfig, config]);

    const setWeight = (key: keyof RankingConfig['weights'], value: number) => {
        if (!config) return;
        setConfig({ ...config, weights: { ...config.weights, [key]: value } });
    };

    if (isLoading) {
        return (
            <div className={s.page}>
                <div className={s.loading}><p>Loading config...</p></div>
            </div>
        );
    }

    if (loadError || !config) {
        return (
            <div className={s.page}>
                <div className={s.loading}><p className={s.errorText}>{loadError ?? 'Failed to load config'}</p></div>
            </div>
        );
    }

    return (
        <div className={s.page}>
            <div className={s.container}>
                <div className={s.header}>
                    <h1>⚙️ Admin Configuration</h1>
                    <p className={s.subtitle}>
                        Tune ranking weights and search parameters. Changes take effect on the next search.
                    </p>
                </div>

                <section className={s.configSection}>
                    <h2>Ranking Weights</h2>
                    <p className={s.sectionDesc}>
                        Controls how much each signal contributes to the final product score.
                        Weights are normalized during scoring.
                    </p>

                    <WeightSlider
                        label="Text Relevance"
                        desc="MongoDB text search score from title and description matching"
                        value={config.weights.text}
                        onChange={(v) => setWeight('text', v)}
                    />
                    <WeightSlider
                        label="Category Match"
                        desc="Exact category match (e.g. Sofas, Tables, Chairs)"
                        value={config.weights.category}
                        onChange={(v) => setWeight('category', v)}
                    />
                    <WeightSlider
                        label="Type Match"
                        desc="Exact type match (e.g. Sectional Sofa, Dining Table)"
                        value={config.weights.type}
                        onChange={(v) => setWeight('type', v)}
                    />
                    <WeightSlider
                        label="Style Match"
                        desc="Heuristic: how many AI-detected attributes (style, material, color) appear in the product text"
                        value={config.weights.style}
                        onChange={(v) => setWeight('style', v)}
                    />
                    <WeightSlider
                        label="Query Match"
                        desc="Direct match of user's text query against product attributes — ensures user preferences are respected"
                        value={config.weights.query}
                        onChange={(v) => setWeight('query', v)}
                    />
                </section>

                <section className={s.configSection}>
                    <h2>Search Parameters</h2>

                    <ParamField
                        label="Max Results"
                        desc="Maximum number of products returned per search"
                        type="number"
                        value={config.maxResults}
                        min={1}
                        max={100}
                        onChange={(v) => setConfig({ ...config, maxResults: parseInt(String(v)) || 20 })}
                    />

                    <ParamField
                        label="Min Score"
                        desc="Products below this score threshold are filtered out"
                        type="number"
                        value={config.minScore}
                        min={0}
                        max={1}
                        step={0.01}
                        onChange={(v) => setConfig({ ...config, minScore: parseFloat(String(v)) || 0 })}
                    />

                    <ParamField
                        label="AI Model"
                        desc="OpenRouter model for image analysis"
                        type="text"
                        value={config.model}
                        wide
                        onChange={(v) => setConfig({ ...config, model: String(v) })}
                    />

                    <ParamField
                        label="OpenRouter API Key"
                        desc="Required to use the AI model (stored in browser memory only)"
                        type="password"
                        value={openrouterApiKey}
                        placeholder="sk-or-..."
                        wide
                        onChange={(v) => setOpenrouterApiKey(String(v))}
                    />
                </section>

                <div className={s.actions}>
                    <button className={s.saveBtn} onClick={() => save(config)} disabled={isSaving}>
                        {isSaving ? 'Saving...' : saved ? '✓ Saved' : 'Save Configuration'}
                    </button>
                    {saveError && <span className={s.errorText}>{saveError}</span>}
                </div>
            </div>
        </div>
    );
}
