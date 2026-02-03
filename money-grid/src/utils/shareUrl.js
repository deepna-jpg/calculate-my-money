import LZString from 'lz-string';

const QUERY_PARAM = 'data';

/**
 * 1. 데이터 -> URL 변환 (압축)
 * 입력된 items 배열을 압축 문자열로 변환하여 현재 도메인 URL과 합칩니다.
 */
export const createShareUrl = (items) => {
    if (!items || items.length === 0) return '';

    // 1. 필요한 데이터만 추려서 용량 줄이기
    const minifiedData = items.map(item => ({
        t: item.type === 'DEPOSIT' ? 1 : 2, // 1:예금, 2:적금
        n: item.name,
        p: item.principal,
        pe: item.period,
        br: item.baseRate,
        pr: item.primeRate,
        tt: item.taxType || 'NORMAL' // [버그수정] 과세 구분 포함
    }));

    // 2. JSON 문자열 변환
    const jsonString = JSON.stringify(minifiedData);

    // 3. 압축 (URLSafe 방식 사용)
    const compressed = LZString.compressToEncodedURIComponent(jsonString);

    // 4. 전체 URL 생성
    const currentUrl = window.location.origin + window.location.pathname;
    return `${currentUrl}?${QUERY_PARAM}=${compressed}`;
};

/**
 * 2. URL -> 데이터 변환 (복구)
 * URL 쿼리 파라미터에서 data를 읽어와서 items 배열로 복구합니다.
 */
export const parseShareUrl = () => {
    const searchParams = new URLSearchParams(window.location.search);
    const compressed = searchParams.get(QUERY_PARAM);

    if (!compressed) return null;

    try {
        // 1. 압축 해제
        const jsonString = LZString.decompressFromEncodedURIComponent(compressed);
        if (!jsonString) return null;

        // 2. JSON 파싱
        const minifiedData = JSON.parse(jsonString);

        // 3. 앱에서 사용하는 데이터 구조로 복원
        // *주의: id(uuid)는 호출하는 쪽(DataGrid)에서 생성해야 안전함.
        return minifiedData.map(item => ({
            type: item.t === 1 ? 'DEPOSIT' : 'SAVINGS',
            name: item.n || '',
            principal: item.p || '',
            period: item.pe || '12',
            baseRate: item.br || '',
            primeRate: item.pr || '',
            taxType: item.tt || 'NORMAL' // [버그수정] 과세 구분 복구
        }));

    } catch (error) {
        console.error('URL 파싱 실패:', error);
        return null;
    }
};
