'use client';

import { useState, useEffect } from 'react';

export default function CookieSettings() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const cookieChoice = localStorage.getItem('garden_cookie_choice');
    if (!cookieChoice) {
      setShowBanner(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('garden_cookie_choice', 'accepted');
    setShowBanner(false);
  };

  const rejectCookies = () => {
    localStorage.setItem('garden_cookie_choice', 'rejected');
    setShowBanner(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-3xl mx-auto space-y-6">
          <h1 className="text-3xl font-bold">Cookie Settings</h1>
          
          <div className="prose prose-invert max-w-none space-y-4 text-text-muted">
            <p>Last updated: February 2026</p>
            
            <h2 className="text-xl font-semibold text-foreground">1. Our Cookie Policy</h2>
            <p>
              Garden Horizons Tools does not use cookies. All data is stored locally on your device using localStorage, 
              which functions similarly to cookies but does not require consent.
            </p>

            <h2 className="text-xl font-semibold text-foreground">2. Local Storage</h2>
            <p>
              We use localStorage to save your:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>Saved plans and calculations</li>
              <li>User progress and achievements</li>
              <li>UI preferences</li>
            </ul>

            <h2 className="text-xl font-semibold text-foreground">3. Managing Your Data</h2>
            <p>
              You can clear all locally stored data at any time by:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>Clearing your browser cache and local storage</li>
              <li>Using the "Clear All Data" button in the My Plans section</li>
            </ul>

            <h2 className="text-xl font-semibold text-foreground">4. Your Choice</h2>
            <p>
              Since we do not use cookies, no consent is required. However, if you would like to clear your local data, 
              you can do so at any time.
            </p>

            <div className="bg-surface border border-border rounded-xl p-4 mt-6">
              <h3 className="text-lg font-semibold text-foreground mb-2">Current Status</h3>
              <p>
                {showBanner 
                  ? "You haven't made a choice yet." 
                  : "Your data is stored locally on your device."
                }
              </p>
              {!showBanner && (
                <button
                  onClick={() => {
                    localStorage.removeItem('garden_horizons_plans');
                    localStorage.removeItem('garden_horizons_progress');
                    localStorage.removeItem('garden_cookie_choice');
                    alert('All local data has been cleared.');
                  }}
                  className="mt-4 px-4 py-2 bg-accent-rose/20 text-accent-rose rounded-lg hover:bg-accent-rose/30 transition-colors"
                >
                  Clear All Local Data
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
