'use client';

import React, { useEffect, useState } from 'react';
import { Award } from 'lucide-react';

export default function LoyaltyCustomers() {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    // Read the mock users from localStorage
    const usersStr = localStorage.getItem('elara_users_db');
    if (usersStr) {
      const parsedUsers = JSON.parse(usersStr);
      // Sort so users with highest points are at the top
      parsedUsers.sort((a: any, b: any) => (b.points || 0) - (a.points || 0));
      setUsers(parsedUsers);
    }
  }, []);

  if (users.length === 0) return null;

  return (
    <div className="mt-12">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-500" />
          Registered Users & Loyalty Points
        </h2>
        <p className="text-sm text-gray-500 mt-1">Users with 1000+ points can redeem them for a discount.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-600 font-medium">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Points Balance</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((user: any) => {
                const points = user.points || 0;
                const isEligible = points >= 1000;
                
                return (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-gray-900 font-medium">
                      {user.firstName} {user.lastName}
                    </td>
                    <td className="px-6 py-4 text-gray-500">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className={`font-bold ${isEligible ? 'text-green-600' : 'text-gray-900'}`}>
                        {points}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {isEligible ? (
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-bold">
                          Eligible for ₹1000 Off
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          Collecting...
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
