import { useState, useCallback } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { ImageUpload } from '../components/ImageUpload';
import { ProductCard } from '../components/ProductCard';
import { searchByImage } from '../services/api';
import { useStore } from '../store';
import type { SearchResponse, ImageAnalysis } from '../types';
import * as s from './ResultsPage.styles';

export function ResultsPage() {
  const navigate = useNavigate();
  const { openrouterApiKey, searchQuery, searchResult, setSearchResult, setSearchQuery } = useStore();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If we arrive here without a prior result, boot back to home
  if (!searchResult) {
    return <Navigate to="/" replace />;
  }

  const handleSearch = useCallback(async () => {
    if (!openrouterApiKey) {
      setError('Please configure your OpenRouter API Key in the Admin page first.');
      return;
    }
    if (!file) {
      setError('Please upload a new image to refine.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await searchByImage(file, openrouterApiKey, searchQuery || undefined);
      setSearchResult(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
    } finally {
      setLoading(false);
    }
  }, [file, searchQuery, openrouterApiKey, setSearchResult]);

  return (
    <div className={s.page}>
      <div className={s.sidebar}>
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
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <button
          className={s.searchBtn}
          onClick={handleSearch}
          disabled={!file || loading}
        >
          {loading ? <span className={s.spinner} /> : '🔍 Search Catalog'}
        </button>

        {error && <div className={s.errorBanner}>{error}</div>}
        {searchResult && <AnalysisSummary analysis={searchResult.analysis} meta={searchResult} />}
      </div>

      <div className={s.resultsArea}>
        <div className={s.headerBar}>
          <button className={s.backBtn} onClick={() => navigate('/')}>
            ← Back to fresh search
          </button>
        </div>

        {!searchResult && !loading && (
          <div className={s.emptyState}>
            <div className={s.emptyIcon}>🪑</div>
            <h2>Upload a furniture image to find matches</h2>
            <p>We'll analyze the image and search through 2,500+ products to find the best matches.</p>
          </div>
        )}

        {loading && (
          <div className={s.emptyState}>
            <div className={s.spinnerLarge} />
            <h2>Analyzing image & searching catalog...</h2>
            <p>This may take a few seconds.</p>
          </div>
        )}

        {searchResult && searchResult.results.length === 0 && (
          <div className={s.emptyState}>
            <div className={s.emptyIcon}>😕</div>
            <h2>No matches found</h2>
            <p>Try a different image or adjust the search query.</p>
          </div>
        )}

        {searchResult && searchResult.results.length > 0 && (
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

function AnalysisSummary({ analysis, meta }: { analysis: ImageAnalysis; meta: SearchResponse }) {
  return (
    <div className={s.analysisSummary}>
      <h4>AI Analysis</h4>
      <div className={s.analysisGrid}>
        <span className={s.analysisLabel}>Category</span>
        <span className={s.analysisValue}>{analysis.category}</span>
        <span className={s.analysisLabel}>Type</span>
        <span className={s.analysisValue}>{analysis.type}</span>
        <span className={s.analysisLabel}>Style</span>
        <span className={s.analysisValue}>{analysis.style}</span>
        <span className={s.analysisLabel}>Material</span>
        <span className={s.analysisValue}>{analysis.material}</span>
        <span className={s.analysisLabel}>Color</span>
        <span className={s.analysisValue}>{analysis.color}</span>
        <span className={s.analysisLabel}>Confidence</span>
        <span className={s.analysisValue}>{(analysis.confidence * 100).toFixed(0)}%</span>
      </div>
      <div className={s.metaInfo}>
        {meta.totalCandidates} candidates → {meta.results.length} results in {meta.searchTimeMs}ms
      </div>
    </div>
  );
}
