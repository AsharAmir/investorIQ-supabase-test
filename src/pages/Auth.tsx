import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, Lock, Mail, User } from "lucide-react";
import { motion } from "framer-motion";
import { useAuthStore } from "../store/authStore";
import toast from "react-hot-toast";

// Admin credentials for demo
const ADMIN_EMAIL = "admin@investoriq.com";
const ADMIN_PASSWORD = "admin123";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const { signIn, signUp } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      if (isLogin) {
        await signIn(email, password);
        // Navigation will be handled based on user role after sign in
        if (email.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
          navigate("/admin");
        } else {
          navigate("/");
        }
      } else {
        await signUp(email, password, name);
        navigate("/");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "An error occurred";
      setError(message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-navy/5 via-brand-light/10 to-brand-navy/5 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sm:mx-auto sm:w-full sm:max-w-md"
      >
        <motion.div
          className="flex justify-center"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Building2 className="h-12 w-12 text-brand-navy" />
        </motion.div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-brand-navy">
          {isLogin ? "Sign in to your account" : "Create a new account"}
        </h2>
        {isLogin && (
          <p className="mt-2 text-center text-sm text-brand-navy/70">
            Admin? Use admin@investoriq.com / admin123
          </p>
        )}
      </motion.div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white py-8 px-4 shadow-xl sm:rounded-2xl sm:px-10"
        >
          <form className="space-y-6" onSubmit={handleSubmit}>
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-brand-navy">
                  Name
                </label>
                <div className="mt-1 relative">
                  <input
                    type="text"
                    required
                    className="appearance-none block w-full px-4 py-3 pl-12 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue transition-all"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <User className="h-5 w-5 text-gray-400 absolute left-4 top-3.5" />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-brand-navy">
                Email address
              </label>
              <div className="mt-1 relative">
                <input
                  type="email"
                  required
                  className="appearance-none block w-full px-4 py-3 pl-12 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Mail className="h-5 w-5 text-gray-400 absolute left-4 top-3.5" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-navy">
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  type="password"
                  required
                  className="appearance-none block w-full px-4 py-3 pl-12 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Lock className="h-5 w-5 text-gray-400 absolute left-4 top-3.5" />
              </div>
            </div>

            {error && (
              <div className="text-red-600 text-sm bg-red-50 p-4 rounded-xl">
                {error}
              </div>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg text-sm font-medium text-white bg-brand-navy hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue transition-all"
            >
              {isLogin ? "Sign in" : "Sign up"}
            </motion.button>
          </form>

          <div className="mt-6">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="w-full text-center text-sm text-brand-blue hover:text-brand-navy transition-colors"
            >
              {isLogin
                ? "Need an account? Sign up"
                : "Already have an account? Sign in"}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
