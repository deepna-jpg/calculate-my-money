import Decimal from 'decimal.js';
import { TAX_RATE, PRODUCT_TYPES } from '../constants';

/**
 * Decimal 설정
 */
Decimal.set({ precision: 20, rounding: Decimal.ROUND_HALF_UP });

/**
 * 과세 유형별 세율 정의
 */
export const TAX_TYPES = {
    NORMAL: { label: '일반(15.4%)', rate: 0.154 },
    PREFERENTIAL: { label: '세금우대(1.4%)', rate: 0.014 }, // 농특세 1.4%
    NON_TAX: { label: '비과세(0%)', rate: 0.0 },
};

/**
 * 예금(거치식) 이자 계산
 */
export const calculateDepositInterest = (principal, rate, period, taxRate = 0.154) => {
    if (!principal || !rate || !period) return emptyResult();

    const P = new Decimal(principal);
    const R = new Decimal(rate).div(100);
    const N = new Decimal(period);

    // 세전 이자 = P * R * (N / 12)
    const interestBeforeTax = P.times(R).times(N.div(12));

    return calculateTaxAndTotal(interestBeforeTax, P, taxRate);
};

/**
 * 적금(적립식) 이자 계산
 */
export const calculateSavingsInterest = (monthlyAmount, rate, period, taxRate = 0.154) => {
    if (!monthlyAmount || !rate || !period) return emptyResult();

    const P = new Decimal(monthlyAmount);
    const R = new Decimal(rate).div(100);
    const N = new Decimal(period);

    const totalPrincipal = P.times(N);

    const interestFactor = N.times(N.plus(1)).div(2);
    const interestBeforeTax = P.times(R.div(12)).times(interestFactor);

    return calculateTaxAndTotal(interestBeforeTax, totalPrincipal, taxRate);
};

/**
 * 공통: 세금 계산 및 최종 결과 반환
 */
const calculateTaxAndTotal = (interestBeforeTax, principal, taxRate) => {
    // taxRate 적용
    const tRate = new Decimal(taxRate);

    // 1. 세금 계산 (원단위 절사 -> 10원 단위 절사로 변경)
    // 금융권 표준: 세금은 10원 미만을 버림(절사)합니다.
    let taxAmount = interestBeforeTax.times(tRate);
    taxAmount = taxAmount.div(10).floor().times(10);

    // 2. 세후 이자
    const interestAfterTax = interestBeforeTax.minus(taxAmount).floor();

    // 3. 만기 수령액
    const totalReceipt = principal.plus(interestAfterTax);

    return {
        interestBeforeTax: interestBeforeTax.floor().toNumber(),
        taxAmount: taxAmount.toNumber(),
        interestAfterTax: interestAfterTax.toNumber(),
        totalReceipt: totalReceipt.toNumber(),
        totalPrincipal: principal.toNumber(),
    };
};

const emptyResult = () => ({
    interestBeforeTax: 0,
    taxAmount: 0,
    interestAfterTax: 0,
    totalReceipt: 0,
    totalPrincipal: 0,
});

/**
 * 통합 계산기 함수
 */
export const calculateProduct = (product) => {
    const { type, principal, period, baseRate, primeRate, taxType } = product;

    // 금리 합산
    const r1 = baseRate ? new Decimal(baseRate) : new Decimal(0);
    const r2 = primeRate ? new Decimal(primeRate) : new Decimal(0);
    const totalRate = r1.plus(r2).toNumber();

    // 세율 결정 (기본값: 일반과세 15.4%)
    // taxType이 없거나 정의되지 않은 경우 NORMAL로 처리
    const selectedTax = TAX_TYPES[taxType] || TAX_TYPES.NORMAL;
    const currentTaxRate = selectedTax.rate;

    if (!principal || !period || totalRate <= 0) return emptyResult();

    if (type === 'DEPOSIT' || type === PRODUCT_TYPES.DEPOSIT) {
        return calculateDepositInterest(principal, totalRate, period, currentTaxRate);
    } else {
        return calculateSavingsInterest(principal, totalRate, period, currentTaxRate);
    }
};
