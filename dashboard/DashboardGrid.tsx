import React from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { Widget } from './Widget';
import 'react-grid-layout/css/styles.css';
import './DashboardGrid.css';

const ResponsiveGridLayout = WidthProvider(Responsive);

interface DashboardGridProps {
  widgets: WidgetConfig[];
  onWidgetUpdate: (widgetId: string, updates: Partial<WidgetConfig>) => void;
  onWidgetSelect: (widget: WidgetConfig) => void;
  onWidgetDelete: (widgetId: string) => void;
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

export function DashboardGrid({
  widgets,
  onWidgetUpdate,
  onWidgetSelect,
  onWidgetDelete
}: DashboardGridProps) {
  const handleLayoutChange = (layout: any[]) => {
    layout.forEach(item => {
      const widget = widgets.find(w => w.id === item.i);
      if (widget) {
        onWidgetUpdate(widget.id, {
          position: {
            x: item.x,
            y: item.y,
            w: item.w,
            h: item.h
          }
        });
      }
    });
  };

  const layouts = {
    lg: widgets.map(widget => ({
      i: widget.id,
      x: widget.position.x,
      y: widget.position.y,
      w: widget.position.w,
      h: widget.position.h,
      minW: 3,
      minH: 2
    }))
  };

  return (
    <div className="dashboard-grid">
      <ResponsiveGridLayout
        className="layout"
        layouts={layouts}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
        rowHeight={60}
        onLayoutChange={handleLayoutChange}
        isDraggable
        isResizable
        margin={[10, 10]}
      >
        {widgets.map(widget => (
          <div key={widget.id} className="widget-container">
            <Widget
              config={widget}
              onUpdate={onWidgetUpdate}
              onSelect={() => onWidgetSelect(widget)}
              onDelete={() => onWidgetDelete(widget.id)}
            />
          </div>
        ))}
      </ResponsiveGridLayout>
    </div>
  );
} 