import * as s from './ParamField.styles';

export interface ParamFieldProps {
    label: string;
    desc: string;
    type: 'number' | 'text' | 'password';
    value: string | number;
    onChange: (value: string | number) => void;
    min?: number;
    max?: number;
    step?: number;
    placeholder?: string;
    wide?: boolean;
}

export function ParamField({ label, desc, type, value, onChange, min, max, step, placeholder, wide }: ParamFieldProps) {
    return (
        <div className={s.row}>
            <div className={s.info}>
                <label>{label}</label>
                <span className={s.desc}>{desc}</span>
            </div>
            <input
                type={type}
                className={wide ? s.inputWide : s.input}
                value={value}
                min={min}
                max={max}
                step={step}
                placeholder={placeholder}
                onChange={(e) => onChange(type === 'number' ? e.target.valueAsNumber : e.target.value)}
            />
        </div>
    );
}
