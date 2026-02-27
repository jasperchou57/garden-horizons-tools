export const metadata = {
  title: 'Support | Garden Horizons Tools',
  description: 'Get support for Garden Horizons Tools',
};

export default function Support() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-3xl mx-auto space-y-6">
          <h1 className="text-3xl font-bold">Support</h1>
          
          <div className="prose prose-invert max-w-none space-y-4 text-text-muted">
            <p>Need help? Here are some ways to get support.</p>
            
            <h2 className="text-xl font-semibold text-foreground">1. Frequently Asked Questions</h2>
            <p>
              Check our <a href="/faq" className="text-accent-green hover:underline">FAQ page</a> for answers to common questions.
            </p>

            <h2 className="text-xl font-semibold text-foreground">2. Report Issues</h2>
            <p>
              If you find any bugs or inaccuracies in the game data, please report them through our GitHub repository.
            </p>

            <h2 className="text-xl font-semibold text-foreground">3. Data Corrections</h2>
            <p>
              If you believe any plant or mutation data is incorrect, please submit a correction through GitHub Issues. 
              Include your evidence and source of information.
            </p>

            <h2 className="text-xl font-semibold text-foreground">4. Feature Requests</h2>
            <p>
              Have an idea for a new feature? We'd love to hear it! Submit your suggestions through GitHub Issues.
            </p>

            <h2 className="text-xl font-semibold text-foreground">5. Contact</h2>
            <p>
              For other inquiries, you can reach us through:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>GitHub Issues: Report bugs and feature requests</li>
              <li>GitHub Discussions: General questions and community discussion</li>
            </ul>

            <div className="bg-surface border border-border rounded-xl p-4 mt-6">
              <h3 className="text-lg font-semibold text-foreground mb-2">Quick Links</h3>
              <div className="flex flex-wrap gap-3 mt-4">
                <a 
                  href="/faq" 
                  className="px-4 py-2 bg-accent-green/20 text-accent-green rounded-lg hover:bg-accent-green/30 transition-colors"
                >
                  FAQ
                </a>
                <a 
                  href="https://github.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-accent-blue/20 text-accent-blue rounded-lg hover:bg-accent-blue/30 transition-colors"
                >
                  GitHub
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
