import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import InputRow from './InputRow';
import SummaryCard from './SummaryCard';
import MobileCardList from './MobileCardList';
import ComparisonChart from './ComparisonChart';
import { calculateProduct } from '../utils/financeCalculator';
import { createShareUrl, parseShareUrl } from '../utils/shareUrl';
import './DataGrid.css';

/**
 * DataGrid: 엑셀 전체 판
 */
const DataGrid = () => {
    // 1. 입력 데이터 (원금, 기간 등)
    // 1. 입력 데이터 (원금, 기간 등)
    // 초기 로드 시 URL 파싱을 위해 일단 비워둠 (useEffect에서 처리)
    const [items, setItems] = useState([]);

    // 0. 컴포넌트 마운트 시 URL 데이터 확인 및 초기화
    useEffect(() => {
        const sharedItems = parseShareUrl();
        if (sharedItems && sharedItems.length > 0) {
            // 공유된 데이터가 있으면 ID를 생성하여 복원
            const restoredItems = sharedItems.map(item => ({
                ...item,
                id: uuidv4()
            }));
            setItems(restoredItems);
        } else {
            // 공유된 게 없으면 기본 예제 데이터 생성
            setItems([
                {
                    id: uuidv4(),
                    type: 'DEPOSIT',
                    name: '',
                    principal: '10000000',
                    period: '12',
                    baseRate: '3.0',
                    primeRate: '0.0',
                    taxType: 'NORMAL',
                }
            ]);
        }
    }, []);

    // 2. 계산 결과 (이자, 세금 등)
    // items가 바뀌면 자동으로 다시 계산해서 여기에 저장됨
    const [results, setResults] = useState({});

    // items가 바뀔 때마다 실행되는 마법의 주문 (Effect)
    useEffect(() => {
        const tempResults = {};
        let maxInterest = -1;
        let bestId = null;

        // 1. 모든 상품 계산 및 1등 찾기
        items.forEach(item => {
            const res = calculateProduct(item);
            tempResults[item.id] = res;

            // 계산 성공했고(원금이 있음), 현재 1등보다 이자가 높으면 갱신
            if (res.totalPrincipal > 0 && res.interestAfterTax > maxInterest) {
                maxInterest = res.interestAfterTax;
                bestId = item.id;
            }
        });

        // 2. 1등 대비 차액(Diff) 계산 등 추가 정보 주입
        const finalResults = {};
        items.forEach(item => {
            const res = tempResults[item.id];
            // 원금이 없으면 1등 비교 대상에서 제외
            const hasPrincipal = res.totalPrincipal > 0;
            const isBest = hasPrincipal && (bestId === item.id);

            // 차액 계산 (내 이자 - 1등 이자) -> 결과는 0 또는 음수
            // 만약 내가 1등이거나, 1등 데이터가 없으면 차액은 0
            const diff = (isBest || !bestId) ? 0 : (res.interestAfterTax - maxInterest);

            finalResults[item.id] = {
                ...res,
                isBest,       // 내가 1등인가?
                diffFromBest: diff // 1등이랑 얼마 차이나나? (음수)
            };
        });

        setResults(finalResults);
    }, [items]); // items가 변할 때만 실행!

    const handleAddRow = () => {
        const newRow = {
            id: uuidv4(),
            type: 'DEPOSIT',
            name: '',
            principal: '',
            period: '12',
            baseRate: '',
            primeRate: '',
            taxType: 'NORMAL',
        };
        setItems([...items, newRow]);
    };

    const handleChange = (id, field, value) => {
        setItems(items.map(item => {
            if (item.id === id) {
                return { ...item, [field]: value };
            }
            return item;
        }));
    };

    const handleDelete = (id) => {
        setItems(items.filter(item => item.id !== id));
    };

    return (
        <div className="grid-wrapper">
            {/* PC용 그리드 컨테이너 (Desktop only) */}
            <div className="grid-container desktop-view-container">
                {/* 안내 문구 (범례) */}
                <div style={{
                    textAlign: 'right',
                    fontSize: '0.8rem',
                    color: '#64748b',
                    marginBottom: '8px',
                    paddingRight: '4px'
                }}>
                    ℹ️ <span style={{ color: 'var(--color-alert)' }}>붉은색 숫자</span>는 1등 상품 대비 덜 받게 되는 차액입니다.
                </div>

                {/* 헤더 */}
                <div className="grid-header">
                    <div className="col-type header-cell">종류</div>
                    <div className="col-name header-cell">상품명</div>
                    <div className="col-amount header-cell">금액 (원/월)</div>
                    <div className="col-period header-cell">기간</div>
                    <div className="col-rate header-cell">기본 + 우대 %</div>
                    <div className="col-tax-type header-cell">과세 구분</div>

                    {/* 결과 헤더 추가 */}
                    <div className="col-result-before header-cell">세전 이자</div>
                    <div className="col-result-tax header-cell">세금(15.4%)</div>
                    <div className="col-result-after header-cell" style={{ color: 'var(--color-primary)' }}>세후 수령액</div>

                    <div className="col-action header-cell">삭제</div>
                </div>

                {/* 바디 (PC용) */}
                {items.map((item) => (
                    <InputRow
                        key={item.id}
                        data={item}
                        result={results[item.id]} // 계산된 결과를 전달
                        onChange={handleChange}
                        onDelete={handleDelete}
                    />
                ))}
            </div>

            {/* 모바일용 카드 리스트 (Mobile only) */}
            <div className="mobile-view-container">
                <MobileCardList
                    items={items}
                    results={results}
                    onChange={handleChange}
                    onDelete={handleDelete}
                />
            </div>

            {/* 버튼 그룹 (추가 / 공유) */}
            <div className="button-group">
                <button className="btn-add" onClick={handleAddRow}>
                    + 상품 추가 및 비교
                </button>
                <button
                    className="btn-share"
                    onClick={async () => {
                        const url = createShareUrl(items);
                        try {
                            await navigator.clipboard.writeText(url);
                            alert('링크가 복사되었습니다! 친구에게 공유해보세요.');
                        } catch (err) {
                            prompt('아래 링크를 복사하세요:', url);
                        }
                    }}
                >
                    🔗 결과 공유하기
                </button>
            </div>

            {/* 요약 카드 (분석 리포트) */}
            <SummaryCard items={items} results={results} />

            {/* 비교 차트 (시각화) */}
            <ComparisonChart items={items} results={results} />
        </div>
    );
};

export default DataGrid;
