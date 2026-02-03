/**
 * 숫자 포맷터 (천 단위 콤마)
 * 예: 10000 -> "10,000"
 */
export const formatNumber = (value) => {
    if (value === undefined || value === null || value === '') return '0';
    return new Intl.NumberFormat('ko-KR').format(value);
};

/**
 * 통화 포맷터 (원 표시 포함)
 * 예: 10000 -> "10,000원"
 */
export const formatCurrency = (value) => {
    return `${formatNumber(value)}원`;
};
