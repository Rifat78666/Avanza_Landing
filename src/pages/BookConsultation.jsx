import React, { useState } from 'react';
import { useLanguage } from '../LanguageContext';
import { Calendar, Clock, Video, Mail, Phone, ChevronLeft, ChevronRight, Check } from 'lucide-react';

const CONSULTATION_TYPES = [
  {
    id: 'free',
    title: 'Free Discovery Call',
    duration: '15 min',
    price: 'Free',
    description: 'Quick intro to understand your situation and how we can help.',
    icon: Phone,
    color: '#009246',
  },
  {
    id: 'standard',
    title: 'Standard Consultation',
    duration: '30 min',
    price: '€29',
    description: 'In-depth review of your degree recognition pathway and timeline.',
    icon: Video,
    color: '#009246',
  },
  {
    id: 'premium',
    title: 'Premium Strategy Session',
    duration: '60 min',
    price: '€49',
    description: 'Full case analysis with personalized action plan and document review.',
    icon: Calendar,
    color: '#CE2B37',
  },
];

// Generate available time slots for the next 14 days
const generateTimeSlots = () => {
  const slots = {};
  const now = new Date();
  for (let d = 1; d <= 14; d++) {
    const date = new Date(now);
    date.setDate(now.getDate() + d);
    // Skip weekends
    if (date.getDay() === 0 || date.getDay() === 6) continue;
    const key = date.toISOString().split('T')[0];
    slots[key] = [
      '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
      '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
    ];
  }
  return slots;
};

