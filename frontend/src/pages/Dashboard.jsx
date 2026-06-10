import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { User, Mail, ShieldCheck, Calendar, LogOut, RefreshCw } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getProfile } from "../services/authService";
import Button from "../components/ui/Button";
import Loader from "../components/ui/Loader";
import { formatDate } from "../utils/formatDate";

function Dashboard() {
  const { user, handleLogout } = useAuth();
  const [profile, setProfile]   = useState(null);
  const [loading, setLoading]   = useState(true);
  const [error,   setError]     = useState(null);

  const fetchProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProfile();
      setProfile(data?.data?.user ?? data);
    } catch (err) {
      setError(err?.response?.data?.message ?? "Failed to load profile.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const displayUser = profile ?? user;

  return (
    <div className="container-app py-10 space-y-8 animate-fade-in">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">
            Welcome, {displayUser?.name ?? "User"} 👋
          </h1>
          <p className="text-secondary-500 text-sm mt-1">
            {formatDate(new Date(), "EEEE, MMMM d, yyyy")}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchProfile}
            leftIcon={<RefreshCw size={15} />}
            isLoading={loading}
          >
            Refresh
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={handleLogout}
            leftIcon={<LogOut size={15} />}
          >
            Logout
          </Button>
        </div>
      </div>

      {/* ── Profile card ── */}
      {loading ? (
        <div className="flex justify-center py-16">
          <Loader size="lg" />
        </div>
      ) : error ? (
        <div className="card text-center py-10 space-y-3">
          <p className="text-red-500 font-medium">{error}</p>
          <Button variant="outline" size="sm" onClick={fetchProfile}>Try again</Button>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* Avatar + Name card */}
          <div className="card flex flex-col items-center text-center gap-5">
            <div className="h-24 w-24 rounded-full bg-primary-100 flex items-center justify-center text-4xl font-bold text-primary-600">
              {(displayUser?.name ?? "U").charAt(0).toUpperCase()}
            </div>
            <div className="space-y-1">
              <p className="text-xl font-semibold text-secondary-900">{displayUser?.name}</p>
              <p className="text-sm text-secondary-500">{displayUser?.email}</p>
              <span className={`inline-block mt-2 text-xs font-semibold px-3 py-1 rounded-full ${
                displayUser?.isEmailVerified
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-yellow-50 text-yellow-700"
              }`}>
                {displayUser?.isEmailVerified ? "✓ Email Verified" : "⚠ Not Verified"}
              </span>
            </div>
          </div>

          {/* Details card */}
          <div className="card space-y-5">
            <h2 className="text-base font-semibold text-secondary-900">Account Details</h2>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <User size={18} className="text-primary-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-secondary-400 uppercase tracking-wide">Full Name</p>
                  <p className="text-sm font-medium text-secondary-800">{displayUser?.name}</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail size={18} className="text-primary-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-secondary-400 uppercase tracking-wide">Email</p>
                  <p className="text-sm font-medium text-secondary-800">{displayUser?.email}</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <ShieldCheck size={18} className="text-primary-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-secondary-400 uppercase tracking-wide">Email Verified</p>
                  <p className="text-sm font-medium text-secondary-800">
                    {displayUser?.isEmailVerified ? "Yes" : "No"}
                  </p>
                </div>
              </li>
              {displayUser?.createdAt && (
                <li className="flex items-start gap-3">
                  <Calendar size={18} className="text-primary-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-secondary-400 uppercase tracking-wide">Member Since</p>
                    <p className="text-sm font-medium text-secondary-800">
                      {formatDate(displayUser.createdAt)}
                    </p>
                  </div>
                </li>
              )}
            </ul>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default Dashboard;
