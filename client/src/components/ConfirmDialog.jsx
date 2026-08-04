import { useEffect, useRef } from 'react';

const ConfirmDialog = ({ title, text, subtext, confirmLabel, pendingLabel, cancelLabel = 'Отмена', onConfirm, onCancel, isPending = false, danger = false }) => {
    const dialogRef = useRef(null);

    useEffect(() => {
        const el = dialogRef.current;
        if (!el) return;

        el.focus();

        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                e.preventDefault();
                onCancel();
                return;
            }

            if (e.key === 'Tab') {
                const focusables = el.querySelectorAll(
                    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                );
                if (focusables.length === 0) return;
                const first = focusables[0];
                const last = focusables[focusables.length - 1];
                if (e.shiftKey && document.activeElement === first) {
                    e.preventDefault();
                    last.focus();
                } else if (!e.shiftKey && document.activeElement === last) {
                    e.preventDefault();
                    first.focus();
                }
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [onCancel]);

    return (
        <div className="modal-overlay" onClick={onCancel}>
            <div
                ref={dialogRef}
                role="dialog"
                aria-modal="true"
                aria-label={title}
                tabIndex={-1}
                className="modal-content"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="modal-header">
                    <div className="modal-title">{title}</div>
                </div>
                <div className="modal-body">
                    <p className="modal-text">{text}</p>
                    {subtext && <p className="modal-subtext">{subtext}</p>}
                </div>
                <div className="modal-actions">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="secondary-button"
                        disabled={isPending}
                    >
                        {cancelLabel}
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        className={`primary-button ${danger ? 'danger-button' : ''}`}
                        disabled={isPending}
                    >
                        {isPending ? (pendingLabel || confirmLabel) : confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDialog;
