import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Send, Heart, CodeXml, Earth, User, Rss } from 'lucide-react';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <footer className="bg-bg-surface border-t border-border-base pt-16 pb-12 font-body text-text-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 mb-12">
          
          {/* Column 1: Info & Tagline */}
          <div className="col-span-1 md:col-span-4 flex flex-col justify-between">
            <div>
              <Link to="/" className="flex items-center gap-2 mb-4">
                <span className="font-serif text-2xl font-black text-text-primary tracking-tight">
                  Blogify<span className="text-accent-primary">.</span>
                </span>
              </Link>
              <p className="text-sm leading-relaxed max-w-sm">
                A premium editorial platform dedicated to the art of writing. We explore software, engineering, design, careers, and the curiosities in between.
              </p>
            </div>
            <p className="text-xs font-heading font-medium tracking-wide uppercase text-accent-primary mt-6">
              Write beautifully. Read effortlessly.
            </p>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="col-span-1 md:col-span-4 grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-xs uppercase tracking-wider font-semibold font-heading text-text-primary mb-4">
                Journal
              </h4>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <Link to="/" className="hover:text-text-primary hover:underline transition-colors">
                    Home Page
                  </Link>
                </li>
                <li>
                  <Link to="/explore" className="hover:text-text-primary hover:underline transition-colors">
                    Explore Articles
                  </Link>
                </li>
                <li>
                  <Link to="/write" className="hover:text-text-primary hover:underline transition-colors">
                    Write Story
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-xs uppercase tracking-wider font-semibold font-heading text-text-primary mb-4">
                Categories
              </h4>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <Link to="/explore?category=AI" className="hover:text-text-primary hover:underline transition-colors">
                    Artificial Intel
                  </Link>
                </li>
                <li>
                  <Link to="/explore?category=Programming" className="hover:text-text-primary hover:underline transition-colors">
                    Development
                  </Link>
                </li>
                <li>
                  <Link to="/explore?category=Design" className="hover:text-text-primary hover:underline transition-colors">
                    UI & UX Design
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Column 3: Newsletter Sign-up */}
          <div className="col-span-1 md:col-span-4">
            <h4 className="text-xs uppercase tracking-wider font-semibold font-heading text-text-primary mb-4">
              Weekly Newsletter
            </h4>
            <p className="text-sm leading-relaxed mb-4">
              Get raw essays, design digests, and technology notes delivered directly to your inbox.
            </p>
            
            {subscribed ? (
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900 rounded-[16px] text-emerald-800 dark:text-emerald-300 text-xs font-semibold">
                🎉 Success! Thank you for subscribing to our journal.
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="relative flex items-center">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full bg-bg-base border border-border-base text-text-primary placeholder:text-text-secondary/50 text-sm px-4 py-3 rounded-[16px] focus:outline-none focus:border-accent-primary focus:ring-4 focus:ring-accent-primary/10 transition-all"
                />
                <button
                  type="submit"
                  className="absolute right-2 p-2 bg-text-primary text-bg-base hover:bg-accent-primary hover:text-white rounded-[10px] transition-all cursor-pointer hover:scale-105 active:scale-95"
                  title="Subscribe"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>

        </div>

        {/* Bottom copyright & socials */}
        <div className="border-t border-border-base pt-8 mt-12 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs flex items-center gap-1">
            © {new Date().getFullYear()} Blogify Journal. Made with
            <Heart className="w-3 h-3 text-red-500 fill-red-500" />
            for readers everywhere.
          </p>

          <div className="flex items-center gap-4.5">
            <a href="https://github.com/Tiyas04/blogify" target="_blank" rel="noreferrer" className="hover:text-text-primary transition-colors" title="GitHub">
              <CodeXml className="w-4.5 h-4.5" />
            </a>
            <a href="https://linkedin.com/Tiyas04" target="_blank" rel="noreferrer" className="hover:text-text-primary transition-colors" title="LinkedIn">
              <User className="w-4.5 h-4.5" />
            </a>
            <a href="/rss.xml" className="hover:text-text-primary transition-colors" title="RSS Feed">
              <Rss className="w-4.5 h-4.5" />
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
