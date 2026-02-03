import React from 'react';
import { formatNumber } from '../utils/formatter';

/**
 * SummaryCard: 계산 결과를 분석하여 말로 풀어주는 컴포넌트
 */
const SummaryCard = ({ items, results }) => {
    // 1. 유효한 결과가 없으면 아무것도 안 보여줌
    if (!items || items.length === 0) return null;

    // 2. 1등 상품 찾기
    let bestItem = null;
    let bestResult = null;
    let maxInterest = -1;

    items.forEach(item => {
        const res = results[item.id];
        if (res && res.totalPrincipal > 0 && res.interestAfterTax > maxInterest) {
            maxInterest = res.interestAfterTax;
            bestItem = item;
            bestResult = res;
        }
    });

    // 계산된 유효한 1등이 없으면 리턴
    if (!bestItem) return null;

    // 3. 차선책(2등) 찾기 (비교 멘트용)
    let secondBestInterest = -1;
    items.forEach(item => {
        const res = results[item.id];
        if (item.id !== bestItem.id && res && res.totalPrincipal > 0) {
            if (res.interestAfterTax > secondBestInterest) {
                secondBestInterest = res.interestAfterTax;
            }
        }
    });

    // 차액 계산 (2등이 없으면 0)
    const diff = secondBestInterest > 0 ? (maxInterest - secondBestInterest) : 0;

    // 추가 분석 데이터 계산
    const profit = bestResult.interestAfterTax;
    const profitRate = (profit / bestResult.totalPrincipal) * 100;

    return (
        <div className="summary-card">
            <div className="summary-icon">🎉</div>
            <div className="summary-content">
                <h3 className="summary-title">최고의 선택을 찾았습니다!</h3>
                <p className="summary-text" style={{ marginBottom: '1.2rem' }}>
                    <span className="highlight-name">
                        {bestItem.name ? `[${bestItem.name}]` : '입력하신'} 상품
                    </span>을
                    선택하시면 만기 시 총 <span className="highlight-amount">{formatNumber(bestResult.totalReceipt)}원</span>을 수령합니다.
                </p>

                {/* 상세 분석 박스 */}
                <div className="analysis-box">
                    <div className="analysis-item">
                        <span className="analysis-label">투자 원금</span>
                        <span className="analysis-value">{formatNumber(bestResult.totalPrincipal)}원</span>
                    </div>
                    <div className="analysis-item">
                        <span className="analysis-label">세금 (15.4%)</span>
                        <span className="analysis-value text-muted">-{formatNumber(bestResult.taxAmount)}원</span>
                    </div>
                    <div className="analysis-divider"></div>
                    <div className="analysis-item">
                        <span className="analysis-label">세후 순이익</span>
                        <span className="analysis-value highlight-profit">+{formatNumber(profit)}원</span>
                    </div>
                    <div className="analysis-item" style={{ marginTop: '2px' }}>
                        <span className="analysis-label">실질 수익률</span>
                        <span className="analysis-value highlight-rate">{profitRate.toFixed(2)}%</span>
                    </div>
                </div>

                {diff > 0 && (
                    <p className="summary-subtext" style={{ marginTop: '1rem' }}>
                        💡 차선책보다 <span className="highlight-diff">약 {formatNumber(diff)}원 더</span> 이득입니다.
                    </p>
                )}

                {diff === 0 && items.length > 1 && (
                    <p className="summary-subtext" style={{ marginTop: '1rem' }}>
                        현재 1등과 비슷한 수익률의 상품이 더 있습니다. 조건(기간, 우대금리 조건 등)을 한 번 더 확인해보세요.
                    </p>
                )}
            </div>
        </div>
    );
};

export default SummaryCard;
