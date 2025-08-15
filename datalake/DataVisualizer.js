import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { createChart } from 'lightweight-charts';
import './DataVisualizer.css';

function DataVisualizer({ data, type, onTypeChange }) {
  const chartRef = useRef(null);
  const containerRef = useRef(null);

  const visualizationTypes = [
    { id: 'auto', label: 'Auto', icon: 'magic' },
    { id: 'line', label: 'Ligne', icon: 'chart-line' },
    { id: 'bar', label: 'Barres', icon: 'chart-bar' },
    { id: 'candlestick', label: 'Chandelier', icon: 'chart-candlestick' },
    { id: 'scatter', label: 'Nuage', icon: 'dot-circle' },
    { id: 'map', label: 'Carte', icon: 'globe' }
  ];

  useEffect(() => {
    if (!data || !containerRef.current) return;

    // Nettoyer le graphique précédent
    if (chartRef.current) {
      chartRef.current.dispose();
    }

    // Déterminer le meilleur type de visualisation si 'auto'
    const effectiveType = type === 'auto' ? determineVisualizationType(data) : type;

    if (effectiveType === 'candlestick') {
      // Utiliser TradingView Lightweight Charts pour les données OHLC
      const chart = createChart(containerRef.current, {
        width: containerRef.current.clientWidth,
        height: containerRef.current.clientHeight,
        layout: {
          background: { color: '#1E1E1E' },
          textColor: '#A0A0A0',
        },
        grid: {
          vertLines: { color: '#2A2A2A' },
          horzLines: { color: '#2A2A2A' },
        }
      });

      const candlestickSeries = chart.addCandlestickSeries();
      candlestickSeries.setData(formatDataForCandlestick(data));
      chartRef.current = chart;
    } else {
      // Utiliser ECharts pour les autres types de visualisations
      const chart = echarts.init(containerRef.current);
      const option = generateChartOption(data, effectiveType);
      chart.setOption(option);
      chartRef.current = chart;
    }

    const handleResize = () => {
      chartRef.current.resize();
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (chartRef.current) {
        chartRef.current.dispose();
      }
    };
  }, [data, type]);

  const determineVisualizationType = (data) => {
    // Logique pour déterminer automatiquement le meilleur type de visualisation
    if (data.type === 'ohlc') return 'candlestick';
    if (data.type === 'timeseries') return 'line';
    if (data.type === 'comparison') return 'bar';
    if (data.type === 'correlation') return 'scatter';
    if (data.type === 'geographic') return 'map';
    return 'line';
  };

  const generateChartOption = (data, chartType) => {
    // Configuration de base ECharts
    const baseOption = {
      backgroundColor: '#1E1E1E',
      textStyle: { color: '#A0A0A0' },
      tooltip: {
        trigger: 'axis',
        backgroundColor: '#2A2A2A',
        borderColor: '#3A3A3A',
        textStyle: { color: '#FFFFFF' }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        axisLine: { lineStyle: { color: '#2A2A2A' } },
        axisTick: { show: false },
        axisLabel: { color: '#A0A0A0' }
      },
      yAxis: {
        type: 'value',
        axisLine: { lineStyle: { color: '#2A2A2A' } },
        splitLine: { lineStyle: { color: '#2A2A2A' } },
        axisLabel: { color: '#A0A0A0' }
      }
    };

    // Ajouter les données et la configuration spécifique au type
    switch (chartType) {
      case 'line':
        return {
          ...baseOption,
          series: [{
            type: 'line',
            smooth: true,
            symbol: 'none',
            lineStyle: { width: 2 },
            areaStyle: {
              opacity: 0.1,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#26A69A' },
                { offset: 1, color: 'rgba(38, 166, 154, 0)' }
              ])
            },
            data: data.values
          }]
        };
      // Ajouter d'autres cas pour les différents types de graphiques
      default:
        return baseOption;
    }
  };

  return (
    <div className="data-visualizer">
      <div className="visualizer-header">
        <div className="visualization-types">
          {visualizationTypes.map(visType => (
            <button
              key={visType.id}
              className={`type-btn ${type === visType.id ? 'active' : ''}`}
              onClick={() => onTypeChange(visType.id)}
              title={visType.label}
            >
              <i className={`fas fa-${visType.icon}`}></i>
              <span>{visType.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="chart-container" ref={containerRef}></div>
    </div>
  );
}

export default DataVisualizer; 