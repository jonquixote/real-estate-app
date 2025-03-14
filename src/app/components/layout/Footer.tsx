import React from 'react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Real Estate Investment Analyzer</h3>
            <p className="text-gray-300">
              Find profitable rental properties using investment metrics and cash flow analysis.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/search" className="text-gray-300 hover:text-white">
                  Property Search
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-gray-300 hover:text-white">
                  Investment Dashboard
                </Link>
              </li>
              <li>
                <Link href="/calculator" className="text-gray-300 hover:text-white">
                  Cash Flow Calculator
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Investment Metrics</h3>
            <ul className="space-y-2">
              <li className="text-gray-300">Rent 1% Rule</li>
              <li className="text-gray-300">Sqft 1% Rule</li>
              <li className="text-gray-300">Cash-on-Cash Return</li>
              <li className="text-gray-300">Cap Rate</li>
              <li className="text-gray-300">Internal Rate of Return</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Real Estate Investment Analyzer. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
