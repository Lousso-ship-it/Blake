import React, { useState, useEffect } from 'react';
import { TimeSeriesChart } from './TimeSeriesChart';
import { IndicatorsPanel } from './IndicatorsPanel';
import { SignalsTable } from './SignalsTable';
import { datalakeService } from '../../services/datalakeService';
import './Analysis.css';

interface AnalysisProps {
  itemId: string;
  type: string;
}

export function Analysis({ itemId, type }: AnalysisProps) {
  const [data, setData] = useState<any>(null);
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'chart' | 'signals' | 'backtest'>('chart');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await datalakeService.fetchData(itemId, type);
        setData(result);
        
        // Lancer l'analyse
        const analysisResult = await datalakeService.analyzeData(result.data);
        setAnalysis(analysisResult);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [itemId, type]);

  if (loading) {
    return (
      <div className="analysis-loading">
        <div className="spinner"></div>
        <p>Chargement de l'analyse...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="analysis-error">
        <i className="fas fa-exclamation-circle"></i>
        <p>Erreur: {error}</p>
      </div>
    );
  }

  return (
    <div className="analysis-container">
      <div className="analysis-header">
        <h2>{data.metadata.title}</h2>
        <div className="analysis-tabs">
          <button
            className={`tab ${activeTab === 'chart' ? 'active' : ''}`}
            onClick={() => setActiveTab('chart')}
          >
            <i className="fas fa-chart-line"></i>
            Graphique
          </button>
          <button
            className={`tab ${activeTab === 'signals' ? 'active' : ''}`}
            onClick={() => setActiveTab('signals')}
          >
            <i className="fas fa-signal"></i>
            Signaux
          </button>
          <button
            className={`tab ${activeTab === 'backtest' ? 'active' : ''}`}
            onClick={() => setActiveTab('backtest')}
          >
            <i className="fas fa-flask"></i>
            Backtest
          </button>
        </div>
      </div>

      <div className="analysis-content">
        {activeTab === 'chart' && (
          <div className="chart-view">
            <TimeSeriesChart
              data={data.data}
              analysis={analysis}
              indicators={['rsi', 'macd', 'bollinger']}
            />
            <IndicatorsPanel analysis={analysis} />
          </div>
        )}

        {activeTab === 'signals' && (
          <SignalsTable signals={analysis.signals} />
        )}

        {activeTab === 'backtest' && (
          <BacktestPanel data={data.data} analysis={analysis} />
        )}
      </div>
    </div>
  );
} 