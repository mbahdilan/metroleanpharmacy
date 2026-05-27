import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Guides & Strains - Metrolean Market',
  description: 'Expert stash guides, strain reviews, and underground tips from Metrolean Market.',
};

export default function GuidesPage() {
  const topics = [
    { title: 'Top-Shelf Syrups', desc: 'A connoisseur’s guide to our premium syrups.' },
    { title: 'Exotic Strains', desc: 'Understanding the finest botanical selections in the stash.' },
    { title: 'Psychedelic Protocols', desc: 'Safe journeys and microdosing guides for beginners.' },
    { title: 'Pain & Relaxation', desc: 'The most potent relaxatives for a heavy chill.' },
    { title: 'Discreet Delivery', desc: 'How our stealth packaging works across our global hubs.' },
    { title: 'Underground Culture', desc: 'The latest drops, trends, and market news.' },
  ];

  return (
    <div style={{ padding: '8rem 2rem 4rem', maxWidth: '1200px', margin: '0 auto', minHeight: '80vh' }}>
      <header style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h1 style={{ fontSize: '3rem', color: 'var(--accent)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '2px' }}>Guides & Strains</h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
          Exclusive insights from the syndicate. Elevate your stash with expert knowledge.
        </p>
      </header>

      <section style={{ marginBottom: '5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
          {topics.map(topic => (
            <div key={topic.title} style={{ padding: '2rem', background: 'var(--bg-card)', borderRadius: '16px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-md)', cursor: 'pointer', transition: 'all 0.3s ease' }}>
              <h2 style={{ fontSize: '1.25rem', color: 'var(--accent)', marginBottom: '0.5rem', fontWeight: 'bold' }}>{topic.title}</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: 1.6 }}>{topic.desc}</p>
              <span style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.9rem', borderBottom: '1px solid var(--accent)', paddingBottom: '2px' }}>Read Dossier &rarr;</span>
            </div>
          ))}
        </div>
      </section>

      <section className="section-radiant" style={{ padding: '4rem', borderRadius: '24px', textAlign: 'center', border: '1px solid var(--border)' }}>
        <h2 style={{ fontSize: '2rem', color: 'white', marginBottom: '1rem' }}>Need personalized recommendations?</h2>
        <p style={{ fontSize: '1.1rem', color: 'white', marginBottom: '2rem', opacity: 0.9 }}>Speak to one of our underground brokers today.</p>
        <button className="btn-primary" style={{ border: 'none', cursor: 'pointer' }}>Contact Syndicate</button>
      </section>
    </div>
  );
}
