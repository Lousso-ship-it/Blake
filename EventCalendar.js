import React, { useState } from 'react';
import Calendar from 'react-calendar';
import './EventCalendar.css';

function EventCalendar() {
  const [date, setDate] = useState(new Date());
  const [events] = useState([
    {
      date: '2024-02-01',
      title: 'Réunion FED',
      type: 'economic',
      importance: 'high'
    },
    {
      date: '2024-02-02',
      title: 'Rapport emploi US',
      type: 'economic',
      importance: 'high'
    },
    {
      date: '2024-02-05',
      title: 'Résultats Apple',
      type: 'corporate',
      importance: 'medium'
    }
  ]);

  const getTileContent = ({ date }) => {
    const dateStr = date.toISOString().split('T')[0];
    const dayEvents = events.filter(event => event.date === dateStr);
    
    if (dayEvents.length > 0) {
      return (
        <div className="event-indicator">
          {dayEvents.map((event, index) => (
            <span 
              key={index} 
              className={`indicator ${event.importance} ${event.type}`}
            />
          ))}
        </div>
      );
    }
  };

  const getEventsList = (selectedDate) => {
    const dateStr = selectedDate.toISOString().split('T')[0];
    return events.filter(event => event.date === dateStr);
  };

  return (
    <div className="event-calendar">
      <Calendar
        onChange={setDate}
        value={date}
        tileContent={getTileContent}
      />
      <div className="events-list">
        <h3>Événements du {date.toLocaleDateString()}</h3>
        {getEventsList(date).map((event, index) => (
          <div key={index} className={`event-item ${event.importance}`}>
            <span className={`event-type ${event.type}`}>{event.type}</span>
            <span className="event-title">{event.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default EventCalendar; 