
import { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Menu, X, LogOut } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Check if user is logged in
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      setIsLoggedIn(true);
      const userData = JSON.parse(user);
      setUsername(userData.name || userData.email.split('@')[0]);
    } else {
      setIsLoggedIn(false);
    }
  }, [location.pathname]);
  
  // Update scroll state
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);
  
  const handleLogout = () => {
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account"
    });
    
    navigate('/');
  };
  
  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Features', path: '/#features' },
    { name: 'Demo', path: '/#demo' },
    { name: 'Pricing', path: '/pricing' },
  ];
  
  // Add dashboard link if logged in
  if (isLoggedIn) {
    navLinks.push({ name: 'Dashboard', path: '/dashboard' });
  }
  
  const isActive = (path: string) => {
    if (path === '/') return location.pathname === path;
    return location.pathname.startsWith(path) || location.hash === path.substring(1);
  };
  
  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out px-6 md:px-8 py-4',
        isScrolled 
          ? 'backdrop-blur-xl bg-white/70 dark:bg-black/70 shadow-sm border-b border-gray-200/30 dark:border-gray-800/30' 
          : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link 
          to="/" 
          className="flex items-center space-x-2"
          aria-label="Quantum Mindforge"
        >
          <div className="relative w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center overflow-hidden group">
            <div className="absolute inset-0 bg-primary opacity-10 group-hover:opacity-20 transition-opacity"></div>
            <div className="relative z-10 w-5 h-5 border-2 border-primary rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse-soft"></div>
            </div>
            <div className="absolute w-16 h-16 bg-primary/30 rounded-full blur-xl animate-spin-slow"></div>
          </div>
          <span className="text-lg font-medium font-display tracking-tight">
            <span className="text-foreground">Quantum</span>
            <span className="text-primary font-semibold">Mindforge</span>
          </span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                'px-4 py-2 rounded-md text-sm font-medium transition-colors',
                isActive(link.path)
                  ? 'text-primary'
                  : 'text-foreground/70 hover:text-foreground hover:bg-gray-100/50 dark:hover:bg-gray-800/50'
              )}
            >
              {link.name}
            </Link>
          ))}
        </nav>
        
        {/* CTA Button or User Menu */}
        <div className="hidden md:flex items-center space-x-4">
          {isLoggedIn ? (
            <>
              <span className="text-sm">Hi, {username}</span>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut size={16} className="mr-2" />
                Log out
              </Button>
            </>
          ) : (
            <>
              <Link to="/signin">
                <Button variant="ghost">Sign in</Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-primary text-white hover:bg-primary/90 transition-all duration-300">
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>
        
        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden text-foreground p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
          aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      
      {/* Mobile Menu */}
      <div
        className={cn(
          'fixed inset-0 z-40 bg-white dark:bg-gray-900 pt-20 p-6 flex flex-col md:hidden transition-transform duration-300 ease-in-out',
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <nav className="flex flex-col space-y-4">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                'px-4 py-3 rounded-md text-base font-medium transition-colors',
                isActive(link.path)
                  ? 'text-primary bg-primary/10'
                  : 'text-foreground hover:bg-gray-100 dark:hover:bg-gray-800'
              )}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
        </nav>
        <div className="mt-6 space-y-3">
          {isLoggedIn ? (
            <Button className="w-full" variant="outline" onClick={handleLogout}>
              <LogOut size={18} className="mr-2" />
              Log out
            </Button>
          ) : (
            <>
              <Link to="/signin" className="block w-full">
                <Button variant="outline" className="w-full">Sign in</Button>
              </Link>
              <Link to="/signup" className="block w-full">
                <Button className="w-full bg-primary text-white hover:bg-primary/90">
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
