import React from 'react';
import { PRODUCT_TYPES } from '../constants';
import { TAX_TYPES } from '../utils/financeCalculator';
import { formatNumber } from '../utils/formatter';

/**
 * InputRow: 엑셀의 "한 줄"에 해당하는 부품
 * 입력 필드 + 실시간 계산 결과 표시
 */
const InputRow = ({ data, result, onChange, onDelete }) => {

    const handleChange = (field, value) => {
        onChange(data.id, field, value);
    };

    return (
        <div className="input-row">
            {/* --- 입력 영역 --- */}

            {/* 1. 예금/적금 선택 */}
            <div className="col-type header-cell">
                <select
                    className="select-field"
                    value={data.type}
                    onChange={(e) => handleChange('type', e.target.value)}
                >
                    <option value="DEPOSIT">{PRODUCT_TYPES.DEPOSIT}</option>
                    <option value="SAVINGS">{PRODUCT_TYPES.SAVINGS}</option>
                </select>
            </div>

            {/* 2. 상품명 */}
            <div className="col-name header-cell">
                <input
                    type="text"
                    className="input-field text-left"
                    placeholder="상품명 (선택)"
                    value={data.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                />
            </div>

            {/* 3. 금액 */}
            <div className="col-amount header-cell">
                <input
                    type="number"
                    className="input-field"
                    placeholder="0"
                    value={data.principal}
                    onChange={(e) => handleChange('principal', e.target.value)}
                />
            </div>

            {/* 4. 기간 */}
            <div className="col-period header-cell">
                <div style={{ display: 'flex', gap: '4px', alignItems: 'center', width: '100%' }}>
                    <input
                        type="number"
                        className="input-field"
                        placeholder="12"
                        value={data.period}
                        onChange={(e) => handleChange('period', e.target.value)}
                    />
                    <span style={{ fontSize: '0.8rem', color: '#666', whiteSpace: 'nowrap' }}>개월</span>
                </div>
            </div>

            {/* 5. 이자율 (기본 + 우대) */}
            <div className="col-rate header-cell">
                <div className="double-input-container">
                    <input
                        type="number"
                        className="input-field"
                        placeholder="기본"
                        title="기본 금리"
                        value={data.baseRate}
                        onChange={(e) => handleChange('baseRate', e.target.value)}
                    />
                    <span style={{ color: '#ccc' }}>+</span>
                    <input
                        type="number"
                        className="input-field"
                        placeholder="우대"
                        title="우대 금리"
                        value={data.primeRate}
                        onChange={(e) => handleChange('primeRate', e.target.value)}
                    />
                    <span style={{ fontSize: '0.8rem', color: '#666' }}>%</span>
                </div>
            </div>

            {/* 5.5 과세 구분 (신설) */}
            <div className="col-tax-type header-cell">
                <select
                    className="select-field"
                    style={{ fontSize: '0.8rem', padding: '4px' }}
                    value={data.taxType || 'NORMAL'}
                    onChange={(e) => handleChange('taxType', e.target.value)}
                >
                    {Object.entries(TAX_TYPES).map(([key, value]) => (
                        <option key={key} value={key}>{value.label}</option>
                    ))}
                </select>
            </div>

            {/* --- 결과 영역 (계산된 값 표시) --- */}

            {/* 6. 세전 이자 */}
            <div className="col-result-before header-cell">
                <span className="result-text" title="세전 이자">
                    {formatNumber(result?.interestBeforeTax || 0)}
                </span>
            </div>

            {/* 7. 세금 */}
            <div className="col-result-tax header-cell">
                <span className="result-text" title="이자 소득세">
                    {formatNumber(result?.taxAmount || 0)}
                </span>
            </div>

            {/* 8. 만기 수령액 (가장 중요!) */}
            <div className="col-result-after header-cell" style={{
                flexDirection: 'column',
                alignItems: 'flex-end',
                justifyContent: 'center'
            }}>
                {/* 메인 금액 표시 */}
                <span
                    className={`result-text ${result?.isBest ? 'best' : ''}`}
                    title="세후 만기 수령액"
                    style={{ fontSize: result?.isBest ? '1rem' : '0.9rem' }}
                >
                    {formatNumber(result?.totalReceipt || 0)}
                </span>

                {/* 1등 대비 차액 표시 (1등이 아닐 때만) */}
                {!result?.isBest && result?.diffFromBest < 0 && (
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-alert)', marginTop: '2px' }}>
                        {formatNumber(result.diffFromBest)}
                    </span>
                )}

                {/* 1등 뱃지 표시 */}
                {result?.isBest && result?.totalReceipt > 0 && (
                    <span className="badge-best">1등 🔥</span>
                )}
            </div>

            {/* 9. 삭제 버튼 */}
            <div className="col-action header-cell">
                <button
                    className="btn-delete"
                    onClick={() => onDelete(data.id)}
                    title="행 삭제"
                >
                    ✕
                </button>
            </div>
        </div>
    );
};

export default InputRow;
