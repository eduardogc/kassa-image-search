import * as s from './WeightSlider.styles';

export interface WeightSliderProps {
    label: string;
    desc: string;
    value: number;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
    step?: number;
}

export function WeightSlider({ label, desc, value, onChange, min = 0, max = 1, step = 0.05 }: WeightSliderProps) {
    return (
        <div className={s.wrapper}>
            <div className={s.header}>
                <span className={s.label}>{label}</span>
                <span className={s.value}>{value.toFixed(2)}</span>
            </div>
            <p className={s.desc}>{desc}</p>
            <input
                type="range"
                className={s.slider}
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={(e) => onChange(parseFloat(e.target.value))}
            />
        </div>
    );
}
