import React, { useEffect, useRef } from 'react';
import { createChart } from 'lightweight-charts';
import { useMarketData } from '../hooks/useMarketData';
import './TradingViewChart.css';

function TradingViewChart({ symbol, exchange = 'binance', interval = '1m' }) {
  const chartContainerRef = useRef(null);
  const chartRef = useRef(null);
  const candlestickSeriesRef = useRef(null);
  const volumeSeriesRef = useRef(null);

  const { data: tickData } = useMarketData(exchange, symbol, 'ticker');
  const { data: klineData } = useMarketData(exchange, symbol, 'kline', interval);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    chartRef.current = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight,
      layout: {
        background: { color: '#1E1E1E' },
        textColor: '#A0A0A0',
      },
      grid: {
        vertLines: { color: '#2A2A2A' },
        horzLines: { color: '#2A2A2A' },
      },
      crosshair: {
        mode: 0,
      },
      timeScale: {
        borderColor: '#2A2A2A',
        timeVisible: true,
        secondsVisible: false,
      },
      rightPriceScale: {
        borderColor: '#2A2A2A',
      },
    });

    candlestickSeriesRef.current = chartRef.current.addCandlestickSeries({
      upColor: '#26A69A',
      downColor: '#EF5350',
      borderVisible: false,
      wickUpColor: '#26A69A',
      wickDownColor: '#EF5350',
    });

    volumeSeriesRef.current = chartRef.current.addHistogramSeries({
      color: '#26A69A',
      priceFormat: {
        type: 'volume',
      },
      priceScaleId: '',
      scaleMargins: {
        top: 0.8,
        bottom: 0,
      },
    });

    const handleResize = () => {
      if (chartRef.current && chartContainerRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
          height: chartContainerRef.current.clientHeight,
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
  }, []);

  useEffect(() => {
    if (klineData && candlestickSeriesRef.current && volumeSeriesRef.current) {
      const candleData = klineData.map(k => ({
        time: k.time,
        open: k.open,
        high: k.high,
        low: k.low,
        close: k.close
      }));

      const volumeData = klineData.map(k => ({
        time: k.time,
        value: k.volume,
        color: k.close >= k.open ? '#26A69A80' : '#EF535080'
      }));

      candlestickSeriesRef.current.setData(candleData);
      volumeSeriesRef.current.setData(volumeData);
    }
  }, [klineData]);

  useEffect(() => {
    if (tickData && candlestickSeriesRef.current) {
      candlestickSeriesRef.current.update({
        time: tickData.time,
        open: tickData.open,
        high: tickData.high,
        low: tickData.low,
        close: tickData.close
      });
    }
  }, [tickData]);

  return (
    <div className="trading-chart">
      <div className="chart-header">
        <div className="symbol-info">
          <h2>{symbol}</h2>
          {tickData && (
            <div className="price-info">
              <span className={`price ${tickData.priceChange >= 0 ? 'positive' : 'negative'}`}>
                ${parseFloat(tickData.close).toFixed(2)}
              </span>
              <span className={`change ${tickData.priceChange >= 0 ? 'positive' : 'negative'}`}>
                {tickData.priceChange >= 0 ? '+' : ''}{tickData.priceChangePercent}%
              </span>
            </div>
          )}
        </div>
        <div className="chart-controls">
          <select defaultValue={interval}>
            <option value="1m">1m</option>
            <option value="5m">5m</option>
            <option value="15m">15m</option>
            <option value="1h">1h</option>
            <option value="4h">4h</option>
            <option value="1d">1d</option>
          </select>
        </div>
      </div>
      <div ref={chartContainerRef} className="chart-container" />
    </div>
  );
}

export default TradingViewChart; 