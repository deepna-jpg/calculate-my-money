import { useState } from 'react';
import DataGrid from './components/DataGrid';

function App() {
  return (
    <div className="container">
      <header style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', color: 'var(--color-primary)' }}>MoneyGrid</h1>
        <p style={{ color: 'var(--color-text-sub)', marginTop: '0.5rem' }}>
          스마트 예적금 만기 수령액 계산기
        </p>
      </header>

      <main style={{
        backgroundColor: 'var(--color-surface)',
        padding: '2rem',
        borderRadius: '12px',
        boxShadow: 'var(--shadow-md)',
        minHeight: '400px',
      }}>
        {/* 우리가 만든 엑셀 입력판을 여기에 짠! 하고 보여줍니다 */}
        <DataGrid />
      </main>
    </div>
  );
}

export default App;
