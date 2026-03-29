import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us - Metrolean Pharmacy',
  description: 'Learn about our journey, mission, and the team behind Metrolean Pharmacy.',
};

export default function AboutPage() {
  const team = [
    { name: 'Brenard Wilson', role: 'Pharmacist', description: 'Checks drug interactions and advises patients on medication safety.', image: '/images/about/bernard.jpg' },
    { name: 'Aime Madalia', role: 'Druggist', description: 'Expert in over-the-counter medications and local patient care.', image: '/images/about/aime.jpg' },
    { name: 'Zack Gavel', role: 'Pharmacy Technician', description: 'Assists with prescriptions and ensures clinical accuracy.', image: '/images/about/zack.jpg' },
    { name: 'Cleff Moore', role: 'Stock Manager', description: 'Maintains drug availability and manages inventory logistics.', image: '/images/about/cleff.jpg' },
  ];

  const values = [
    { title: 'Timely Delivery', description: 'We ensure our products reach you exactly when you need them.' },
    { title: 'Customer Satisfaction', description: 'Your relief and happiness are our biggest driving force.' },
    { title: 'Serving Humanity', description: 'Giving back to the world in our own meaningful way.' },
    { title: 'Innovation', description: 'Embracing new solutions for better healthcare access.' },
  ];

  const timeline = [
    { year: '2004', event: 'Founded Metrolean Pharmacy in a small Texas town to provide accessible medication.' },
    { year: '2012', event: 'Officially approved to fulfill doctor-prescribed medications.' },
    { year: '2015', event: 'Expanded internationally, shipping the first 100 boxes of medicine from America to Europe.' },
    { year: 'Future', event: 'Aiming to establish new branches, starting with Dortmund, Germany.' },
  ];

  return (
    <div className="about-page" style={{ paddingBottom: '5rem' }}>
      {/* Hero Section */}
      <section style={{ height: '60vh', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', background: '#004a99' }}>
        <img src="/images/about/hero.png" alt="Pharmacy Hero" style={{ position: 'absolute', width: '100%', height: '100%', objectFit: 'cover', opacity: 0.4 }} />
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', color: 'white', padding: '0 1rem' }}>
          <h1 style={{ fontSize: 'clamp(2.5rem, 8vw, 4rem)', fontWeight: 900, marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '2px' }}>About Us</h1>
          <p style={{ fontSize: '1.2rem', maxWidth: '800px', margin: '0 auto', fontWeight: 500, opacity: 0.9 }}>
            Providing High-Quality Products And Excellent Services Since 2004
          </p>
        </div>
      </section>

      {/* Who We Are */}
      <section style={{ maxWidth: '1200px', margin: '5rem auto', padding: '0 2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'center' }}>
          <div style={{ borderRadius: '24px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
            <img src="/images/about/story.jpg" alt="Our Story" style={{ width: '100%', height: 'auto', display: 'block' }} />
          </div>
          <div>
            <span style={{ color: 'var(--primary)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.9rem' }}>Who We Are</span>
            <h2 style={{ fontSize: '2.5rem', color: 'var(--primary-dark)', margin: '1rem 0' }}>Our Journey Started with a Purpose</h2>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '1.5rem' }}>
              Founded in 2004 in a small Texas town, Metrolean Pharmacy began with a simple observation: people shouldn't have to travel far just to get basic relief for a headache or essential medicines.
            </p>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: 1.8 }}>
              Our early years were a challenge, but our commitment to patient care led to full clinical approval by 2012. Today, we specialize in bulk and retail shipments, bridging the gap between American healthcare supplies and patients across Europe and beyond.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section style={{ background: 'var(--bg-light)', padding: '6rem 2rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          <div style={{ background: 'white', padding: '3rem', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', borderLeft: '8px solid var(--primary)' }}>
            <h3 style={{ fontSize: '1.8rem', color: 'var(--primary)', marginBottom: '1.5rem' }}>Our Mission</h3>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Seeing that our customers get their medications on time and in the right quantity, providing comfort and relief through accessible healthcare solutions.
            </p>
          </div>
          <div style={{ background: 'white', padding: '3rem', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', borderLeft: '8px solid var(--accent)' }}>
            <h3 style={{ fontSize: '1.8rem', color: 'var(--accent)', marginBottom: '1.5rem' }}>Our Vision</h3>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              To expand our reach to three more physical branches worldwide, with our next home planned in Dortmund, Germany—sharing our love for health and humanity globally.
            </p>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section style={{ maxWidth: '1200px', margin: '6rem auto', padding: '0 2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '2.5rem', color: 'var(--primary-dark)' }}>Our Core Values</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
          {values.map((v, i) => (
            <div key={i} style={{ padding: '2rem', textAlign: 'center', borderRadius: '16px', border: '1px solid var(--border)', transition: 'transform 0.3s ease' }}>
              <h4 style={{ fontSize: '1.25rem', color: 'var(--primary)', marginBottom: '0.8rem' }}>{v.title}</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>{v.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* History Timeline */}
      <section style={{ background: 'var(--primary-dark)', color: 'white', padding: '6rem 2rem' }}>
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
          <h2 style={{ fontSize: '2.5rem', color: 'var(--primary-dark)' }}>Meet Our Team</h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '1rem' }}>Dedicated professionals working for your health.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '3rem' }}>
          {team.map((member, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{ borderRadius: '50%', overflow: 'hidden', width: '180px', height: '180px', margin: '0 auto 1.5rem', border: '4px solid var(--bg-light)' }}>
                <img src={member.image} alt={member.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <h4 style={{ fontSize: '1.2rem', fontWeight: 800 }}>{member.name}</h4>
              <p style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.5rem' }}>{member.role}</p>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', padding: '0 1rem' }}>{member.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
