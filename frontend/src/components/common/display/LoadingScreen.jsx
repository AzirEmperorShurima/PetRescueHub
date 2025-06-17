import React from 'react';

const LoadingScreen = ({ message = 'Đang tải...' }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        width: '100%',
      }}
    >
      <div className="loading-spinner">
        <div className="spinner"></div>
      </div>
      <h3 style={{ marginTop: '16px' }}>{message}</h3>
      
      <style jsx>{`
        .loading-spinner {
          display: inline-block;
          position: relative;
          width: 60px;
          height: 60px;
        }
        .spinner {
          box-sizing: border-box;
          display: block;
          position: absolute;
          width: 48px;
          height: 48px;
          margin: 6px;
          border: 4px solid #1976d2;
          border-radius: 50%;
          animation: spin 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
          border-color: #1976d2 transparent transparent transparent;
        }
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default LoadingScreen;