const BookConsultation = () => {
  const { t } = useLanguage();
  const [step, setStep] = useState(1); // 1: choose type, 2: pick date/time, 3: your info, 4: confirmation
  const [selectedType, setSelectedType] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [weekOffset, setWeekOffset] = useState(0);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const timeSlots = generateTimeSlots();
  const availableDates = Object.keys(timeSlots);

  // Get dates for current week view
  const getWeekDates = () => {
    const start = weekOffset * 5;
    return availableDates.slice(start, start + 5);
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr + 'T00:00:00');
    return {
      day: date.toLocaleDateString('en', { weekday: 'short' }),
      date: date.getDate(),
      month: date.toLocaleDateString('en', { month: 'short' }),
      full: date.toLocaleDateString('en', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }),
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate submission
    await new Promise(r => setTimeout(r, 1500));
    setIsSubmitting(false);
    setStep(4);
  };

  return (
    <div className="container" style={{ maxWidth: '1000px', margin: '0 auto', padding: '3rem 1.5rem' }}>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{
          fontSize: 'clamp(2.2rem, 4vw, 3.2rem)',
          fontWeight: '800',
          color: 'var(--text-primary)',
          marginBottom: '1rem',
          letterSpacing: '-0.02em',
        }}>
          Book a Consultation
        </h1>
        <p style={{
          fontSize: '1.15rem',
          color: 'var(--text-secondary)',
          maxWidth: '600px',
          margin: '0 auto',
          lineHeight: '1.6',
        }}>
          Schedule a live session with our team to explore your degree recognition pathway in Italy.
        </p>
      </div>

      {/* Profile Card — like INDIMA */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1.5rem',
        background: 'var(--surface-color)',
        border: '1px solid var(--border-color)',
        borderRadius: '16px',
        padding: '1.5rem 2rem',
        marginBottom: '2.5rem',
      }}>
        <div style={{
          width: '72px',
          height: '72px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #009246, #CE2B37)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.8rem',
          fontWeight: '800',
          color: '#fff',
          flexShrink: 0,
        }}>
          RH
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>
              Rifatul Haque
            </h3>
            <a href="https://www.linkedin.com/in/md-rifatul-haque" target="_blank" rel="noopener noreferrer"
              style={{ color: '#0A66C2', display: 'flex', alignItems: 'center' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
            </a>
          </div>
          <p style={{ color: '#009246', fontWeight: '600', fontSize: '0.95rem', margin: '0.25rem 0 0.5rem' }}>
            Co-Founder · Systems &amp; AI
          </p>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0, lineHeight: '1.5' }}>
            Designs the AI engine and platform infrastructure powering AVANZA&apos;s personalised roadmaps at scale.
          </p>
        </div>
      </div>

      {/* Progress Steps */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        marginBottom: '2.5rem',
      }}>
        {['Service', 'Date & Time', 'Your Info', 'Confirmed'].map((label, i) => {
          const stepNum = i + 1;
          const isActive = step === stepNum;
          const isCompleted = step > stepNum;
          return (
            <React.Fragment key={label}>
              {i > 0 && (
                <div style={{
                  width: '40px',
                  height: '2px',
                  background: isCompleted ? '#009246' : 'var(--border-color)',
                  transition: 'background 0.3s',
                }} />
              )}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}>
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.8rem',
                  fontWeight: '700',
                  background: isCompleted ? '#009246' : isActive ? '#009246' : 'transparent',
                  color: isCompleted || isActive ? '#fff' : 'var(--text-secondary)',
                  border: isCompleted || isActive ? 'none' : '2px solid var(--border-color)',
                  transition: 'all 0.3s',
                }}>
                  {isCompleted ? <Check size={14} /> : stepNum}
                </div>
                <span style={{
                  fontSize: '0.82rem',
                  fontWeight: isActive ? '700' : '500',
                  color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                  display: window.innerWidth > 600 ? 'inline' : 'none',
                }}>
                  {label}
                </span>
              </div>
            </React.Fragment>
          );
        })}
      </div>

      {/* Step 1: Choose Consultation Type */}
      {step === 1 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {CONSULTATION_TYPES.map((type) => {
            const Icon = type.icon;
            const isSelected = selectedType?.id === type.id;
            return (
              <div
                key={type.id}
                onClick={() => setSelectedType(type)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1.25rem',
                  padding: '1.5rem',
                  borderRadius: '14px',
                  border: isSelected ? `2px solid ${type.color}` : '2px solid var(--border-color)',
                  background: isSelected ? `${type.color}08` : 'var(--surface-color)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                <div style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '12px',
                  background: `${type.color}15`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <Icon size={24} color={type.color} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>
                      {type.title}
                    </h3>
                    <span style={{ fontWeight: '800', color: type.color, fontSize: '1.1rem' }}>
                      {type.price}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', margin: 0 }}>
                    {type.description}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.5rem' }}>
                    <Clock size={14} color="var(--text-secondary)" />
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{type.duration}</span>
                  </div>
                </div>
                <div style={{
                  width: '22px',
                  height: '22px',
                  borderRadius: '50%',
                  border: isSelected ? `2px solid ${type.color}` : '2px solid var(--border-color)',
                  background: isSelected ? type.color : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  transition: 'all 0.2s',
                }}>
                  {isSelected && <Check size={12} color="#fff" />}
                </div>
              </div>
            );
          })}
          <button
            disabled={!selectedType}
            onClick={() => setStep(2)}
            className="btn-primary"
            style={{
              marginTop: '1rem',
              padding: '1rem 2.5rem',
              fontSize: '1.05rem',
              alignSelf: 'flex-end',
              borderRadius: '10px',
              opacity: selectedType ? 1 : 0.4,
              cursor: selectedType ? 'pointer' : 'not-allowed',
            }}
          >
            Continue
          </button>
        </div>
      )}

      {/* Step 2: Pick Date & Time */}
      {step === 2 && (
        <div>
          {/* Week navigation */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.5rem',
          }}>
            <button
              onClick={() => setWeekOffset(Math.max(0, weekOffset - 1))}
              disabled={weekOffset === 0}
              style={{
                background: 'none',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                padding: '0.5rem',
                cursor: weekOffset === 0 ? 'not-allowed' : 'pointer',
                opacity: weekOffset === 0 ? 0.3 : 1,
                color: 'var(--text-primary)',
              }}
            >
              <ChevronLeft size={20} />
            </button>
            <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>
              {getWeekDates().length > 0 && `${formatDate(getWeekDates()[0]).month} ${formatDate(getWeekDates()[0]).date} – ${formatDate(getWeekDates()[getWeekDates().length - 1]).date}`}
            </span>
            <button
              onClick={() => setWeekOffset(weekOffset + 1)}
              disabled={(weekOffset + 1) * 5 >= availableDates.length}
              style={{
                background: 'none',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                padding: '0.5rem',
                cursor: (weekOffset + 1) * 5 >= availableDates.length ? 'not-allowed' : 'pointer',
                opacity: (weekOffset + 1) * 5 >= availableDates.length ? 0.3 : 1,
                color: 'var(--text-primary)',
              }}
            >
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Date picker */}
          <div style={{
            display: 'flex',
            gap: '0.75rem',
            marginBottom: '2rem',
            overflowX: 'auto',
          }}>
            {getWeekDates().map((dateStr) => {
              const f = formatDate(dateStr);
              const isSelected = selectedDate === dateStr;
              return (
                <div
                  key={dateStr}
                  onClick={() => { setSelectedDate(dateStr); setSelectedTime(null); }}
                  style={{
                    flex: '1',
                    minWidth: '80px',
                    padding: '1rem 0.5rem',
                    borderRadius: '12px',
                    border: isSelected ? '2px solid #009246' : '2px solid var(--border-color)',
                    background: isSelected ? 'rgba(0,146,70,0.08)' : 'var(--surface-color)',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: '600', textTransform: 'uppercase' }}>
                    {f.day}
                  </div>
                  <div style={{
                    fontSize: '1.5rem',
                    fontWeight: '800',
                    color: isSelected ? '#009246' : 'var(--text-primary)',
                    margin: '0.25rem 0',
                  }}>
                    {f.date}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                    {f.month}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Time slots */}
          {selectedDate && (
            <>
              <h3 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '1rem' }}>
                Available Times
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
                gap: '0.6rem',
                marginBottom: '1.5rem',
              }}>
                {timeSlots[selectedDate]?.map((time) => {
                  const isSelected = selectedTime === time;
                  return (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      style={{
                        padding: '0.7rem',
                        borderRadius: '8px',
                        border: isSelected ? '2px solid #009246' : '1px solid var(--border-color)',
                        background: isSelected ? '#009246' : 'var(--surface-color)',
                        color: isSelected ? '#fff' : 'var(--text-primary)',
                        fontWeight: '600',
                        fontSize: '0.9rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                      }}
                    >
                      {time}
                    </button>
                  );
                })}
              </div>
            </>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
            <button
              onClick={() => setStep(1)}
              className="btn-outline"
              style={{ padding: '0.8rem 1.5rem', borderRadius: '10px' }}
            >
              Back
            </button>
            <button
              disabled={!selectedDate || !selectedTime}
              onClick={() => setStep(3)}
              className="btn-primary"
              style={{
                padding: '0.8rem 2rem',
                borderRadius: '10px',
                opacity: selectedDate && selectedTime ? 1 : 0.4,
                cursor: selectedDate && selectedTime ? 'pointer' : 'not-allowed',
              }}
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Contact Information */}
      {step === 3 && (
        <form onSubmit={handleSubmit} style={{ maxWidth: '500px', margin: '0 auto' }}>
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
              Full Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Your full name"
              style={{
                width: '100%',
                padding: '0.85rem 1rem',
                borderRadius: '10px',
                border: '1px solid var(--border-color)',
                background: 'var(--surface-color)',
                color: 'var(--text-primary)',
                fontSize: '1rem',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
              Email Address *
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="your@email.com"
              style={{
                width: '100%',
                padding: '0.85rem 1rem',
                borderRadius: '10px',
                border: '1px solid var(--border-color)',
                background: 'var(--surface-color)',
                color: 'var(--text-primary)',
                fontSize: '1rem',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
              Phone Number
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+39 xxx xxx xxxx"
              style={{
                width: '100%',
                padding: '0.85rem 1rem',
                borderRadius: '10px',
                border: '1px solid var(--border-color)',
                background: 'var(--surface-color)',
                color: 'var(--text-primary)',
                fontSize: '1rem',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
              Tell us about your situation
            </label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="E.g., I have a nursing degree from Romania and want to work in Italy..."
              rows={4}
              style={{
                width: '100%',
                padding: '0.85rem 1rem',
                borderRadius: '10px',
                border: '1px solid var(--border-color)',
                background: 'var(--surface-color)',
                color: 'var(--text-primary)',
                fontSize: '1rem',
                outline: 'none',
                resize: 'vertical',
                fontFamily: 'inherit',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Summary */}
          <div style={{
            background: 'rgba(0,146,70,0.06)',
            border: '1px solid rgba(0,146,70,0.2)',
            borderRadius: '12px',
            padding: '1.25rem',
            marginBottom: '1.5rem',
          }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: '700', color: '#009246', margin: '0 0 0.75rem' }}>
              Booking Summary
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
              <div><strong>Service:</strong> {selectedType?.title}</div>
              <div><strong>Duration:</strong> {selectedType?.duration}</div>
              <div><strong>Date:</strong> {selectedDate && formatDate(selectedDate).full}</div>
              <div><strong>Time:</strong> {selectedTime} (CET)</div>
              <div><strong>Price:</strong> <span style={{ fontWeight: '700', color: '#009246' }}>{selectedType?.price}</span></div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button
              type="button"
              onClick={() => setStep(2)}
              className="btn-outline"
              style={{ padding: '0.8rem 1.5rem', borderRadius: '10px' }}
            >
              Back
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !formData.name || !formData.email}
              className="btn-primary"
              style={{
                padding: '0.8rem 2rem',
                borderRadius: '10px',
                opacity: isSubmitting || !formData.name || !formData.email ? 0.6 : 1,
              }}
            >
              {isSubmitting ? 'Booking...' : 'Confirm Booking'}
            </button>
          </div>
        </form>
      )}

      {/* Step 4: Confirmation */}
      {step === 4 && (
        <div style={{ textAlign: 'center', padding: '2rem 0' }}>
          <div style={{
            width: '90px',
            height: '90px',
            borderRadius: '50%',
            background: 'rgba(0,146,70,0.1)',
            border: '3px solid #009246',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
          }}>
            <Check size={44} color="#009246" />
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
            Consultation Booked!
          </h2>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: '500px', margin: '0 auto 2rem', lineHeight: '1.6' }}>
            We&apos;ve sent a confirmation to <strong style={{ color: 'var(--text-primary)' }}>{formData.email}</strong>.
            You&apos;ll receive a calendar invite with the meeting link shortly.
          </p>

          <div style={{
            background: 'var(--surface-color)',
            border: '1px solid var(--border-color)',
            borderRadius: '14px',
            padding: '1.5rem',
            maxWidth: '400px',
            margin: '0 auto 2rem',
            textAlign: 'left',
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.95rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Service</span>
                <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{selectedType?.title}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Date</span>
                <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{selectedDate && formatDate(selectedDate).full}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Time</span>
                <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{selectedTime} CET</span>
              </div>
              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.6rem', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: '700', color: 'var(--text-primary)' }}>Total</span>
                <span style={{ fontWeight: '800', color: '#009246', fontSize: '1.1rem' }}>{selectedType?.price}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => { setStep(1); setSelectedType(null); setSelectedDate(null); setSelectedTime(null); setFormData({ name: '', email: '', phone: '', message: '' }); }}
            className="btn-outline"
            style={{ padding: '0.8rem 2rem', borderRadius: '10px' }}
          >
            Book Another Consultation
          </button>
        </div>
      )}
    </div>
  );
};

export default BookConsultation;
