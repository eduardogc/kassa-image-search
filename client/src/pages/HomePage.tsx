import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ImageUpload } from '../components/ImageUpload';
import { searchByImage } from '../services/api';
import { useStore } from '../store';
import * as s from './HomePage.styles';

export function HomePage() {
    const navigate = useNavigate();
    const { openrouterApiKey, setSearchQuery, setSearchResult } = useStore();

    const [file, setFile] = useState<File | null>(null);
    const [query, setLocalQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSearch = useCallback(async () => {
        if (!openrouterApiKey) {
            setError('Please configure your OpenRouter API Key in the Admin page first.');
            return;
        }
        if (!file) {
            setError('Please upload an image to search.');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await searchByImage(file, openrouterApiKey, query || undefined);
            setSearchQuery(query);
            setSearchResult(response);
            navigate('/results');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Search failed');
        } finally {
            setLoading(false);
        }
    }, [file, query, openrouterApiKey, navigate, setSearchQuery, setSearchResult]);

    return (
        <div className={s.page}>
            <div className={s.container}>
                <h1 className={s.title}>Visual Furniture Search</h1>
                <p className={s.subtitle}>Find visually similar products in seconds</p>

                <div className={s.section}>
                    <label className={s.fieldLabel}>Furniture Image</label>
                    <ImageUpload onFileSelected={setFile} disabled={loading} />
                </div>

                <div className={s.section}>
                    <label className={s.fieldLabel}>Additional user prompt (optional)</label>
                    <input
                        type="text"
                        className={s.textInput}
                        placeholder='e.g. "under $500", "in white oak"'
                        value={query}
                        onChange={(e) => setLocalQuery(e.target.value)}
                    />
                </div>

                <button
                    className={s.searchBtn}
                    onClick={handleSearch}
                    disabled={!file || loading}
                >
                    {loading ? 'Searching Catalog...' : '🔍 Search'}
                </button>

                {error && <div className={s.errorBanner}>{error}</div>}
            </div>
        </div>
    );
}
