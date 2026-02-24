import { useEffect, useState, useCallback } from 'react';
import { getConfig, updateConfig } from '../services/api';
import type { RankingConfig } from '../types';
import { useStore } from '../store';
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

                    <div className={s.paramRow}>
                        <div className={s.paramInfo}>
                            <label>Max Results</label>
                            <span className={s.paramDesc}>Maximum number of products returned per search</span>
                        </div>
                        <input
                            type="number"
                            className={s.paramInput}
                            value={config.maxResults}
                            min={1}
                            max={100}
                            onChange={(e) => setConfig({ ...config, maxResults: parseInt(e.target.value) || 20 })}
                        />
                    </div>

                    <div className={s.paramRow}>
                        <div className={s.paramInfo}>
                            <label>Min Score</label>
                            <span className={s.paramDesc}>Products below this score threshold are filtered out</span>
                        </div>
                        <input
                            type="number"
                            className={s.paramInput}
                            value={config.minScore}
                            min={0}
                            max={1}
                            step={0.01}
                            onChange={(e) => setConfig({ ...config, minScore: parseFloat(e.target.value) || 0 })}
                        />
                    </div>

                    <div className={s.paramRow}>
                        <div className={s.paramInfo}>
                            <label>AI Model</label>
                            <span className={s.paramDesc}>OpenRouter model for image analysis</span>
                        </div>
                        <input
                            type="text"
                            className={s.paramInputWide}
                            value={config.model}
                            onChange={(e) => setConfig({ ...config, model: e.target.value })}
                        />
                    </div>

                    <div className={s.paramRow}>
                        <div className={s.paramInfo}>
                            <label>OpenRouter API Key</label>
                            <span className={s.paramDesc}>Required to use the AI model (stored in browser memory only)</span>
                        </div>
                        <input
                            type="password"
                            className={s.paramInputWide}
                            placeholder="sk-or-..."
                            value={openrouterApiKey}
                            onChange={(e) => setOpenrouterApiKey(e.target.value)}
                        />
                    </div>
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

function WeightSlider({
    label, desc, value, onChange,
}: {
    label: string; desc: string; value: number; onChange: (v: number) => void;
}) {
    return (
        <div className={s.weightSlider}>
            <div className={s.weightHeader}>
                <span className={s.weightLabel}>{label}</span>
                <span className={s.weightValue}>{value.toFixed(2)}</span>
            </div>
            <p className={s.weightDesc}>{desc}</p>
            <input
                type="range"
                className={s.slider}
                min={0}
                max={1}
                step={0.05}
                value={value}
                onChange={(e) => onChange(parseFloat(e.target.value))}
            />
        </div>
    );
}
