import React, { useState } from 'react';
import KanbanBoard from '../components/KanbanBoard';
import TaskForm from '../components/TaskForm';
import './Planner.css';

function Planner() {
  const [showTaskForm, setShowTaskForm] = useState(false);

  const handleAddTask = (task) => {
    // Logique pour ajouter une tâche
    console.log('Nouvelle tâche:', task);
    setShowTaskForm(false);
  };

  return (
    <div className="planner">
      <header className="section-header">
        <h1>Planner</h1>
        <button 
          className="add-task-btn"
          onClick={() => setShowTaskForm(!showTaskForm)}
        >
          {showTaskForm ? '- Fermer' : '+ Nouvelle Tâche'}
        </button>
      </header>

      {showTaskForm && (
        <TaskForm onAddTask={handleAddTask} />
      )}

      <div className="planner-content">
        <KanbanBoard />
      </div>
    </div>
  );
}

export default Planner; 