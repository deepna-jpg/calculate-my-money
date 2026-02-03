/**
 * App Component
 * 애플리케이션의 최상위 컴포넌트입니다.
 * 전체 레이아웃 구조(헤더, 메인, 푸터)를 정의합니다.
 */
import { useState } from 'react';
import DataGrid from './components/DataGrid';
import Footer from './components/Footer';

function App() {
  return (
    // 전체 페이지를 감싸는 컨테이너입니다. 중앙 정렬과 최대 너비를 제한합니다.
    <div className="container">

      {/* 헤더 영역: 서비스 이름과 간단한 설명을 표시합니다 */}
      <header style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', color: 'var(--color-primary)' }}>MoneyGrid</h1>
        <p style={{ color: 'var(--color-text-sub)', marginTop: '0.5rem' }}>
          스마트 예적금 만기 수령액 계산기
        </p>
      </header>

      {/* 메인 콘텐츠 영역: 실제 계산기 기능(DataGrid)이 포함됩니다 */}
      <main style={{
        backgroundColor: 'var(--color-surface)', // 배경색 흰색
        padding: '2rem',                         // 내부 여백
        borderRadius: '12px',                    // 모서리 둥글게
        boxShadow: 'var(--shadow-md)',           // 부드러운 그림자 효과
        minHeight: '400px',                      // 최소 높이 설정
      }}>
        {/* 핵심 기능: 엑셀 스타일의 데이터 입력 및 계산 그리드 컴포넌트 */}
        <DataGrid />
      </main>

      {/* 푸터 영역: 저작권 및 외부 링크 표시 */}
      <Footer />
    </div>
  );
}

export default App;
