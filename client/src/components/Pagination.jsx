const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;

    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
        if (
            i === 1 ||
            i === totalPages ||
            (i >= currentPage - 1 && i <= currentPage + 1)
        ) {
            pages.push(i);
        } else if (pages[pages.length - 1] !== '...') {
            pages.push('...');
        }
    }

    return (
        <div className="pagination">
            <button
                className="pagination-btn"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
            >
                ‹
            </button>
            {pages.map((page, idx) =>
                page === '...' ? (
                    <span key={`ellipsis-${idx}`} className="pagination-ellipsis">…</span>
                ) : (
                    <button
                        key={page}
                        className={`pagination-btn ${page === currentPage ? 'pagination-btn--active' : ''}`}
                        onClick={() => onPageChange(page)}
                    >
                        {page}
                    </button>
                )
            )}
            <button
                className="pagination-btn"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                ›
            </button>
        </div>
    );
};

export default Pagination;
