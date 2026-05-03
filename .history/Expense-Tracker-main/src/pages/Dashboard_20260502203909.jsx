import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

// ── Replace with your real Firestore fetch ──
// import { collection, query, where, getDocs } from 'firebase/firestore';
// import { db } from '../firebase';

const SAMPLE_EXPENSES = [
  { id: 1, name: 'Zomato order',      category: 'Food',          amount: 480,  date: '2026-05-01', icon: '🍜' },
  { id: 2, name: 'IndiGo BLR–BOM',   category: 'Travel',        amount: 4200, date: '2026-04-30', icon: '✈️' },
  { id: 3, name: 'MSEB Electricity',  category: 'Utilities',     amount: 1840, date: '2026-04-29', icon: '⚡' },
  { id: 4, name: 'PharmEasy',         category: 'Health',        amount: 620,  date: '2026-04-28', icon: '💊' },
  { id: 5, name: 'Netflix',           category: 'Entertainment', amount: 649,  date: '2026-04-27', icon: '🎬' },
  { id: 6, name: 'D-Mart groceries',  category: 'Food',          amount: 2340, date: '2026-04-26', icon: '🛒' },
  { id: 7, name: 'Rapido',            category: 'Travel',        amount: 85,   date: '2026-04-25', icon: '🛵' },
];

const CATEGORY_COLORS = {
  Food:          { bar: '#BA7517', badge: 'badge-food' },
  Travel:        { bar: '#185FA5', badge: 'badge-travel' },
  Utilities:     { bar: '#0F6E56', badge: 'badge-teal' },
  Health:        { bar: '#3B6D11', badge: 'badge-green' },
  Entertainment: { bar: '#534AB7', badge: 'badge-purple' },
  Other:         { bar: '#7A7870', badge: 'badge-other' },
};

const CATEGORY_ICONS = {
  Food: '🍜', Travel: '✈️', Utilities: '⚡', Health: '💊', Entertainment: '🎬', Other: '📦',
};

const styles = `
.dash-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 12px;
  margin-bottom: 1.75rem;
}
.stat-card {
  background: #fff;
  border: 1px solid var(--border);
  border-radius: var(--r);
  padding: 1.25rem;
}
.stat-label {
  font-size: 11px;
  font-weight: 600;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 0.6px;
  margin-bottom: 8px;
}
.stat-value {
  font-size: 26px;
  font-weight: 300;
  letter-spacing: -1px;
}
.stat-delta {
  font-size: 12px;
  margin-top: 4px;
  font-weight: 500;
  color: var(--green);
}
.stat-delta.neg { color: var(--red); }

.dash-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}
.card {
  background: #fff;
  border: 1px solid var(--border);
  border-radius: var(--r);
  padding: 1.25rem;
}
.card-title {
  font-size: 11px;
  font-weight: 600;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 0.6px;
  margin-bottom: 1rem;
}

.bar-row { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
.bar-label { font-size: 12px; color: var(--muted); width: 72px; }
.bar-track { flex: 1; height: 6px; background: var(--bg); border-radius: 3px; overflow: hidden; }
.bar-fill { height: 100%; border-radius: 3px; transition: width 0.8s ease; }
.bar-amt { font-size: 12px; font-weight: 500; min-width: 56px; text-align: right; }

.txn-list { display: flex; flex-direction: column; gap: 10px; }
.txn-row { display: flex; align-items: center; gap: 10px; }
.txn-icon {
  width: 34px; height: 34px;
  border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  font-size: 16px; flex-shrink: 0;
  background: var(--bg);
}
.txn-name { font-size: 13px; font-weight: 500; }
.txn-cat { font-size: 11px; color: var(--muted); margin-top: 1px; }
.txn-amt { margin-left: auto; font-size: 13px; font-weight: 600; color: var(--red); }

.dash-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 1.75rem;
  flex-wrap: wrap;
  gap: 1rem;
}
.page-title { font-family: 'DM Serif Display', serif; font-size: 28px; font-weight: 400; letter-spacing: -0.5px; }
.page-sub { font-size: 14px; color: var(--muted); margin-top: 4px; }
.btn-outline {
  padding: 8px 16px;
  border: 1px solid var(--border);
  border-radius: var(--r-sm);
  background: #fff;
  font-family: 'DM Sans', sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: var(--text);
  cursor: pointer;
  text-decoration: none;
  display: inline-block;
  transition: background 0.15s;
}
.btn-outline:hover { background: var(--bg); }

@media (max-width: 640px) {
  .dash-grid { grid-template-columns: 1fr; }
  .dash-stats { grid-template-columns: 1fr 1fr; }
}
`;

