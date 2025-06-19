import React from 'react';

const Wallet = () => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-2xl shadow-lg">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Wallet</h1>
        <div className="bg-blue-50 rounded-xl p-6 text-center">
          <p className="text-gray-600 mb-2">Available Balance</p>
          <p className="text-3xl font-bold text-gray-800">₹5,420.00</p>
          <div className="grid grid-cols-2 gap-4 mt-6">
            <button className="bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors">
              Add Money
            </button>
            <button className="bg-white border-2 border-blue-600 text-blue-600 py-3 px-4 rounded-lg font-medium hover:bg-blue-50 transition-colors">
              Withdraw
            </button>
          </div>
        </div>
        <div className="mt-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Recent Transactions</h2>
          <div className="space-y-3">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-medium text-gray-800">Deposit</div>
                    <div className="text-sm text-gray-500">Today, 10:30 AM</div>
                  </div>
                </div>
                <div className="font-semibold text-green-600">+₹1,000</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wallet;
