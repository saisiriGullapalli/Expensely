import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

// ── Replace with real Firestore fetch ──
// import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
// import { db } from '../firebase';
// import { getAuth } from 'firebase/auth';

const SAMPLE_EXPENSES = [
  { id: '1', name: 'Zomato order',     category: 'Food',          amount: 480,  date: '2026-05-01' },
  { id: '2', name: 'IndiGo BLR–BOM',  category: 'Travel',        amount: 4200, date: '2026-04-30' },
  { id: '3', name: 'MSEB Electricity', category: 'Utilities',     amount: 1840, date: '2026-04-29' },
  { id: '4', name: 'PharmEasy',        category: 'Health',        amount: 620,  date: '2026-04-28' },
  { id: '5', name: 'Netflix',          category: 'Entertainment', amount: 649,  date: '2026-04-27' },
  { id: '6', name: 'D-Mart groceries', category: 'Food',          amount: 2340, date: '2026-04-26' },
  { id: '7', name: 'Rapido',           category: 'Travel',        amount: 85,   date: '2026-04-25' },
  { id: '8', name: 'Jio recharge',     category: 'Utilities',     amount: 299,  date: '2026-04-24' },
  { id: '9', name: 'Swiggy order',     category: 'Food',          amount: 340,  date: '2026-04-23' },
];

const CATEGORIES = ['All', 'Food', 'Travel', 'Utilities', 'Health', 'Entertainment'];

const BADGE_CLASS = {
  Food: 'badge-food',
  Travel: 'badge-travel',
  Utilities: 'badge-teal',
  Health: 'badge-green',
  Entertainment: 'badge-purple',
};

const styles = `
.exp-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
}
.page-title { font-family: 'DM Serif Display', serif; font-size: 28px; font-weight: 400; letter-spacing: -0.5px; }
.page-sub { font-size: 14px; color: var(--muted); margin-top: 4px; }

.btn-dark {
  padding: 9px 16px;
  background: var(--text);
  color: #fff;
  border: none;
  border-radius: var(--r-sm);
  font-family: 'DM Sans', sans-serif;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  text-decoration: none;
  display: inline-block;
  transition: opacity 0.15s;
}
.btn-dark:hover { opacity: 0.8; }

.toolbar {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 1.25rem;
  flex-wrap: wrap;
}
.search-input {
  flex: 1;
  min-width: 180px;
  padding: 9px 12px;
  border: 1px solid var(--border);
  border-radius: var(--r-sm);
  font-family: 'DM Sans', sans-serif;
  font-size: 13px;
  background: #fff;
  color: var(--text);
  outline: none;
  transition: border 0.15s;
}
.search-input:focus { border-color: #999; }
.filter-pill {
  padding: 7px 13px;
  border: 1px solid var(--border);
  border-radius: 20px;
  background: #fff;
  font-family: 'DM Sans', sans-serif;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  color: var(--muted);
  transition: all 0.15s;
  white-space: nowrap;
}
.filter-pill.active {
  background: var(--text);
  color: #fff;
  border-color: var(--text);
}

.table-card {
  background: #fff;
  border: 1px solid var(--border);
  border-radius: var(--r);
  overflow: hidden;
}
table { width: 100%; border-collapse: collapse; }
thead th {
  font-size: 11px;
  font-weight: 600;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 10px 14px;
  border-bottom: 1px solid var(--border);
  text-align: left;
  background: #FAFAF8;
}
tbody td {
  padding: 11px 14px;
  border-bottom: 1px solid var(--border);
  font-size: 13px;
  vertical-align: middle;
}
tbody tr:last-child td { border-bottom: none; }
tbody tr { transition: background 0.1s; }
tbody tr:hover td { background: #FAFAF8; }

.expense-name { font-weight: 500; }
.expense-date { color: var(--muted); }
.expense-amt { font-weight: 600; color: var(--red); }

.badge {
  display: inline-block;
  padding: 3px 9px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 500;
}
.badge-food    { background: var(--amber-bg); color: var(--amber); }
.badge-travel  { background: var(--blue-bg);  color: var(--blue);  }
.badge-teal    { background: var(--teal-bg);  color: var(--teal);  }
.badge-green   { background: var(--green-bg); color: var(--green); }
.badge-purple  { background: var(--purple-bg);color: var(--purple);}
.badge-other   { background: #F2F2F0; color: var(--muted); }

.row-actions { display: flex; gap: 6px; opacity: 0; transition: opacity 0.15s; }
tbody tr:hover .row-actions { opacity: 1; }
.icon-btn {
  width: 27px; height: 27px;
  border: 1px solid var(--border);
  border-radius: 6px;
  background: #fff;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  font-size: 12px;
  transition: background 0.1s;
}
.icon-btn:hover { background: var(--bg); }

.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  color: var(--muted);
}
.empty-icon { font-size: 2rem; margin-bottom: 0.5rem; }
.empty-title { font-size: 15px; font-weight: 500; color: var(--text); margin-bottom: 4px; }

@media (max-width: 600px) {
  .col-date, .col-actions { display: none; }
}
`;

