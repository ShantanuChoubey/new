import { motion } from "framer-motion";
import {
  Users, TrendingUp, ShoppingCart, DollarSign,
  Activity, Bell, Settings
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Button from "../components/ui/Button";
import { formatDate } from "../utils/formatDate";

const statCards = [
  { label: "Total Users",    value: "12,481", delta: "+12%", icon: Users,        color: "text-blue-600",    bg: "bg-blue-50"   },
  { label: "Revenue",        value: "$48,295", delta: "+8%", icon: DollarSign,   color: "text-emerald-600", bg: "bg-emerald-50"},
  { label: "Orders",         value: "3,240",  delta: "+5%", icon: ShoppingCart,  color: "text-violet-600",  bg: "bg-violet-50" },
  { label: "Growth Rate",    value: "18.4%",  delta: "+2%", icon: TrendingUp,    color: "text-orange-500",  bg: "bg-orange-50" },
];

const recentActivity = [
  { id: 1, event: "New user registered",    time: new Date(Date.now() - 1000 * 60 * 5) },
  { id: 2, event: "Order #1034 completed",  time: new Date(Date.now() - 1000 * 60 * 22) },
  { id: 3, event: "New comment on post #7", time: new Date(Date.now() - 1000 * 60 * 45) },
  { id: 4, event: "Password reset request", time: new Date(Date.now() - 1000 * 60 * 90) },
  { id: 5, event: "Deployment successful",  time: new Date(Date.now() - 1000 * 60 * 130) },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden:  { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="container-app py-10 space-y-8 animate-fade-in">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">
            Good day, {user?.name ?? "User"} 👋
          </h1>
          <p className="text-secondary-500 text-sm mt-1">
            {formatDate(new Date(), "EEEE, MMMM d, yyyy")}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" leftIcon={<Bell size={16} />}>
            Notifications
          </Button>
          <Button variant="outline" size="sm" leftIcon={<Settings size={16} />}>
            Settings
          </Button>
        </div>
      </div>

      {/* ── Stat cards ── */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6"
      >
        {statCards.map(({ label, value, delta, icon: Icon, color, bg }) => (
          <motion.div key={label} variants={itemVariants} className="card flex items-center gap-4">
            <div className={`rounded-xl p-3 ${bg} shrink-0`}>
              <Icon size={22} className={color} />
            </div>
            <div className="min-w-0">
              <p className="text-sm text-secondary-500 truncate">{label}</p>
              <p className="text-2xl font-bold text-secondary-900">{value}</p>
              <span className="text-xs text-emerald-600 font-medium">{delta} this month</span>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* ── Main content grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity feed */}
        <div className="lg:col-span-2 card space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-secondary-900 flex items-center gap-2">
              <Activity size={18} className="text-primary-600" />
              Recent Activity
            </h2>
            <Button variant="ghost" size="xs">View all</Button>
          </div>
          <ul className="space-y-4 divide-y divide-secondary-100">
            {recentActivity.map(({ id, event, time }) => (
              <li key={id} className="flex items-center justify-between pt-4 first:pt-0 first:border-none">
                <span className="text-sm text-secondary-700">{event}</span>
                <span className="text-xs text-secondary-400 whitespace-nowrap ml-4">
                  {formatDate(time, "h:mm a")}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Profile card */}
        <div className="card flex flex-col items-center text-center gap-5">
          <div className="h-20 w-20 rounded-full bg-primary-100 flex items-center justify-center text-3xl font-bold text-primary-600">
            {(user?.name ?? "U").charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-lg font-semibold text-secondary-900">{user?.name ?? "User"}</p>
            <p className="text-sm text-secondary-500 mt-0.5">{user?.email ?? "—"}</p>
            <span className="inline-block mt-2 text-xs font-medium text-primary-700 bg-primary-50 px-3 py-1 rounded-full">
              {user?.role ?? "Member"}
            </span>
          </div>
          <Button variant="outline" size="sm" fullWidth leftIcon={<Settings size={15} />}>
            Edit Profile
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
