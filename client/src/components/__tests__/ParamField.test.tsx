import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ParamField } from '../ParamField';

describe('ParamField', () => {
    it('renders label and description', () => {
        render(
            <ParamField label="Max Results" desc="Maximum products returned" type="number" value={20} onChange={() => { }} />
        );

        expect(screen.getByText('Max Results')).toBeDefined();
        expect(screen.getByText('Maximum products returned')).toBeDefined();
    });

    it('renders a number input with min/max/step', () => {
        render(
            <ParamField label="Score" desc="Min score" type="number" value={0.5} min={0} max={1} step={0.01} onChange={() => { }} />
        );

        const input = screen.getByRole('spinbutton') as HTMLInputElement;
        expect(input.type).toBe('number');
        expect(input.value).toBe('0.5');
        expect(input.min).toBe('0');
        expect(input.max).toBe('1');
        expect(input.step).toBe('0.01');
    });

    it('renders a text input with placeholder', () => {
        render(
            <ParamField label="Model" desc="AI model" type="text" value="" placeholder="Enter model" onChange={() => { }} />
        );

        const input = screen.getByPlaceholderText('Enter model') as HTMLInputElement;
        expect(input.type).toBe('text');
    });

    it('renders a password input', () => {
        render(
            <ParamField label="API Key" desc="Your key" type="password" value="secret" onChange={() => { }} />
        );

        const input = screen.getByDisplayValue('secret') as HTMLInputElement;
        expect(input.type).toBe('password');
    });

    it('calls onChange with string value for text inputs', () => {
        const handleChange = vi.fn();
        render(
            <ParamField label="Model" desc="AI model" type="text" value="" onChange={handleChange} />
        );

        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: 'gpt-4' } });

        expect(handleChange).toHaveBeenCalledWith('gpt-4');
    });

    it('calls onChange with number value for number inputs', () => {
        const handleChange = vi.fn();
        render(
            <ParamField label="Max" desc="Max results" type="number" value={10} onChange={handleChange} />
        );

        const input = screen.getByRole('spinbutton');
        fireEvent.change(input, { target: { value: '25', valueAsNumber: 25 } });

        expect(handleChange).toHaveBeenCalledWith(25);
    });

    it('applies wide class when wide prop is set', () => {
        const { container } = render(
            <ParamField label="Model" desc="AI model" type="text" value="" wide onChange={() => { }} />
        );

        const input = container.querySelector('input') as HTMLInputElement;
        expect(input.className).toBeTruthy();
    });
});
