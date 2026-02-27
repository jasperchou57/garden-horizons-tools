export const metadata = {
  title: 'Disclaimer | Garden Horizons Tools',
  description: 'Disclaimer for Garden Horizons Tools',
};

export default function Disclaimer() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-3xl mx-auto space-y-6">
          <h1 className="text-3xl font-bold">Disclaimer</h1>
          
          <div className="prose prose-invert max-w-none space-y-4 text-text-muted">
            <p>Last updated: February 2026</p>
            
            <h2 className="text-xl font-semibold text-foreground">1. Unofficial Tool</h2>
            <p>
              Garden Horizons Tools is an unofficial, community-made tool and is not affiliated with, endorsed by, or connected to Garden Horizons, Roblox Corporation, or any of their affiliates.
            </p>

            <h2 className="text-xl font-semibold text-foreground">2. Data Accuracy</h2>
            <p>
              All game data, including plant values, mutation multipliers, and grow times, are based on community submissions and manual testing. We cannot guarantee the accuracy or completeness of this data.
            </p>

            <h2 className="text-xl font-semibold text-foreground">3. No Warranty</h2>
            <p>
              This tool is provided "as is" without any warranties, express or implied. We do not warrant that the tool will be error-free or continuously available.
            </p>

            <h2 className="text-xl font-semibold text-foreground">4. Financial Responsibility</h2>
            <p>
              Any calculations or recommendations provided by this tool are for informational purposes only. We are not responsible for any in-game financial losses or decisions made based on this tool's data.
            </p>

            <h2 className="text-xl font-semibold text-foreground">5. User Discretion</h2>
            <p>
              Users should verify all information independently before making in-game decisions. Game mechanics may change without notice.
            </p>

            <h2 className="text-xl font-semibold text-foreground">6. External Links</h2>
            <p>
              This tool may contain links to external websites. We are not responsible for the content or privacy practices of these third-party sites.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
