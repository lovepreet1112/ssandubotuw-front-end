import React, { useState, useEffect } from 'react';
import adminService from '../services/adminService';
import Badge from '../components/common/Badge';
import { TableLoader, TableEmpty } from '../components/common/Loader';
import { CreditCard, RefreshCw } from 'lucide-react';
import Button from '../components/common/Button';
import toast from 'react-hot-toast';

export const AdminPaymentsPage = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadPayments = async () => {
    try {
      setLoading(true);
      const res = await adminService.getAllPayments();
      if (res.data?.payments) setPayments(res.data.payments);
    } catch (err) {
      toast.error('Failed to load payments audit log');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPayments();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-[#2A2923]">Payment Transaction Ledger</h1>
          <p className="text-xs text-[#686558] mt-0.5">
            Immutable audit record of verified Razorpay and sandbox transactions.
          </p>
        </div>

        <Button variant="outline" size="sm" icon={RefreshCw} onClick={loadPayments}>
          Refresh Ledger
        </Button>
      </div>

      <div className="bg-white border border-[#DDCBA4]/60 rounded-sm shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAEDCD]/40 text-[#2A2923] uppercase font-semibold border-b border-[#DDCBA4]/50">
              <tr>
                <th className="p-3">Payment ID</th>
                <th className="p-3">Order Number</th>
                <th className="p-3">Collector Name</th>
                <th className="p-3">Amount (₹)</th>
                <th className="p-3">Gateway Method</th>
                <th className="p-3">Status</th>
                <th className="p-3">Transaction Date & Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DDCBA4]/30 text-[#2A2923]">
              {loading ? (
                <TableLoader colSpan={7} message="Loading payment transactions..." />
              ) : payments.length === 0 ? (
                <TableEmpty colSpan={7} message="No payment transactions recorded" />
              ) : (
                payments.map((pay) => (
                  <tr key={pay._id} className="hover:bg-[#FAEDCD]/20">
                    <td className="p-3 font-mono font-medium text-[#2A2923]">{pay.paymentId}</td>
                    <td className="p-3 font-mono text-[#686558]">
                      {pay.orderId?.orderNumber || 'Direct Order'}
                    </td>
                    <td className="p-3 font-semibold">{pay.userId?.name || 'Customer'}</td>
                    <td className="p-3 font-bold text-[#D4A373]">
                      ₹{pay.amount.toLocaleString('en-IN')}
                    </td>
                    <td className="p-3 uppercase">{pay.paymentMethod}</td>
                    <td className="p-3">
                      <Badge variant={pay.paymentStatus}>{pay.paymentStatus}</Badge>
                    </td>
                    <td className="p-3 text-[#686558]">
                      {pay.paymentDate} • {pay.paymentTime}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPaymentsPage;
