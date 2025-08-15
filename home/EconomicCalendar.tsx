import React, { useState, useEffect } from 'react';
import { format, startOfWeek, endOfWeek } from 'date-fns';
import { fr } from 'date-fns/locale';
import './EconomicCalendar.css';

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  impact: 'high' | 'medium' | 'low';
  country: string;
  actual?: string;
  forecast?: string;
  previous?: string;
}

export function EconomicCalendar() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const startDate = format(startOfWeek(selectedDate), 'yyyy-MM-dd');
        const endDate = format(endOfWeek(selectedDate), 'yyyy-MM-dd');

        const data = await window.electron.invoke('fetch-economic-calendar', {
          startDate,
          endDate
        });

        setEvents(data);
      } catch (err) {
        setError('Erreur lors du chargement du calendrier');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [selectedDate]);

  if (loading) {
    return (
      <div className="calendar-container loading">
        <div className="spinner"></div>
        <p>Chargement des événements...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="calendar-container error">
        <i className="fas fa-exclamation-circle"></i>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <h2>Calendrier Économique</h2>
        <div className="calendar-controls">
          <button onClick={() => setSelectedDate(new Date())}>
            Aujourd'hui
          </button>
          <select
            value={format(selectedDate, 'yyyy-MM-dd')}
            onChange={(e) => setSelectedDate(new Date(e.target.value))}
          >
            {/* Options pour la sélection de la semaine */}
          </select>
        </div>
      </div>

      <div className="calendar-content">
        {events.map(event => (
          <div key={event.id} className={`event-card impact-${event.impact}`}>
            <div className="event-time">
              <span className="date">{format(new Date(event.date), 'dd MMM', { locale: fr })}</span>
              <span className="time">{event.time}</span>
            </div>
            <div className="event-details">
              <div className="event-header">
                <span className={`country-flag ${event.country.toLowerCase()}`}></span>
                <h3>{event.title}</h3>
              </div>
              <div className="event-metrics">
                {event.actual && (
                  <div className="metric">
                    <span className="label">Actuel</span>
                    <span className="value">{event.actual}</span>
                  </div>
                )}
                {event.forecast && (
                  <div className="metric">
                    <span className="label">Prévision</span>
                    <span className="value">{event.forecast}</span>
                  </div>
                )}
                {event.previous && (
                  <div className="metric">
                    <span className="label">Précédent</span>
                    <span className="value">{event.previous}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 