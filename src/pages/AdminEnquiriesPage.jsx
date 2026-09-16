import React, { useState, useEffect } from 'react';
import adminService from '../services/adminService';
import Badge from '../components/common/Badge';
import { Mail, MessageSquare, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export const AdminEnquiriesPage = () => {
  const [contacts, setContacts] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const [contRes, subRes] = await Promise.all([
        adminService.getContacts(),
        adminService.getSubscribers(),
      ]);
      if (contRes.data?.contacts) setContacts(contRes.data.contacts);
      if (subRes.data?.subscribers) setSubscribers(subRes.data.subscribers);
    } catch (err) {
      toast.error('Failed to load communications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      await adminService.updateContactStatus(id, status);
      loadData();
    } catch (err) {
      toast.error('Failed to update inquiry status');
    }
  };

  return (
    <div className="space-y-10">
      {/* Contact Messages Section */}
      <div className="space-y-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-[#2A2923]">Customer Enquiries</h1>
          <p className="text-xs text-[#686558] mt-0.5">
            Bespoke commission requests, sizing queries, and studio notes.
          </p>
        </div>

        <div className="bg-white border border-[#DDCBA4]/60 rounded-sm shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAEDCD]/40 text-[#2A2923] uppercase font-semibold border-b border-[#DDCBA4]/50">
                <tr>
                  <th className="p-3">Sender Name</th>
                  <th className="p-3">Email & Phone</th>
                  <th className="p-3">Subject</th>
                  <th className="p-3">Message</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DDCBA4]/30 text-[#2A2923]">
                {contacts.map((c) => (
                  <tr key={c._id} className="hover:bg-[#FAEDCD]/20">
                    <td className="p-3 font-semibold text-[#2A2923]">{c.name}</td>
                    <td className="p-3">
                      <p>{c.email}</p>
                      <p className="text-[11px] text-[#686558]">{c.phone || '—'}</p>
                    </td>
                    <td className="p-3 font-medium text-[#D4A373]">{c.subject}</td>
                    <td className="p-3 max-w-sm truncate text-[#686558]">{c.message}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          c.status === 'Resolved'
                            ? 'bg-emerald-50 text-emerald-800'
                            : c.status === 'Read'
                            ? 'bg-blue-50 text-blue-800'
                            : 'bg-amber-50 text-amber-800'
                        }`}
                      >
                        {c.status}
                      </span>
                    </td>
                    <td className="p-3 text-right space-x-2">
                      {c.status !== 'Resolved' && (
                        <button
                          onClick={() => handleUpdateStatus(c._id, 'Resolved')}
                          className="text-xs text-emerald-700 font-semibold hover:underline"
                        >
                          Mark Resolved
                        </button>
                      )}
                      {c.status === 'New' && (
                        <button
                          onClick={() => handleUpdateStatus(c._id, 'Read')}
                          className="text-xs text-[#686558] font-semibold hover:underline"
                        >
                          Mark Read
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Newsletter Subscribers Section */}
      <div className="space-y-4">
        <div>
          <h2 className="font-serif text-xl font-bold text-[#2A2923]">Seasonal Subscribers</h2>
          <p className="text-xs text-[#686558] mt-0.5">
            Collectors subscribed to winter drops and atelier newsletter.
          </p>
        </div>

        <div className="bg-white border border-[#DDCBA4]/60 rounded-sm shadow-sm overflow-hidden max-w-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAEDCD]/40 text-[#2A2923] uppercase font-semibold border-b border-[#DDCBA4]/50">
                <tr>
                  <th className="p-3">Subscriber Email</th>
                  <th className="p-3">Joined Date</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DDCBA4]/30 text-[#2A2923]">
                {subscribers.map((s) => (
                  <tr key={s._id} className="hover:bg-[#FAEDCD]/20">
                    <td className="p-3 font-medium text-[#2A2923]">{s.email}</td>
                    <td className="p-3 text-[#686558]">
                      {new Date(s.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="p-3">
                      <span className="text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded font-semibold uppercase">
                        Subscribed
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminEnquiriesPage;
