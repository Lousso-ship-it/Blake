import React, { useState } from 'react';
import './FinanceTracker.css';

function FinanceTracker() {
  const [transactions, setTransactions] = useState([
    { id: 1, type: 'income', category: 'salary', amount: 5000, date: '2024-01-15', description: 'Salaire Janvier' },
    { id: 2, type: 'expense', category: 'trading', amount: 1000, date: '2024-01-16', description: 'Investment AAPL' },
    { id: 3, type: 'income', category: 'trading', amount: 1500, date: '2024-01-20', description: 'Profit BTC' },
  ]);

  const [newTransaction, setNewTransaction] = useState({
    type: 'income',
    category: '',
    amount: '',
    date: '',
    description: '',
  });

  const handleAddTransaction = (e) => {
    e.preventDefault();
    const transaction = {
      id: Date.now(),
      ...newTransaction,
      amount: parseFloat(newTransaction.amount),
    };
    setTransactions([transaction, ...transactions]);
    setNewTransaction({
      type: 'income',
      category: '',
      amount: '',
      date: '',
      description: '',
    });
  };

  const calculateBalance = () => {
    return transactions.reduce((acc, curr) => {
      return curr.type === 'income' ? acc + curr.amount : acc - curr.amount;
    }, 0);
  };

  return (
    <div className="finance-tracker">
      <div className="balance-overview">
        <div className="balance-card">
          <h3>Solde Total</h3>
          <p className="balance-amount">${calculateBalance().toFixed(2)}</p>
        </div>
      </div>

      <form className="transaction-form" onSubmit={handleAddTransaction}>
        <div className="form-row">
          <div className="form-group">
            <label>Type</label>
            <select
              value={newTransaction.type}
              onChange={(e) => setNewTransaction({ ...newTransaction, type: e.target.value })}
            >
              <option value="income">Revenu</option>
              <option value="expense">Dépense</option>
            </select>
          </div>

          <div className="form-group">
            <label>Catégorie</label>
            <select
              value={newTransaction.category}
              onChange={(e) => setNewTransaction({ ...newTransaction, category: e.target.value })}
            >
              <option value="">Sélectionner...</option>
              <option value="salary">Salaire</option>
              <option value="trading">Trading</option>
              <option value="investment">Investissement</option>
              <option value="other">Autre</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Montant</label>
            <input
              type="number"
              value={newTransaction.amount}
              onChange={(e) => setNewTransaction({ ...newTransaction, amount: e.target.value })}
              placeholder="0.00"
              step="0.01"
            />
          </div>

          <div className="form-group">
            <label>Date</label>
            <input
              type="date"
              value={newTransaction.date}
              onChange={(e) => setNewTransaction({ ...newTransaction, date: e.target.value })}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Description</label>
          <input
            type="text"
            value={newTransaction.description}
            onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
            placeholder="Description de la transaction"
          />
        </div>

        <button type="submit" className="submit-btn">Ajouter la transaction</button>
      </form>

      <div className="transactions-list">
        <h3>Transactions récentes</h3>
        {transactions.map((transaction) => (
          <div 
            key={transaction.id} 
            className={`transaction-item ${transaction.type}`}
          >
            <div className="transaction-info">
              <span className="transaction-date">{transaction.date}</span>
              <span className="transaction-description">{transaction.description}</span>
            </div>
            <div className="transaction-amount">
              {transaction.type === 'income' ? '+' : '-'}
              ${transaction.amount.toFixed(2)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FinanceTracker; 