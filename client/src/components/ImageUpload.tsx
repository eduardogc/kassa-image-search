import { useCallback, useState, type DragEvent, type ChangeEvent } from 'react';
import { cx } from '@emotion/css';
import * as s from './ImageUpload.styles';

interface Props {
    onFileSelected: (file: File) => void;
    disabled?: boolean;
}

export function ImageUpload({ onFileSelected, disabled }: Props) {
    const [preview, setPreview] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleFile = useCallback((file: File) => {
        if (!file.type.startsWith('image/')) return;
        setPreview(URL.createObjectURL(file));
        onFileSelected(file);
    }, [onFileSelected]);

    const onDrop = useCallback((e: DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) handleFile(file);
    }, [handleFile]);

    const onFileChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleFile(file);
    }, [handleFile]);

    return (
        <div
            className={cx(s.base, isDragging && s.dragging, disabled && s.disabled)}
            onDrop={onDrop}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
        >
            {preview ? (
                <div className={s.previewContainer}>
                    <img src={preview} alt="Upload preview" className={s.previewImage} />
                    <label className={s.changeBtn}>
                        Change Image
                        <input type="file" accept="image/*" onChange={onFileChange} hidden disabled={disabled} />
                    </label>
                </div>
            ) : (
                <label className={s.prompt}>
                    <div className={s.icon}>📷</div>
                    <p className={s.title}>Drop a furniture image here</p>
                    <p className={s.subtitle}>or click to browse</p>
                    <input type="file" accept="image/*" onChange={onFileChange} hidden disabled={disabled} />
                </label>
            )}
        </div>
    );
}
