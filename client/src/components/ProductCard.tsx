import type { ScoredProduct } from '../types';
import * as s from './ProductCard.styles';

interface Props {
  product: ScoredProduct;
  rank: number;
}

const CATEGORY_EMOJI: Record<string, string> = {
  Beds: '🛏️',
  Benches: '🪑',
  Bookshelves: '📚',
  Cabinets: '🗄️',
  Chairs: '💺',
  'Coffee Tables': '☕',
  Desks: '🖥️',
  Dressers: '🗃️',
  Lighting: '💡',
  Nightstands: '🛋️',
  Ottomans: '🛋️',
  Sofas: '🛋️',
  'TV Stands': '📺',
  Tables: '🍽️',
  Wardrobes: '👗',
};

const CATEGORY_GRADIENT: Record<string, string> = {
  Beds: 'linear-gradient(135deg, #667eea22, #764ba222)',
  Benches: 'linear-gradient(135deg, #f093fb22, #f5576c22)',
  Bookshelves: 'linear-gradient(135deg, #4facfe22, #00f2fe22)',
  Cabinets: 'linear-gradient(135deg, #43e97b22, #38f9d722)',
  Chairs: 'linear-gradient(135deg, #fa709a22, #fee14022)',
  'Coffee Tables': 'linear-gradient(135deg, #a18cd122, #fbc2eb22)',
  Desks: 'linear-gradient(135deg, #fccb9022, #d57eeb22)',
  Dressers: 'linear-gradient(135deg, #a1c4fd22, #c2e9fb22)',
  Lighting: 'linear-gradient(135deg, #ffecd222, #fcb69f22)',
  Nightstands: 'linear-gradient(135deg, #667eea22, #764ba222)',
  Ottomans: 'linear-gradient(135deg, #ff9a9e22, #fecfef22)',
  Sofas: 'linear-gradient(135deg, #89f7fe22, #66a6ff22)',
  'TV Stands': 'linear-gradient(135deg, #764ba222, #667eea22)',
  Tables: 'linear-gradient(135deg, #f6d36522, #fda08522)',
  Wardrobes: 'linear-gradient(135deg, #e0c3fc22, #8ec5fc22)',
};

export function ProductCard({ product, rank }: Props) {
  const { signals } = product;
  const emoji = CATEGORY_EMOJI[product.category] || '🪑';
  const gradient = CATEGORY_GRADIENT[product.category] || 'linear-gradient(135deg, #667eea22, #764ba222)';

  return (
    <div className={s.card}>
      <div className={s.thumbnail} style={{ background: gradient }}>
        <span className={s.thumbnailEmoji}>{emoji}</span>
        <span className={s.rank}>#{rank}</span>
        <span className={s.score}>{(product.score * 100).toFixed(0)}%</span>
      </div>

      <div className={s.cardBody}>
        <h3 className={s.title}>{product.title}</h3>
        <p className={s.description}>{product.description}</p>

        <div className={s.meta}>
          <span className={s.categoryBadge}>{product.category}</span>
          <span className={s.typeBadge}>{product.type}</span>
        </div>

        <div className={s.details}>
          <div className={s.price}>${product.price.toFixed(2)}</div>
          <div className={s.dimensions}>
            {product.width} × {product.height} × {product.depth} cm
          </div>
        </div>

        <div className={s.signalBars}>
          <SignalBar label="Text" value={signals.textScore} />
          <SignalBar label="Category" value={signals.categoryMatch ? 1 : 0} />
          <SignalBar label="Type" value={signals.typeMatch ? 1 : 0} />
          <SignalBar label="Style" value={signals.styleMatch} />
        </div>
      </div>
    </div>
  );
}

function SignalBar({ label, value }: { label: string; value: number }) {
  return (
    <div className={s.signalBar}>
      <span className={s.signalLabel}>{label}</span>
      <div className={s.signalTrack}>
        <div className={s.signalFill} style={{ width: `${value * 100}%` }} />
      </div>
    </div>
  );
}
