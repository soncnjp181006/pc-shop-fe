// @ts-nocheck
import React, { useState, useEffect } from 'react';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';
import '../styles/AuthPage.css';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    if (!isDarkMode) {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
  }, [isDarkMode]);

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className="auth-container">
      {/* Nền Gradient mượt mà, tối giản */}
      <div className="auth-mesh-bg"></div>
      
      <div className="auth-card-wrapper">
        <div className="auth-box glass-panel">
          <div className="auth-header-row">
            <div className="auth-brand-minimal">
              <div className="brand-dot"></div>
              <span>PC SHOP</span>
            </div>
            
            <button 
              className="modern-theme-toggle" 
              onClick={toggleTheme}
              aria-label="Toggle Theme"
              title={isDarkMode ? "Chuyển sang chế độ sáng" : "Chuyển sang chế độ tối"}
            >
              <div className={`toggle-track ${isDarkMode ? 'dark' : 'light'}`}>
                <div className="toggle-thumb">
                  {isDarkMode ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="5"></circle>
                      <line x1="12" y1="1" x2="12" y2="3"></line>
                      <line x1="12" y1="21" x2="12" y2="23"></line>
                      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                      <line x1="1" y1="12" x2="3" y2="12"></line>
                      <line x1="21" y1="12" x2="23" y2="12"></line>
                      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                    </svg>
                  )}
                </div>
              </div>
            </button>
          </div>

          <div className="auth-content-main">
            <div className="auth-title-section">
              <h1>{isLogin ? 'Chào mừng trở lại' : 'Tạo tài khoản'}</h1>
              <p>{isLogin ? 'Vui lòng đăng nhập để tiếp tục' : 'Bắt đầu trải nghiệm mua sắm ngay hôm nay'}</p>
            </div>

            <div className="auth-form-container">
              {isLogin ? (
                <LoginForm toggleMode={toggleAuthMode} />
              ) : (
                <RegisterForm toggleMode={toggleAuthMode} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
