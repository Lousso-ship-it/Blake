import React, { useState, useEffect } from 'react';
import { DashboardGrid } from './DashboardGrid';
import { WidgetSelector } from './WidgetSelector';
import { WidgetSettings } from './WidgetSettings';
import './Dashboard.css';

interface DashboardLayout {
  id: string;
  name: string;
  widgets: WidgetConfig[];
}

interface WidgetConfig {
  id: string;
  type: string;
  title: string;
  dataSource: string;
  settings: any;
  position: {
    x: number;
    y: number;
    w: number;
    h: number;
  };
}

export function Dashboard() {
  const [layouts, setLayouts] = useState<DashboardLayout[]>([]);
  const [activeLayout, setActiveLayout] = useState<string | null>(null);
  const [isAddingWidget, setIsAddingWidget] = useState(false);
  const [selectedWidget, setSelectedWidget] = useState<WidgetConfig | null>(null);

  useEffect(() => {
    loadLayouts();
  }, []);

  const loadLayouts = async () => {
    try {
      const { data: userLayouts } = await window.electron.invoke('load-dashboard-layouts');
      setLayouts(userLayouts);
      if (userLayouts.length > 0) {
        setActiveLayout(userLayouts[0].id);
      }
    } catch (error) {
      console.error('Erreur chargement layouts:', error);
    }
  };

  const handleAddWidget = async (widgetType: string, dataSource: string) => {
    if (!activeLayout) return;

    const newWidget: WidgetConfig = {
      id: Date.now().toString(),
      type: widgetType,
      title: 'Nouveau Widget',
      dataSource,
      settings: {},
      position: { x: 0, y: 0, w: 6, h: 4 }
    };

    try {
      await window.electron.invoke('add-dashboard-widget', {
        layoutId: activeLayout,
        widget: newWidget
      });

      setLayouts(prevLayouts => 
        prevLayouts.map(layout => 
          layout.id === activeLayout
            ? { ...layout, widgets: [...layout.widgets, newWidget] }
            : layout
        )
      );
    } catch (error) {
      console.error('Erreur ajout widget:', error);
    }
  };

  const handleUpdateWidget = async (widgetId: string, updates: Partial<WidgetConfig>) => {
    if (!activeLayout) return;

    try {
      await window.electron.invoke('update-dashboard-widget', {
        layoutId: activeLayout,
        widgetId,
        updates
      });

      setLayouts(prevLayouts =>
        prevLayouts.map(layout =>
          layout.id === activeLayout
            ? {
                ...layout,
                widgets: layout.widgets.map(widget =>
                  widget.id === widgetId
                    ? { ...widget, ...updates }
                    : widget
                )
              }
            : layout
        )
      );
    } catch (error) {
      console.error('Erreur mise à jour widget:', error);
    }
  };

  const handleDeleteWidget = async (widgetId: string) => {
    if (!activeLayout) return;

    try {
      await window.electron.invoke('delete-dashboard-widget', {
        layoutId: activeLayout,
        widgetId
      });

      setLayouts(prevLayouts =>
        prevLayouts.map(layout =>
          layout.id === activeLayout
            ? {
                ...layout,
                widgets: layout.widgets.filter(w => w.id !== widgetId)
              }
            : layout
        )
      );
    } catch (error) {
      console.error('Erreur suppression widget:', error);
    }
  };

  const currentLayout = layouts.find(l => l.id === activeLayout);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="layout-selector">
          <select
            value={activeLayout || ''}
            onChange={(e) => setActiveLayout(e.target.value)}
          >
            {layouts.map(layout => (
              <option key={layout.id} value={layout.id}>
                {layout.name}
              </option>
            ))}
          </select>
          <button onClick={() => setIsAddingWidget(true)}>
            <i className="fas fa-plus"></i>
            Ajouter un Widget
          </button>
        </div>
      </div>

      <div className="dashboard-content">
        {currentLayout && (
          <DashboardGrid
            widgets={currentLayout.widgets}
            onWidgetUpdate={handleUpdateWidget}
            onWidgetSelect={setSelectedWidget}
            onWidgetDelete={handleDeleteWidget}
          />
        )}
      </div>

      {isAddingWidget && (
        <WidgetSelector
          onSelect={handleAddWidget}
          onClose={() => setIsAddingWidget(false)}
        />
      )}

      {selectedWidget && (
        <WidgetSettings
          widget={selectedWidget}
          onUpdate={handleUpdateWidget}
          onClose={() => setSelectedWidget(null)}
        />
      )}
    </div>
  );
} 