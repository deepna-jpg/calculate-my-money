import React from 'react';
import { formatNumber } from '../utils/formatter';

/**
 * ComparisonChart: 수익금 비교 막대 그래프 (Stacked Bar)
 */
const ComparisonChart = ({ items, results }) => {
    if (!items || items.length < 2) return null; // 비교 대상이 2개 미만이면 차트 안 그림

    // 1. 차트용 데이터 가공
    const dataList = items.map(item => {
        const res = results[item.id];
        if (!res || res.totalPrincipal <= 0) return null;
        return {
            id: item.id,
            name: item.name || '이름 없는 상품',
            amount: res.totalReceipt, // 총 수령액 (정렬 기준)
        };
    }).filter(d => d !== null);

    if (dataList.length < 2) return null;

    // 2. 금액 순으로 정렬 (많은 게 위로)
    dataList.sort((a, b) => b.amount - a.amount);

    // 3. 최대값 찾기 (그래프 비율 계산용)
    const maxAmount = dataList[0].amount;

    return (
        <div className="chart-container">
            <h3 className="chart-title">
                📊 예상 수령액 순위
                <span style={{ fontSize: '0.8rem', fontWeight: 'normal', marginLeft: '8px', color: '#64748b' }}>
                    (■ 원금 + <span style={{ fontWeight: 'bold' }}>■ 수익</span>)
                </span>
            </h3>
            <div className="bar-list">
                {dataList.map((data, index) => {
                    // 상세 데이터 가져오기
                    const res = results[data.id];
                    const principal = res.totalPrincipal;
                    const profit = res.interestAfterTax;

                    // 막대 길이 (%)
                    const principalPercent = (principal / maxAmount) * 100;
                    const profitPercent = (profit / maxAmount) * 100;

                    // 합계 위치 (막대 바로 오른쪽)
                    const totalPercent = principalPercent + profitPercent;

                    return (
                        <div key={data.id} className="chart-row">
                            {/* 왼쪽 라벨 (순위 + 이름) */}
                            <div className="chart-label">
                                <span className="chart-rank">{index + 1}위</span>
                                <span className="chart-name text-truncate">{data.name}</span>
                            </div>

                            {/* 막대 영역 (스택형) */}
                            <div className="chart-bar-area">
                                <div className="chart-bar-stack">
                                    {/* 1. 원금 막대 */}
                                    <div
                                        className={`bar-segment principal ${index === 0 ? 'best' : ''}`}
                                        style={{ width: `${principalPercent}%` }}
                                        title={`원금: ${formatNumber(principal)}원`}
                                    ></div>

                                    {/* 2. 수익 막대 */}
                                    <div
                                        className={`bar-segment profit ${index === 0 ? 'best' : ''}`}
                                        style={{ width: `${profitPercent}%` }}
                                        title={`수익: ${formatNumber(profit)}원`}
                                    ></div>
                                </div>

                                {/* 3. 총액 텍스트 (막대 끝에 절대 위치로 표시) */}
                                <div
                                    className="chart-value-wrapper"
                                    style={{ left: `${totalPercent}%` }}
                                >
                                    <span className={`chart-value-text ${index === 0 ? 'best' : ''}`}>
                                        {formatNumber(data.amount)}원
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ComparisonChart;
