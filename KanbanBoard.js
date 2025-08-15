import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import './KanbanBoard.css';

function KanbanBoard() {
  const [columns, setColumns] = useState({
    todo: {
      id: 'todo',
      title: 'À Faire',
      tasks: [
        { id: '1', title: 'Analyser BTC/USD', description: 'Étude technique approfondie', priority: 'high', deadline: '2024-02-01' },
        { id: '2', title: 'Réviser stratégie', description: 'Mise à jour des stop-loss', priority: 'medium', deadline: '2024-02-03' },
      ]
    },
    inProgress: {
      id: 'inProgress',
      title: 'En Cours',
      tasks: [
        { id: '3', title: 'Suivi position AAPL', description: 'Monitoring des supports', priority: 'high', deadline: '2024-01-31' },
      ]
    },
    done: {
      id: 'done',
      title: 'Terminé',
      tasks: [
        { id: '4', title: 'Bilan mensuel', description: 'Rapport de performance', priority: 'low', deadline: '2024-01-30' },
      ]
    }
  });

  const onDragEnd = (result) => {
    const { source, destination } = result;

    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];
    const sourceTasks = [...sourceColumn.tasks];
    const destTasks = source.droppableId === destination.droppableId
      ? sourceTasks
      : [...destColumn.tasks];
    const [removed] = sourceTasks.splice(source.index, 1);
    destTasks.splice(destination.index, 0, removed);

    setColumns({
      ...columns,
      [source.droppableId]: {
        ...sourceColumn,
        tasks: sourceTasks
      },
      [destination.droppableId]: {
        ...destColumn,
        tasks: destTasks
      }
    });
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="kanban-board">
        {Object.values(columns).map(column => (
          <div key={column.id} className="kanban-column">
            <h3 className="column-title">{column.title}</h3>
            <Droppable droppableId={column.id}>
              {(provided, snapshot) => (
                <div
                  className={`task-list ${snapshot.isDraggingOver ? 'dragging-over' : ''}`}
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {column.tasks.map((task, index) => (
                    <Draggable key={task.id} draggableId={task.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          className={`task-card ${snapshot.isDragging ? 'dragging' : ''}`}
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <div className={`task-priority ${task.priority}`} />
                          <h4 className="task-title">{task.title}</h4>
                          <p className="task-description">{task.description}</p>
                          <div className="task-footer">
                            <span className="task-deadline">
                              Échéance: {new Date(task.deadline).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
}

export default KanbanBoard; 