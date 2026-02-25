import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { ImageUpload } from '../components/ImageUpload';
import { ProductCard } from '../components/ProductCard';
import { AnalysisSummary } from '../components/AnalysisSummary';
import { useRefineSearch } from '../hooks/useRefineSearch';
import { useStore } from '../store';
import * as s from './ResultsPage.styles';

export function ResultsPage() {
  const navigate = useNavigate();
  const { searchQuery, searchResult, setSearchQuery } = useStore();
  const { refine, isRefining, error } = useRefineSearch();

  const [file, setFile] = useState<File | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  if (!searchResult) {
    return <Navigate to="/" replace />;
  }

  const handleSearch = () => {
    if (!file) {
      setValidationError('Upload a new image to refine your search.');
      return;
    }
    setValidationError(null);
    refine(file, searchQuery || undefined);
  };

  const displayError = validationError ?? error;

  return (
    <div className={s.page}>
      <div className={s.sidebar}>
        <div className={s.section}>
          <label className={s.fieldLabel}>Furniture Image</label>
          <ImageUpload onFileSelected={setFile} disabled={isRefining} />
        </div>

        <div className={s.section}>
          <label className={s.fieldLabel}>Additional user prompt (optional)</label>
          <input
            type="text"
            className={s.textInput}
            placeholder='e.g. "under $500", "in white oak"'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            disabled={isRefining}
          />
        </div>

        <button
          className={s.searchBtn}
          onClick={handleSearch}
          disabled={!file || isRefining}
        >
          {isRefining ? <span className={s.spinner} /> : '🔍 Search Catalog'}
        </button>

        {displayError && (
          <div className={s.errorBanner}>
            <span>⚠️</span>
            <span>{displayError}</span>
          </div>
        )}

        <AnalysisSummary analysis={searchResult.analysis} meta={searchResult} />
      </div>

      <div className={s.resultsArea}>
        <div className={s.headerBar}>
          <button className={s.backBtn} onClick={() => navigate('/')}>
            ← New Search
          </button>
        </div>

        {isRefining && (
          <div className={s.emptyState}>
            <div className={s.spinnerLarge} />
            <h2>Analyzing & searching...</h2>
            <p>This may take a few seconds.</p>
          </div>
        )}

        {!isRefining && searchResult.results.length === 0 && (
          <div className={s.emptyState}>
            <div className={s.emptyIcon}>😕</div>
            <h2>No matches found</h2>
            <p>Try a different image or adjust your query.</p>
          </div>
        )}

        {!isRefining && searchResult.results.length > 0 && (
          <div className={s.resultsGrid}>
            {searchResult.results.map((product, i) => (
              <ProductCard key={product._id} product={product} rank={i + 1} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
