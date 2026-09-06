import './PricingSection.css'

const websitePackages = [
  {
    name: 'Starter Site',
    price: 'R2,000 - R3,500',
    detail:
      'A focused one-page site for a new offer, personal brand, or simple business presence.',
    points: ['Responsive design', 'Contact flow', 'Basic SEO setup'],
  },
  {
    name: 'Business Site',
    price: 'R4,500 - R8,500',
    detail:
      'A polished multi-section website built around credibility, services, and enquiries.',
    points: ['Up to 5 core pages', 'Copy refinement', 'Performance tuning'],
    featured: true,
  },
  {
    name: 'Custom Build',
    price: 'Quoted to scope',
    detail:
      'A tailored website or digital experience where pricing depends on the size, features, and timeline.',
    points: [
      '3D or motion system',
      'AI feature planning',
      'Custom integrations',
    ],
  },
]

const carePackages = [
  {
    name: 'Care Essential',
    price: 'R400 - R750 / month',
    detail: 'For keeping the site healthy after launch.',
    points: ['Monthly updates', 'Security checks', 'Small content edits'],
  },
  {
    name: 'Care Growth',
    price: 'R800 - R1,200 / month',
    detail: 'For active businesses that want ongoing improvements.',
    points: ['Priority edits', 'Analytics review', 'Conversion tweaks'],
  },
  {
    name: 'Care Studio',
    price: 'R1,500 - R2,500 / month',
    detail:
      'For brands that need regular design, content, and feature support.',
    points: [
      'Monthly improvement sprint',
      'Design updates',
      'AI and automation support',
    ],
  },
]

const aiIdeas = [
  'AI enquiry assistant',
  'Smart quote intake',
  'Content drafting tools',
  'Client onboarding flows',
]

export default function PricingSection() {
  return (
    <section className="section pricing depth-section" id="pricing">
      <div className="grid-bg" />
      <div className="pricing__inner">
        <div className="pricing__header">
          <span className="tag">Pricing & Care</span>
          <h2 className="display-lg">
            Clear starting points.
            <br />
            <span className="grad-cyan">Room to scale.</span>
          </h2>
          <p className="pricing__intro text-body">
            Every build is scoped properly before work starts, but these ranges
            give clients a practical idea of where a professional NXW website
            and monthly care plan can begin.
          </p>
        </div>

        <div className="pricing__content">
          <div className="pricing__panel">
            <div className="pricing__panel-head">
              <span className="text-mono">Website Builds</span>
              <span className="pricing__note">Once-off project pricing</span>
            </div>
            <div className="pricing__cards">
              {websitePackages.map((item) => (
                <article
                  className={`pricing-card glass-card ${
                    item.featured ? 'pricing-card--featured' : ''
                  }`}
                  key={item.name}
                >
                  <h3>{item.name}</h3>
                  <strong>{item.price}</strong>
                  <p>{item.detail}</p>
                  <ul>
                    {item.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>

          <div className="pricing__side">
            <div className="pricing__care glass-card">
              <div className="pricing__panel-head">
                <span className="text-mono">NexWeb Care</span>
                <span className="pricing__note">Monthly support</span>
              </div>
              <div className="pricing__care-list">
                {carePackages.map((item) => (
                  <article className="care-row" key={item.name}>
                    <div>
                      <h3>{item.name}</h3>
                      <p>{item.detail}</p>
                    </div>
                    <strong>{item.price}</strong>
                    <ul>
                      {item.points.map((point) => (
                        <li key={point}>{point}</li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>
            </div>

            <div className="pricing__ai glass-card">
              <span className="text-mono">AI Suggestions</span>
              <p>
                AI should make the website more useful, not just sound
                futuristic. These are the strongest starting features for NXW
                clients.
              </p>
              <div className="pricing__ai-tags">
                {aiIdeas.map((idea) => (
                  <span key={idea}>{idea}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <p className="pricing__fineprint text-mono">
          Final pricing depends on content, pages, animation, integrations, and
          turnaround time.
        </p>
      </div>
    </section>
  )
}