export default function Expenses() {
  const [expenses, setExpenses] = useState(SAMPLE_EXPENSES);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  // ── Uncomment for Firestore ──
  // useEffect(() => {
  //   const uid = getAuth().currentUser?.uid;
  //   const fetch = async () => {
  //     const q = query(collection(db, 'expenses'), where('uid', '==', uid));
  //     const snap = await getDocs(q);
  //     setExpenses(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  //   };
  //   fetch();
  // }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this expense?')) return;
    // await deleteDoc(doc(db, 'expenses', id));
    setExpenses(prev => prev.filter(e => e.id !== id));
  };

  const filtered = expenses.filter(e => {
    const matchSearch = e.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = activeFilter === 'All' || e.category === activeFilter;
    return matchSearch && matchCat;
  });

  const totalFiltered = filtered.reduce((s, e) => s + e.amount, 0);

  return (
    <>
      <style>{styles}</style>
      <div className="page">
        <div className="exp-header">
          <div>
            <div className="page-title">All Expenses</div>
            <div className="page-sub">
              {filtered.length} transaction{filtered.length !== 1 ? 's' : ''} · ₹{totalFiltered.toLocaleString('en-IN')} total
            </div>
          </div>
          <Link to="/add" className="btn-dark">+ Add new</Link>
        </div>

        <div className="toolbar">
          <input
            className="search-input"
            placeholder="Search by name or category…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              className={`filter-pill${activeFilter === cat ? ' active' : ''}`}
              onClick={() => setActiveFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="table-card">
          <table>
            <thead>
              <tr>
                <th>Description</th>
                <th>Category</th>
                <th className="col-date">Date</th>
                <th>Amount</th>
                <th className="col-actions"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5}>
                    <div className="empty-state">
                      <div className="empty-icon">🔍</div>
                      <div className="empty-title">No expenses found</div>
                      <div>Try a different search or filter</div>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered
                  .sort((a, b) => new Date(b.date) - new Date(a.date))
                  .map(exp => (
                    <tr key={exp.id}>
                      <td><span className="expense-name">{exp.name}</span></td>
                      <td>
                        <span className={`badge ${BADGE_CLASS[exp.category] || 'badge-other'}`}>
                          {exp.category}
                        </span>
                      </td>
                      <td className="col-date expense-date">
                        {new Date(exp.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="expense-amt">−₹{exp.amount.toLocaleString('en-IN')}</td>
                      <td className="col-actions">
                        <div className="row-actions">
                          <Link to={`/edit/${exp.id}`} className="icon-btn" title="Edit">✏️</Link>
                          <button className="icon-btn" title="Delete" onClick={() => handleDelete(exp.id)}>🗑️</button>
                        </div>
                      </td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}