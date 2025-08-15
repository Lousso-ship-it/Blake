import React, { useEffect, useRef } from 'react';
import { createChart, IChartApi, ISeriesApi } from 'lightweight-charts';
import './TimeSeriesChart.css';

interface TimeSeriesChartProps {
  data: any[];
  analysis: any;
  indicators: string[];
}

export function TimeSeriesChart({ data, analysis, indicators }: TimeSeriesChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<Record<string, ISeriesApi<"Line" | "Candlestick">>>({});

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Créer le graphique
    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 500,
      layout: {
        background: { color: '#1E1E1E' },
        textColor: '#A0A0A0',
      },
      grid: {
        vertLines: { color: '#2A2A2A' },
        horzLines: { color: '#2A2A2A' },
      },
      crosshair: {
        mode: 1,
        vertLine: {
          width: 1,
          color: '#26A69A',
          style: 0,
        },
        horzLine: {
          width: 1,
          color: '#26A69A',
          style: 0,
        },
      },
    });

    // Série principale
    const mainSeries = chart.addCandlestickSeries({
      upColor: '#26A69A',
      downColor: '#EF5350',
      borderVisible: false,
      wickUpColor: '#26A69A',
      wickDownColor: '#EF5350',
    });

    // Ajouter les données
    mainSeries.setData(formatCandlestickData(data));
    seriesRef.current.main = mainSeries;

    // Ajouter les indicateurs
    if (indicators.includes('bollinger')) {
      const upperBand = chart.addLineSeries({
        color: '#A0A0A0',
        lineWidth: 1,
        priceLineVisible: false,
      });
      const lowerBand = chart.addLineSeries({
        color: '#A0A0A0',
        lineWidth: 1,
        priceLineVisible: false,
      });

      upperBand.setData(formatLineData(analysis.indicators.bollingerUpper));
      lowerBand.setData(formatLineData(analysis.indicators.bollingerLower));
      
      seriesRef.current.upperBand = upperBand;
      seriesRef.current.lowerBand = lowerBand;
    }

    // Ajouter les signaux
    const markers = analysis.signals
      .filter(s => s.strength > 0.6)
      .map(signal => ({
        time: signal.timestamp,
        position: signal.signal === 'buy' ? 'belowBar' : 'aboveBar',
        color: signal.signal === 'buy' ? '#26A69A' : '#EF5350',
        shape: signal.signal === 'buy' ? 'arrowUp' : 'arrowDown',
        text: signal.signal.toUpperCase(),
      }));

    mainSeries.setMarkers(markers);

    chartRef.current = chart;

    // Gestion du redimensionnement
    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (chartRef.current) {
        chartRef.current.remove();
      }
    };
  }, [data, analysis, indicators]);

  return (
    <div className="timeseries-chart">
      <div ref={chartContainerRef} className="chart-container"></div>
      <div className="chart-legend">
        {indicators.map(indicator => (
          <div key={indicator} className="legend-item">
            <span className={`legend-color ${indicator}`}></span>
            <span className="legend-label">{indicator.toUpperCase()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function formatCandlestickData(data: any[]) {
  return data.map(d => ({
    time: new Date(d.timestamp).getTime() / 1000,
    open: d.open,
    high: d.high,
    low: d.low,
    close: d.close,
  }));
}

function formatLineData(data: any[]) {
  return data.map(d => ({
    time: new Date(d.timestamp).getTime() / 1000,
    value: d.value,
  }));
} 