import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { apiFetch, cartApi } from '../../utils/api';
import './Header.css';

const Header = () => {
  const [user, setUser] = useState(null);
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Lấy query từ URL nếu có
  const queryParams = new URLSearchParams(location.search);
  const initialQuery = queryParams.get('q') || '';
  
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('theme') !== 'light');
  const [isScrolled, setIsScrolled] = useState(false);

  // Cập nhật searchQuery khi URL thay đổi (ví dụ: quay lại trang hoặc gõ trực tiếp URL)
  useEffect(() => {
    const q = new URLSearchParams(location.search).get('q') || '';
    setSearchQuery(q);
  }, [location.search]);

  const fetchCartCount = useCallback(async () => {
    const token = localStorage.getItem('access_token');
    if (!token) return;
    try {
      const response = await cartApi.getCart();
      if (response.ok) {
        const cartData = await response.json();
        const count = cartData.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;
        setCartItemsCount(count);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) return;

      try {
        const response = await apiFetch('/user/me');
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
          fetchCartCount();
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    fetchUser();

    // Listen for cart updates
    window.addEventListener('cartUpdated', fetchCartCount);
    return () => window.removeEventListener('cartUpdated', fetchCartCount);
  }, [fetchCartCount]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.remove('light');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.add('light');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const handleSearch = (e) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (query) {
      navigate(`/products?q=${encodeURIComponent(query)}`);
    } else {
      navigate('/products');
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    // Nếu đang ở trang sản phẩm, cập nhật URL luôn
    if (location.pathname === '/products') {
      navigate('/products');
    }
  };

  const toggleTheme = () => {
    setIsDarkMode((v) => !v);
  };

  const handleLogout = (e) => {
    e.stopPropagation();
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_role');
    setUser(null);
    setCartItemsCount(0);
    navigate('/');
  };

  return (
    <header className={`main-header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container header-container">
        <div className="header-left">
          <Link to="/home" className="logo-section">
            <div className="logo-icon-wrapper">
              <img src="/hero.png" alt="PC Shop Logo" className="header-logo" />
            </div>
            <span className="logo-text">PC<span className="accent">SHOP</span></span>
          </Link>

          <nav className="header-nav">
            <Link to="/products" className={`nav-link ${location.pathname === '/products' ? 'active' : ''}`}>
              Khám phá
            </Link>
          </nav>
        </div>

        <div className="header-center mobile-hidden">
          <form className="header-search-wrap" onSubmit={handleSearch}>
            <Search size={16} className="header-search-icon" />
            <input 
              type="text" 
              placeholder="Tìm linh kiện, máy tính..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="header-search-input"
            />
            {searchQuery && (
              <button type="button" className="header-search-clear" onClick={handleClearSearch}>
                <X size={14} />
              </button>
            )}
          </form>
        </div>

        <div className="header-right">
          <button className="icon-btn mobile-only search-trigger" title="Tìm kiếm">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>

          <button className="icon-btn theme-toggle" onClick={toggleTheme} title="Giao diện">
            {isDarkMode ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
            )}
          </button>

          <Link to="/cart" className="header-item cart-btn">
            <div className="icon-wrapper">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
              </svg>
              {cartItemsCount > 0 && <span className="cart-badge">{cartItemsCount}</span>}
            </div>
            <span className="item-label">Giỏ hàng</span>
          </Link>

          <Link to="/favorites" className="header-item favorites-btn">
            <div className="icon-wrapper">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </div>
            <span className="item-label">Yêu thích</span>
          </Link>

          {user ? (
            <div className="user-profile-dropdown">
              <div className="user-trigger" onClick={() => navigate('/profile')}>
                <div className="avatar-small">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <div className="user-info-text">
                  <span className="welcome-text">Xin chào,</span>
                  <span className="username-text">{user.username}</span>
                </div>
              </div>
              <button className="logout-btn" onClick={handleLogout} title="Đăng xuất">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4m7 14l5-5-5-5m5 5H9"/></svg>
              </button>
            </div>
          ) : (
            <Link to="/" className="btn btn-primary login-btn">Đăng nhập</Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
