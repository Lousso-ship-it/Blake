import React, { useState, useEffect } from 'react';
import './EconomicCalendar.css';

function EconomicCalendar() {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      try {
        // Simulation de données pour le moment
        const mockEvents = [
          {
            id: 1,
            time: '08:30',
            country: 'US',
            event: 'PIB Trimestriel',
            impact: 'high',
            actual: '2.1%',
            forecast: '2.0%',
            previous: '1.9%'
          },
          {
            id: 2,
            time: '10:00',
            country: 'EUR',
            event: 'IPC',
            impact: 'high',
            actual: '3.2%',
            forecast: '3.1%',
            previous: '3.4%'
          },
          // Plus d'événements...
        ];

        setEvents(mockEvents);
      } catch (error) {
        console.error('Erreur lors du chargement des événements:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, [selectedDate]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  return (
    <div className="economic-calendar">
      <div className="calendar-header">
        <h3>Calendrier Économique</h3>
        <div className="date-navigation">
          <button onClick={() => handleDateChange(new Date(selectedDate.setDate(selectedDate.getDate() - 1)))}>
            <i className="fas fa-chevron-left"></i>
          </button>
          <span>{selectedDate.toLocaleDateString()}</span>
          <button onClick={() => handleDateChange(new Date(selectedDate.setDate(selectedDate.getDate() + 1)))}>
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <span>Chargement des événements...</span>
        </div>
      ) : (
        <div className="events-list">
          {events.map(event => (
            <div key={event.id} className="event-item">
              <div className="event-time">
                <span className="time">{event.time}</span>
                <span className={`impact-indicator ${event.impact}`}></span>
              </div>
              
              <div className="event-content">
                <div className="event-header">
                  <span className={`country-flag ${event.country.toLowerCase()}`}></span>
                  <span className="event-name">{event.event}</span>
                </div>
                
                <div className="event-data">
                  <div className="data-item">
                    <span className="label">Actuel</span>
                    <span className="value">{event.actual}</span>
                  </div>
                  <div className="data-item">
                    <span className="label">Prévision</span>
                    <span className="value">{event.forecast}</span>
                  </div>
                  <div className="data-item">
                    <span className="label">Précédent</span>
                    <span className="value">{event.previous}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default EconomicCalendar; 