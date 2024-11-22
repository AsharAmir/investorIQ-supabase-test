import { useState } from "react";
import {
  Menu,
  X,
  Home,
  Building2,
  Calendar,
  MessageCircle,
  LogOut,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { signOut, user } = useAuthStore();
  const navigate = useNavigate();

  const navigation = [
    { name: "Dashboard", href: "/", icon: Home },
    { name: "Marketplace", href: "/marketplace", icon: Building2 },
    { name: "Events", href: "/events", icon: Calendar },
    { name: "Community", href: "/community", icon: MessageCircle },
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  return (
    <nav className="bg-brand-navy shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Building2 className="h-8 w-8 text-brand-blue" />
              <span className="ml-2 text-xl font-bold text-white">
                Investor IQ
              </span>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium text-white hover:text-brand-blue transition-colors"
                >
                  <item.icon className="h-4 w-4 mr-2" />
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {user && (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-white">{user.name}</span>
                <button
                  onClick={handleSignOut}
                  className="p-2 rounded-full text-white hover:text-brand-blue transition-colors flex items-center"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-brand-blue hover:bg-brand-dark transition-colors"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="sm:hidden bg-brand-dark">
          <div className="pt-2 pb-3 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="flex items-center px-3 py-2 text-base font-medium text-white hover:text-brand-blue hover:bg-brand-navy/50 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <item.icon className="h-4 w-4 mr-2" />
                {item.name}
              </Link>
            ))}
            {user && (
              <button
                onClick={handleSignOut}
                className="flex items-center w-full px-3 py-2 text-base font-medium text-white hover:text-brand-blue hover:bg-brand-navy/50 transition-colors"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