export default function Dashboard({ user }) {
  const [expenses, setExpenses] = useState(SAMPLE_EXPENSES);

  // ── Uncomment to use real Firestore data ──
  // useEffect(() => {
  //   const fetchExpenses = async () => {
  //     const q = query(collection(db, 'expenses'), where('uid', '==', user.uid));
  //     const snap = await getDocs(q);
  //     setExpenses(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  //   };
  //   fetchExpenses();
  // }, [user]);

  const total = expenses.reduce((s, e) => s + e.amount, 0);
  const budget = 60000;
  const avgPerDay = Math.round(total / 30);

  const byCategory = expenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount;
    return acc;
  }, {});

  const maxCatAmt = Math.max(...Object.values(byCategory));
  const recentFive = [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);
  const firstName = user?.displayName?.split(' ')[0] || 'there';

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <>
      <style>{styles}</style>
      <div className="page">
        <div className="dash-header">
          <div>
            <div className="page-title">{greeting}, {firstName}</div>
            <div className="page-sub">Here's your spending summary for May 2026</div>
          </div>
          <Link to="/add" className="btn-outline">+ Add expense</Link>
        </div>

        <div className="dash-stats">
          <div className="stat-card">
            <div className="stat-label">Total spent</div>
            <div className="stat-value">₹{total.toLocaleString('en-IN')}</div>
            <div className="stat-delta neg">↑ 12% vs last month</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Budget left</div>
            <div className="stat-value">₹{(budget - total).toLocaleString('en-IN')}</div>
            <div className="stat-delta">{Math.round((total / budget) * 100)}% of limit used</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Transactions</div>
            <div className="stat-value">{expenses.length}</div>
            <div className="stat-delta">This month</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Avg per day</div>
            <div className="stat-value">₹{avgPerDay.toLocaleString('en-IN')}</div>
            <div className="stat-delta neg">↑ vs ₹1,200 usual</div>
          </div>
        </div>

        <div className="dash-grid">
          {/* Category breakdown */}
          <div className="card">
            <div className="card-title">By category</div>
            {Object.entries(byCategory)
              .sort((a, b) => b[1] - a[1])
              .map(([cat, amt]) => (
                <div className="bar-row" key={cat}>
                  <span className="bar-label">{cat}</span>
                  <div className="bar-track">
                    <div
                      className="bar-fill"
                      style={{
                        width: `${(amt / maxCatAmt) * 100}%`,
                        background: CATEGORY_COLORS[cat]?.bar || '#7A7870',
                      }}
                    />
                  </div>
                  <span className="bar-amt">₹{amt.toLocaleString('en-IN')}</span>
                </div>
              ))}
          </div>

          {/* Recent transactions */}
          <div className="card">
            <div className="card-title">Recent transactions</div>
            <div className="txn-list">
              {recentFive.map(exp => (
                <div className="txn-row" key={exp.id}>
                  <div className="txn-icon">{exp.icon || CATEGORY_ICONS[exp.category] || '📦'}</div>
                  <div>
                    <div className="txn-name">{exp.name}</div>
                    <div className="txn-cat">{exp.category} · {new Date(exp.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</div>
                  </div>
                  <div className="txn-amt">−₹{exp.amount.toLocaleString('en-IN')}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}