import { useState } from 'react';
import { ImageUpload } from '../components/ImageUpload';
import { useSearch } from '../hooks/useSearch';
import { useStore } from '../store';
import * as s from './HomePage.styles';

export function HomePage() {
    const { openrouterApiKey } = useStore();
    const { search, isSearching, error } = useSearch();

    const [file, setFile] = useState<File | null>(null);
    const [query, setQuery] = useState('');
    const [validationError, setValidationError] = useState<string | null>(null);

    const handleSearch = () => {
        if (!openrouterApiKey) {
            setValidationError('API key missing. Go to Admin (/admin) to configure your OpenRouter key.');
            return;
        }
        if (!file) {
            setValidationError('Please upload a furniture image first.');
            return;
        }
        setValidationError(null);
        search(file, query || undefined);
    };

    const displayError = validationError ?? error;

    return (
        <div className={s.page}>
            <div className={s.container}>
                <h1 className={s.title}>Visual Furniture Search</h1>
                <p className={s.subtitle}>Find visually similar products in seconds</p>

                <div className={s.section}>
                    <label className={s.fieldLabel}>Furniture Image</label>
                    <ImageUpload onFileSelected={setFile} disabled={isSearching} />
                </div>

                <div className={s.section}>
                    <label className={s.fieldLabel}>Additional user prompt (optional)</label>
                    <input
                        type="text"
                        className={s.textInput}
                        placeholder='e.g. "under $500", "in white oak"'
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        disabled={isSearching}
                    />
                </div>

                <button
                    className={s.searchBtn}
                    onClick={handleSearch}
                    disabled={!file || isSearching}
                >
                    {isSearching ? (
                        <>
                            <span className={s.spinner} />
                            Analyzing & Searching...
                        </>
                    ) : (
                        '🔍 Search'
                    )}
                </button>

                {displayError && (
                    <div className={s.errorBanner}>
                        <span className={s.errorIcon}>⚠️</span>
                        <div>
                            <strong>Something went wrong</strong>
                            <p className={s.errorMessage}>{displayError}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
