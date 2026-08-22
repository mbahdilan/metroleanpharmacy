import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us - Metrolean-Pharma Health Tips',
  description: 'Learn about our mission and the team behind Metrolean-Pharma Health Tips.',
};

export default function AboutPage() {
  const team = [
    { name: 'Brenard Wilson', role: 'Pharmacist', description: 'Reviews product interactions and advises customers on safe use.', image: '/images/about/bernard.jpg' },
    { name: 'Aime Madalia', role: 'Customer Care Specialist', description: 'Expert in product inventory and customer support.', image: '/images/about/aime.jpg' },
    { name: 'Zack Gavel', role: 'Pharmacy Technician', description: 'Assists with orders and ensures accuracy across every shipment.', image: '/images/about/zack.jpg' },
    { name: 'Cleff Moore', role: 'Stock Manager', description: 'Maintains product availability and manages inventory logistics.', image: '/images/about/cleff.jpg' },
  ];

  const values = [
    { title: 'Timely Delivery', description: 'We ensure our products reach you exactly when you need them.' },
    { title: 'Customer Satisfaction', description: 'Your health and happiness are our biggest driving force.' },
    { title: 'Evidence-Based', description: 'Our guides are written to be clear, accurate, and easy to act on.' },
    { title: 'Accessibility', description: 'Making everyday health information and essentials easier to reach.' },
  ];

  const timeline = [
    { year: '2004', event: 'Founded in a small Texas town to make everyday health essentials more accessible.' },
    { year: '2012', event: 'Grew into a trusted local pharmacy resource for the community.' },
    { year: '2015', event: 'Launched our online shop to reach customers beyond our local area.' },
    { year: '2024', event: 'Began publishing evidence-based medication guides to help customers make informed decisions.' },
    { year: '2025', event: 'Expanded our product catalog and health-guide library.' },
    { year: 'Future', event: 'Continuing our mission to make health information and everyday essentials more accessible for everyone.' },
  ];

  return (
    <div className="about-page" style={{ paddingBottom: '5rem' }}>
      {/* Hero Section */}
      <section style={{ minHeight: '40vh', height: 'auto', padding: '160px 0 60px', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', background: 'var(--primary)' }}>
        <img src="/images/about/hero.png" alt="Market Hero" style={{ position: 'absolute', width: '100%', height: '100%', objectFit: 'cover', opacity: 0.4 }} />
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', color: 'white', padding: '0 1rem', maxWidth: '800px' }}>
          <h1 style={{ fontSize: 'clamp(2.2rem, 8vw, 4rem)', fontWeight: 900, marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '2px', lineHeight: 1.2, color: 'white' }}>About Us</h1>
          <p style={{ fontSize: 'clamp(1rem, 3vw, 1.2rem)', margin: '0 auto', fontWeight: 500, opacity: 0.9 }}>
            Providing High-Quality Products And Excellent Services Since 2004
          </p>
        </div>
      </section>

      {/* Who We Are */}
      <section style={{ maxWidth: '1200px', margin: '5rem auto', padding: '0 2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'center' }}>
          <div style={{ borderRadius: '24px', overflow: 'hidden', boxShadow: 'var(--shadow-lg)' }}>
            <img src="/images/about/story.jpg" alt="Our Story" style={{ width: '100%', height: 'auto', display: 'block' }} />
          </div>
          <div>
            <span style={{ color: 'var(--accent)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.9rem' }}>Who We Are</span>
            <h2 style={{ fontSize: '2.5rem', color: 'var(--accent)', margin: '1rem 0' }}>Our Journey Started with a Purpose</h2>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '1.5rem' }}>
              Founded in 2004 in a small Texas town, Metrolean-Pharma began with a simple observation: people shouldn&apos;t have to travel far, or wade through confusing information, to get everyday relief for a headache, cold, or allergy flare-up.
            </p>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: 1.8 }}>
              Today we combine a trusted online pharmacy shop with plain-English, evidence-based health guides, so you can shop for what you need and understand what you&apos;re taking.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section-radiant" style={{ padding: '6rem 2rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          <div style={{ background: 'var(--bg-card)', padding: '3rem', borderRadius: '24px', boxShadow: 'var(--shadow-md)', borderLeft: '8px solid var(--accent)' }}>
            <h3 style={{ fontSize: '1.8rem', color: 'var(--accent)', marginBottom: '1.5rem' }}>Our Mission</h3>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Making sure our customers get accurate health information and their orders on time, so everyday relief is never out of reach.
            </p>
          </div>
          <div style={{ background: 'var(--bg-card)', padding: '3rem', borderRadius: '24px', boxShadow: 'var(--shadow-md)', borderLeft: '8px solid var(--accent)' }}>
            <h3 style={{ fontSize: '1.8rem', color: 'var(--accent)', marginBottom: '1.5rem' }}>Our Vision</h3>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              To be the health resource customers trust first — combining honest, evidence-based guidance with a reliable everyday pharmacy shop.
            </p>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section style={{ maxWidth: '1200px', margin: '6rem auto', padding: '0 2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '2.5rem', color: 'var(--accent)' }}>Our Core Values</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
          {values.map((v, i) => (
            <div key={i} style={{ padding: '2rem', textAlign: 'center', borderRadius: '16px', border: '1px solid var(--border)', transition: 'transform 0.3s ease', background: 'var(--bg-card)' }}>
              <h4 style={{ fontSize: '1.25rem', color: 'var(--accent)', marginBottom: '0.8rem' }}>{v.title}</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>{v.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* History Timeline */}
      <section className="section-radiant" style={{ color: 'white', padding: '6rem 2rem', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.5rem', textAlign: 'center', marginBottom: '4rem' }}>Our History</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', position: 'relative' }}>
            {timeline.map((t, i) => (
              <div key={i} style={{ flex: '1 1 200px', margin: '1rem', position: 'relative', paddingLeft: '1.5rem', borderLeft: '2px solid rgba(255,255,255,0.3)' }}>
                <span style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--accent)', display: 'block' }}>{t.year}</span>
                <p style={{ marginTop: '0.5rem', opacity: 0.9 }}>{t.event}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section style={{ maxWidth: '1200px', margin: '6rem auto', padding: '0 2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '2.5rem', color: 'var(--accent)' }}>Meet Our Team</h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '1rem' }}>Dedicated professionals working for your satisfaction.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '3rem' }}>
          {team.map((member, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{ borderRadius: '50%', overflow: 'hidden', width: '180px', height: '180px', margin: '0 auto 1.5rem', border: '4px solid var(--bg-card-hover)' }}>
                <img src={member.image} alt={member.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <h4 style={{ fontSize: '1.2rem', fontWeight: 800 }}>{member.name}</h4>
              <p style={{ color: 'var(--accent)', fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.5rem' }}>{member.role}</p>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', padding: '0 1rem' }}>{member.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
