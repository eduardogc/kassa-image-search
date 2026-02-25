import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { WeightSlider } from '../WeightSlider';

describe('WeightSlider', () => {
    it('renders label, description, and formatted value', () => {
        render(
            <WeightSlider label="Text Relevance" desc="MongoDB text search score" value={0.4} onChange={() => { }} />
        );

        expect(screen.getByText('Text Relevance')).toBeDefined();
        expect(screen.getByText('MongoDB text search score')).toBeDefined();
        expect(screen.getByText('0.40')).toBeDefined();
    });

    it('renders a range input with correct attributes', () => {
        render(
            <WeightSlider label="Weight" desc="A weight" value={0.5} onChange={() => { }} min={0} max={1} step={0.1} />
        );

        const input = screen.getByRole('slider') as HTMLInputElement;
        expect(input.type).toBe('range');
        expect(input.value).toBe('0.5');
        expect(input.min).toBe('0');
        expect(input.max).toBe('1');
        expect(input.step).toBe('0.1');
    });

    it('calls onChange with the parsed float value', () => {
        const handleChange = vi.fn();
        render(
            <WeightSlider label="Weight" desc="A weight" value={0.5} onChange={handleChange} />
        );

        const input = screen.getByRole('slider');
        fireEvent.change(input, { target: { value: '0.75' } });

        expect(handleChange).toHaveBeenCalledWith(0.75);
    });
});
