import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  TrendingUp,
  ShoppingBag,
  Clock,
  CheckCircle2,
  XCircle,
  Users,
  Package,
  AlertTriangle,
  CreditCard,
  DollarSign,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { fetchDashboardStats } from '../redux/slices/adminSlice';
import { DataLoader } from '../components/common/Loader';
import Badge from '../components/common/Badge';

export const AdminDashboardPage = () => {
  const dispatch = useDispatch();
  const { stats, charts, recentOrders, loading } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  if (loading || !stats) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <DataLoader message="Loading atelier analytics & live statistics..." />
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Revenue',
      value: `₹${stats.totalRevenue.toLocaleString('en-IN')}`,
      icon: DollarSign,
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: ShoppingBag,
      color: 'bg-amber-50 text-amber-800 border-amber-200',
    },
    {
      title: 'Processing Orders',
      value: stats.processingOrders,
      icon: Clock,
      color: 'bg-blue-50 text-blue-800 border-blue-200',
    },
    {
      title: 'Delivered Orders',
      value: stats.deliveredOrders,
      icon: CheckCircle2,
      color: 'bg-teal-50 text-teal-800 border-teal-200',
    },
    {
      title: 'Cancelled Orders',
      value: stats.cancelledOrders,
      icon: XCircle,
      color: 'bg-red-50 text-red-700 border-red-200',
    },
    {
      title: 'Active Collectors',
      value: stats.totalUsers,
      icon: Users,
      color: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    },
    {
      title: 'Atelier Products',
      value: stats.totalProducts,
      icon: Package,
      color: 'bg-stone-50 text-stone-800 border-stone-200',
    },
    {
      title: 'Low Stock Alerts',
      value: stats.lowStockProducts,
      icon: AlertTriangle,
      color: 'bg-orange-50 text-orange-700 border-orange-200',
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-2xl md:text-3xl font-bold text-[#2A2923]">
          Atelier Performance & Analytics
        </h1>
        <p className="text-xs text-[#686558] mt-1">
          Real-time metrics, revenue curves, and inventory statuses from the database.
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className="p-5 bg-white border border-[#DDCBA4]/60 rounded-sm shadow-sm space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#686558] uppercase tracking-wider">
                  {card.title}
                </span>
                <div className={`p-2 rounded-sm border ${card.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <p className="font-serif text-2xl font-bold text-[#2A2923]">{card.value}</p>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sales & Revenue Trend Chart */}
        <div className="lg:col-span-8 p-6 bg-white border border-[#DDCBA4]/60 rounded-sm shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif text-base font-bold text-[#2A2923]">
                Monthly Revenue & Sales Velocity
              </h2>
              <p className="text-xs text-[#686558]">Sales revenue tracked in INR</p>
            </div>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={charts.salesChartData}>
                <defs>
                  <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D4A373" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#D4A373" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#686558" fontSize={11} />
                <YAxis stroke="#686558" fontSize={11} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="sales"
                  stroke="#D4A373"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#salesGrad)"
                  name="Revenue (₹)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Order Status Breakdown Pie */}
        <div className="lg:col-span-4 p-6 bg-white border border-[#DDCBA4]/60 rounded-sm shadow-sm space-y-4">
          <h2 className="font-serif text-base font-bold text-[#2A2923]">Orders Distribution</h2>
          <div className="h-56 w-full flex items-center justify-center">
            {charts.orderStatusBreakdown && charts.orderStatusBreakdown.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={charts.orderStatusBreakdown}
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {charts.orderStatusBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-xs text-[#686558]">No order status data available</p>
            )}
          </div>

          <div className="space-y-1 text-xs">
            {charts.orderStatusBreakdown.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-[#686558]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span>{item.name}</span>
                </div>
                <strong className="text-[#2A2923]">{item.value}</strong>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Category Distribution Bar Chart */}
      <div className="p-6 bg-white border border-[#DDCBA4]/60 rounded-sm shadow-sm space-y-4">
        <h2 className="font-serif text-base font-bold text-[#2A2923]">Product Category Catalog Distribution</h2>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={charts.categoryDistribution}>
              <XAxis dataKey="name" stroke="#686558" fontSize={11} />
              <YAxis stroke="#686558" fontSize={11} allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#CCD5AE" radius={[4, 4, 0, 0]} name="Products" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Orders Snapshot */}
      <div className="p-6 bg-white border border-[#DDCBA4]/60 rounded-sm shadow-sm space-y-4">
        <h2 className="font-serif text-base font-bold text-[#2A2923]">Recent Customer Orders</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAEDCD]/40 text-[#2A2923] uppercase tracking-wider font-semibold border-b border-[#DDCBA4]/50">
              <tr>
                <th className="p-3">Order Number</th>
                <th className="p-3">Collector</th>
                <th className="p-3">Status</th>
                <th className="p-3">Total Amount</th>
                <th className="p-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DDCBA4]/30 text-[#2A2923]">
              {recentOrders.map((ord) => (
                <tr key={ord._id} className="hover:bg-[#FAEDCD]/20">
                  <td className="p-3 font-mono font-medium">{ord.orderNumber}</td>
                  <td className="p-3">{ord.user?.name || ord.shippingAddress?.fullName}</td>
                  <td className="p-3">
                    <Badge variant={ord.orderStatus}>{ord.orderStatus}</Badge>
                  </td>
                  <td className="p-3 font-semibold text-[#D4A373]">
                    ₹{ord.total.toLocaleString('en-IN')}
                  </td>
                  <td className="p-3 text-[#686558]">
                    {new Date(ord.createdAt).toLocaleDateString('en-IN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
