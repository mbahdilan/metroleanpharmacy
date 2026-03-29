import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Health & Advice - +Pharmacy',
  description: 'Expert medical advice, health tips, and online consultation options from +Pharmacy.',
};

export default function HealthAdvicePage() {
  const topics = [
    { title: 'Cold & Flu Symptoms', desc: 'How to manage winter bugs effectively.' },
    { title: 'Vitamins & Strains', desc: 'Boost your daily defenses with botanical solutions.' },
    { title: 'Skin Conditions', desc: 'Treatments for eczema, psoriasis, and acne.' },
    { title: 'Pain Management', desc: 'Understanding analgesics and anti-inflammatories.' },
    { title: 'Cannabis Care', desc: 'Discover the clinical benefits of medical strains.' },
    { title: 'Relaxatives & Comfort', desc: 'Digestive health tips and relaxing solutions.' },
  ];

  return (
    <div style={{ padding: '8rem 2rem 4rem', maxWidth: '1200px', margin: '0 auto', minHeight: '80vh' }}>
      <header style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h1 style={{ fontSize: '3rem', color: 'var(--primary-dark)', marginBottom: '1rem' }}>Health & Advice</h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
          Expert guidance from our clinical team to help you manage your everyday wellbeing.
        </p>
      </header>

      <section style={{ marginBottom: '5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
          {topics.map(topic => (
            <div key={topic.title} style={{ padding: '2rem', background: 'white', borderRadius: '16px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)', cursor: 'pointer' }}>
              <h2 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>{topic.title}</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>{topic.desc}</p>
              <span style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.9rem' }}>Read Article &rarr;</span>
            </div>
          ))}
        </div>
      </section>

      <section style={{ background: 'var(--primary-light)', padding: '4rem', borderRadius: '24px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2rem', color: 'var(--primary-dark)', marginBottom: '1rem' }}>Need personalized advice?</h2>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '2rem' }}>Speak to one of our registered pharmacists today.</p>
        <button className="btn-primary" style={{ border: 'none' }}>Book Consultation</button>
      </section>
    </div>
  );
}
