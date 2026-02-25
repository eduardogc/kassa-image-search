import { useEffect, useState, useCallback } from 'react';
import { getConfig, updateConfig } from '../services/api';
import type { RankingConfig } from '../types';
import { useStore } from '../store';
import { WeightSlider } from '../components/WeightSlider';
import { ParamField } from '../components/ParamField';
import * as s from './AdminPage.styles';

export function AdminPage() {
    const { openrouterApiKey, setOpenrouterApiKey } = useStore();
    const [config, setConfig] = useState<RankingConfig | null>(null);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        getConfig().then(setConfig).catch((e) => setError(e.message));
    }, []);

    const handleSave = useCallback(async () => {
        if (!config) return;
        setSaving(true);
        setError(null);
        try {
            const updated = await updateConfig(config);
            setConfig(updated);
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Failed to save');
        } finally {
            setSaving(false);
        }
    }, [config]);

    if (!config) {
        return (
            <div className={s.page}>
                <div className={s.loading}>
                    {error ? <p className={s.errorText}>{error}</p> : <p>Loading config...</p>}
                </div>
            </div>
        );
    }

    const setWeight = (key: keyof RankingConfig['weights'], value: number) => {
        setConfig({ ...config, weights: { ...config.weights, [key]: value } });
    };

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
                    <button className={s.saveBtn} onClick={handleSave} disabled={saving}>
                        {saving ? 'Saving...' : saved ? '✓ Saved' : 'Save Configuration'}
                    </button>
                    {error && <span className={s.errorText}>{error}</span>}
                </div>
            </div>
        </div>
    );
}
