import React from 'react';
import { PRODUCT_TYPES } from '../constants';
import { TAX_TYPES } from '../utils/financeCalculator';
import { formatNumber } from '../utils/formatter';

/**
 * MobileCardItem: 모바일용 카드 형태의 입력 컴포넌트
 */
const MobileCardItem = ({ data, result, onChange, onDelete, index }) => {
    const handleChange = (field, value) => {
        onChange(data.id, field, value);
    };

    return (
        <div className={`mobile-card ${result?.isBest ? 'best-card' : ''}`}>
            {/* 헤더: 구분/상품명/삭제 */}
            <div className="card-header">
                <div className="card-header-left">
                    <span className="row-number">#{index + 1}</span>
                    <select
                        className="card-select-type"
                        value={data.type}
                        onChange={(e) => handleChange('type', e.target.value)}
                    >
                        <option value="DEPOSIT">{PRODUCT_TYPES.DEPOSIT}</option>
                        <option value="SAVINGS">{PRODUCT_TYPES.SAVINGS}</option>
                    </select>
                </div>
                <button className="btn-card-delete" onClick={() => onDelete(data.id)}>✕</button>
            </div>

            {/* 상품명 입력 */}
            <div className="card-row">
                <input
                    type="text"
                    className="card-input-name"
                    placeholder="상품명 (예: 특판예금)"
                    value={data.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                />
            </div>

            {/* 입력 필드 모음 */}
            <div className="card-body">
                <div className="card-input-group">
                    <label>금액</label>
                    <div className="input-with-unit">
                        <input
                            type="number"
                            className="card-input"
                            placeholder="0"
                            value={data.principal}
                            onChange={(e) => handleChange('principal', e.target.value)}
                        />
                        <span>원</span>
                    </div>
                </div>

                <div className="card-input-group">
                    <label>기간</label>
                    <div className="input-with-unit">
                        <input
                            type="number"
                            className="card-input"
                            placeholder="12"
                            value={data.period}
                            onChange={(e) => handleChange('period', e.target.value)}
                        />
                        <span>개월</span>
                    </div>
                </div>
            </div>

            <div className="card-body">
                <div className="card-input-group">
                    <label>금리 (기본+우대)</label>
                    <div className="input-with-unit double">
                        <input
                            type="number"
                            className="card-input small"
                            placeholder="기본"
                            value={data.baseRate}
                            onChange={(e) => handleChange('baseRate', e.target.value)}
                        />
                        <span>+</span>
                        <input
                            type="number"
                            className="card-input small"
                            placeholder="우대"
                            value={data.primeRate}
                            onChange={(e) => handleChange('primeRate', e.target.value)}
                        />
                        <span>%</span>
                    </div>
                </div>

                <div className="card-input-group">
                    <label>과세</label>
                    <select
                        className="card-input"
                        value={data.taxType || 'NORMAL'}
                        onChange={(e) => handleChange('taxType', e.target.value)}
                    >
                        {Object.entries(TAX_TYPES).map(([key, value]) => (
                            <option key={key} value={key}>{value.label}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* 결과 표시 영역 */}
            <div className="card-footer">
                <div className="result-row">
                    <span>세전 이자</span>
                    <span>{formatNumber(result?.interestBeforeTax || 0)}원</span>
                </div>
                <div className="result-row">
                    <span>세금</span>
                    <span>-{formatNumber(result?.taxAmount || 0)}원</span>
                </div>
                <div className="result-row total">
                    <span>세후 수령액</span>
                    <span className={result?.isBest ? 'text-best' : ''}>
                        {formatNumber(result?.totalReceipt || 0)}원
                    </span>
                </div>

                {result?.isBest && (
                    <div className="card-badge">👑 1등 상품</div>
                )}

                {!result?.isBest && result?.diffFromBest < 0 && (
                    <div className="card-diff">
                        1등보다 {formatNumber(Math.abs(result.diffFromBest))}원 덜 받아요 😢
                    </div>
                )}
            </div>
        </div>
    );
};

const MobileCardList = ({ items, results, onChange, onDelete }) => {
    return (
        <div className="mobile-card-list">
            {items.map((item, index) => (
                <MobileCardItem
                    key={item.id}
                    index={index}
                    data={item}
                    result={results[item.id]}
                    onChange={onChange}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
};

export default MobileCardList;
