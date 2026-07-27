import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Search, Sun, Moon, PenTool, BookOpen, LogOut, User, Menu, X, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import SearchModal from './ui/SearchModal';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [searchOpen, setSearchOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    setDropdownOpen(false);
    navigate('/auth');
  };

  const activeStyle = ({ isActive }) => 
    `font-brand text-sm font-medium tracking-wide transition-colors duration-200 py-1.5 ${
      isActive 
        ? 'text-text-primary border-b-2 border-text-primary' 
        : 'text-text-secondary hover:text-text-primary'
    }`;

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-bg-surface/90 backdrop-blur-md border-b border-border-base">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo Section */}
          <Link to="/" className="flex items-center gap-2">
            <span className="font-serif text-2xl font-black tracking-tight text-text-primary">
              Blogify<span className="text-accent-primary">.</span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            <NavLink to="/" className={activeStyle}>Home</NavLink>
            <NavLink to="/explore" className={activeStyle}>Explore</NavLink>
            <NavLink to="/write" className={activeStyle}>Write</NavLink>
          </nav>

          {/* Action Utilities (Search, Theme, Auth) */}
          <div className="hidden md:flex items-center gap-4">
            
            {/* Live Search Trigger */}
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="p-2.5 bg-bg-base border border-border-base rounded-full text-text-secondary hover:text-text-primary hover:border-text-secondary transition-all cursor-pointer"
              title="Search Articles"
            >
              <Search className="w-4.5 h-4.5" />
            </button>

            {/* Light/Dark Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2.5 bg-bg-base border border-border-base rounded-full text-text-secondary hover:text-text-primary hover:border-text-secondary transition-all cursor-pointer"
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-4.5 h-4.5 text-amber-400" /> : <Moon className="w-4.5 h-4.5" />}
            </button>

            {/* Auth Dropdown or Sign In */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-1.5 p-1 bg-bg-base hover:bg-border-base border border-border-base rounded-full select-none cursor-pointer pr-3"
                >
                  <img
                    src={user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.name || 'User'}`}
                    alt={user?.name}
                    className="w-8 h-8 rounded-full object-cover border border-border-base"
                  />
                  <ChevronDown className="w-4 h-4 text-text-secondary" />
                </button>

                {/* Dropdown Card */}
                {dropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
                    <div className="absolute right-0 mt-3 w-56 bg-bg-surface border border-border-base rounded-2xl shadow-xl py-2 z-20 animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="px-4 py-2.5 border-b border-border-base">
                        <p className="text-sm font-brand font-semibold text-text-primary truncate">{user?.name}</p>
                        <p className="text-xs font-brand font-normal text-text-secondary truncate mt-0.5">{user?.email}</p>
                      </div>
                      
                      <Link
                        to="/profile"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-text-secondary hover:text-text-primary hover:bg-bg-base transition-colors"
                      >
                        <User className="w-4 h-4" />
                        My Profile
                      </Link>
                      
                      <Link
                        to="/write"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-text-secondary hover:text-text-primary hover:bg-bg-base transition-colors"
                      >
                        <PenTool className="w-4 h-4" />
                        Write Essay
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors border-t border-border-base mt-1 text-left cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link
                to="/auth"
                className="inline-flex items-center justify-center font-brand font-semibold rounded-2xl px-5 py-2.5 text-sm bg-text-primary text-bg-base hover:opacity-90 active:scale-95 transition-all"
              >
                Sign In
              </Link>
            )}

          </div>

          {/* Mobile Navigation controls */}
          <div className="flex items-center gap-3 md:hidden">
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 text-text-secondary hover:text-text-primary cursor-pointer"
            >
              <Search className="w-5 h-5" />
            </button>
            <button
              onClick={toggleTheme}
              className="p-2 text-text-secondary hover:text-text-primary cursor-pointer"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-text-secondary hover:text-text-primary cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
          
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border-base bg-bg-surface px-4 py-4 space-y-3 shadow-lg">
            <NavLink
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block font-brand text-base font-medium text-text-secondary hover:text-text-primary px-3 py-2 rounded-lg"
            >
              Home
            </NavLink>
            <NavLink
              to="/explore"
              onClick={() => setMobileMenuOpen(false)}
              className="block font-brand text-base font-medium text-text-secondary hover:text-text-primary px-3 py-2 rounded-lg"
            >
              Explore
            </NavLink>
            <NavLink
              to="/write"
              onClick={() => setMobileMenuOpen(false)}
              className="block font-brand text-base font-medium text-text-secondary hover:text-text-primary px-3 py-2 rounded-lg"
            >
              Write
            </NavLink>
            {isAuthenticated ? (
              <>

                <NavLink
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block font-brand text-base font-medium text-text-secondary hover:text-text-primary px-3 py-2 rounded-lg border-t border-border-base pt-3"
                >
                  My Profile ({user?.name})
                </NavLink>
                <button
                  onClick={handleLogout}
                  className="w-full text-left font-brand text-base font-medium text-red-600 px-3 py-2 rounded-lg cursor-pointer"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                to="/auth"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center font-brand font-semibold bg-text-primary text-bg-base px-4 py-2.5 rounded-xl mt-4"
              >
                Sign In
              </Link>
            )}
          </div>
        )}
      </header>

      {/* Global Search dialog */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
};

export default Navbar;
