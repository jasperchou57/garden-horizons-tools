export const metadata = {
  title: 'Privacy Policy | Garden Horizons Tools',
  description: 'Privacy Policy for Garden Horizons Tools',
};

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-3xl mx-auto space-y-6">
          <h1 className="text-3xl font-bold">Privacy Policy</h1>
          
          <div className="prose prose-invert max-w-none space-y-4 text-text-muted">
            <p>Last updated: February 2026</p>
            
            <h2 className="text-xl font-semibold text-foreground">1. Data Collection</h2>
            <p>
              Garden Horizons Tools does not collect, store, or transmit any personal information to external servers. 
              All data is stored locally on your device using browser localStorage.
            </p>

            <h2 className="text-xl-foreground">2. Local Storage font-semibold text</h2>
            <p>
              We store the following data locally on your device:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>Saved plans and calculations</li>
              <li>User progress and achievements</li>
              <li>UI preferences</li>
            </ul>

            <h2 className="text-xl font-semibold text-foreground">3. Third-Party Services</h2>
            <p>
              We do not share any data with third parties. This tool does not contain any analytics or tracking scripts.
            </p>

            <h2 className="text-xl font-semibold text-foreground">4. Cookies</h2>
            <p>
              We do not use cookies. All data is stored using localStorage which functions similarly but does not require cookie consent.
            </p>

            <h2 className="text-xl font-semibold text-foreground">5. Contact</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us through our GitHub repository.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
