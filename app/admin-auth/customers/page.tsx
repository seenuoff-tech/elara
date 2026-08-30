import React from 'react';
import { prisma } from '@/lib/prisma';
import { Users } from 'lucide-react';
import LoyaltyCustomers from '@/components/admin/LoyaltyCustomers';

export const dynamic = 'force-dynamic';

export default async function CustomersPage() {
  const subscribers = await prisma.newsletterSubscriber.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="w-6 h-6 text-[#0B5E64]" />
            Customers & Subscribers
          </h1>
          <p className="text-sm text-gray-500 mt-1">View your newsletter subscribers.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {subscribers.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No subscribers found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-600 font-medium">
                <tr>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Subscribed Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {subscribers.map((sub: any) => (
                  <tr key={sub.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-gray-900 font-medium">{sub.email}</td>
                    <td className="px-6 py-4 text-gray-500">
                      {new Date(sub.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <LoyaltyCustomers />
    </div>
  );
}
