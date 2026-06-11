import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={{ borderBottom: '1px solid var(--border-color)', padding: '1.5rem 0' }}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{ 
          width: '100%', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          background: 'none', 
          border: 'none', 
          padding: 0,
          cursor: 'pointer',
          textAlign: 'left',
          color: 'var(--text-primary)',
          fontSize: '1.1rem',
          fontWeight: '600'
        }}
      >
        {question}
        {isOpen ? <ChevronUp size={20} color="var(--accent-color)" /> : <ChevronDown size={20} color="var(--text-secondary)" />}
      </button>
      {isOpen && (
        <p style={{ marginTop: '1rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
          {answer}
        </p>
      )}
    </div>
  );
};

const FAQ = () => {
  const faqs = [
    {
      question: "How long does the degree recognition process take in Italy?",
      answer: "The process timeline varies significantly depending on your home country, the specific university, and the type of degree. Typically, it can take anywhere from 3 to 12 months. Our AI roadmap provides a more precise estimate based on your specific profile."
    },
    {
      question: "What documents do I need to start the recognition process?",
      answer: "Generally, you need your original degree certificate, official transcripts, a translation of these documents into Italian, and a Declaration of Value (Dichiarazione di Valore) from the Italian consulate or a CIMEA Statement of Comparability. Our platform generates a personalized checklist for your exact situation."
    },
    {
      question: "Can AVANZA guarantee that my degree will be recognized?",
      answer: "While we cannot guarantee the final decision of the Italian authorities or universities, AVANZA significantly increases your chances of success by providing step-by-step guidance, identifying missing documents early, and ensuring your application is complete and correctly formatted."
    },
    {
      question: "Is the initial consultation really free?",
      answer: "Yes! You can take our quiz and get a high-level overview of your roadmap for free. If you need dedicated one-on-one help, we offer premium consultation packages."
    }
  ];

  return (
    <div style={{ backgroundColor: 'var(--bg-color)', minHeight: '100vh', padding: '6rem 2rem' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', fontWeight: '800', marginBottom: '1rem', color: 'var(--text-primary)' }}>
            Frequently Asked Questions
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
            Find answers to common questions about degree recognition, Italian bureaucracy, and how AVANZA can help you.
          </p>
        </div>
        
        <div style={{ backgroundColor: 'var(--surface-color)', padding: '2rem 3rem', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
          {faqs.map((faq, index) => (
            <FAQItem key={index} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQ;
