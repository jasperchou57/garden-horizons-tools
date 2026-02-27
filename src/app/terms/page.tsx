export const metadata = {
  title: 'Terms of Service | Garden Horizons Tools',
  description: 'Terms of Service for Garden Horizons Tools',
};

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-3xl mx-auto space-y-6">
          <h1 className="text-3xl font-bold">Terms of Service</h1>
          
          <div className="prose prose-invert max-w-none space-y-4 text-text-muted">
            <p>Last updated: February 2026</p>
            
            <h2 className="text-xl font-semibold text-foreground">1. Acceptance of Terms</h2>
            <p>
              By accessing and using Garden Horizons Tools, you accept and agree to be bound by the terms and provision of this agreement.
            </p>

            <h2 className="text-xl font-semibold text-foreground">2. Use License</h2>
            <p>
              Permission is granted to use this tool for personal, non-commercial use. This is the grant of a license, not a transfer of title.
            </p>

            <h2 className="text-xl font-semibold text-foreground">3. Disclaimer</h2>
            <p>
              This tool is provided "as is" without warranty of any kind. The game data is based on community submissions and may contain errors or inaccuracies.
            </p>

            <h2 className="text-xl font-semibold text-foreground">4. Limitation of Liability</h2>
            <p>
              In no event shall Garden Horizons Tools be liable for any damages arising out of the use or inability to use this tool.
            </p>

            <h2 className="text-xl font-semibold text-foreground">5. User Responsibility</h2>
            <p>
              Users are responsible for verifying all game data independently. This tool is intended as a helpful reference only.
            </p>

            <h2 className="text-xl font-semibold text-foreground">6. Modifications</h2>
            <p>
              We reserve the right to modify these terms at any time. Continued use of the tool constitutes acceptance of any modified terms.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
