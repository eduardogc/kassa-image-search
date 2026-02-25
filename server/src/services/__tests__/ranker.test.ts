import { describe, it, expect } from 'vitest';
import * as ranker from '../ranker';

describe('Ranker Service', () => {
    it('exports rankResults function', () => {
        expect(ranker).toBeDefined();
        expect(ranker.rankResults).toBeDefined();
    });
});
