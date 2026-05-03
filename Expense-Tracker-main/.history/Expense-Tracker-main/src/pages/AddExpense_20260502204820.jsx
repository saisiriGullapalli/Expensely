import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// ── Replace with real Firestore operations ──
// import { collection, addDoc, doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
// import { db } from '../firebase';
// import { getAuth } from 'firebase/auth';

const CATEGORIES = [
  { label: 'Food',          icon: '🍜' },
  { label: 'Travel',        icon: '✈️' },
  { label: 'Utilities',     icon: '⚡' },
  { label: 'Health',        icon: '💊' },
  { label: 'Entertainment', icon: '🎬' },
  { label: 'Other',         icon: '📦' },
];

const styles = `
.add-wrap {
  max-width: 580px;
  margin: 0 auto;
  padding: 2rem;
}
.page-title { font-family: 'DM Serif Display', serif; font-size: 28px; font-weight: 400; letter-spacing: -0.5px; }
.page-sub   { font-size: 14px; color: var(--muted); margin-top: 4px; margin-bottom: 1.75rem; }

.form-block {
  background: #fff;
  border: 1px solid var(--border);
  border-radius: var(--r);
  padding: 1.4rem;
  margin-bottom: 1rem;
}
.block-title {
  font-size: 11px;
  font-weight: 600;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 0.6px;
  margin-bottom: 1rem;
}

/* Amount */
.amount-wrap { position: relative; }
.amount-prefix {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 18px;
  color: var(--muted);
  font-weight: 300;
  pointer-events: none;
}
.amount-input {
  width: 100%;
  padding: 10px 12px 10px 30px;
  border: 1px solid var(--border);
  border-radius: var(--r-sm);
  font-family: 'DM Sans', sans-serif;
  font-size: 24px;
  font-weight: 300;
  background: var(--bg);
  color: var(--text);
  outline: none;
  transition: border 0.15s;
  letter-spacing: -0.5px;
}
.amount-input:focus { border-color: #999; background: #fff; }

/* Category grid */
.cat-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}
.cat-option {
  padding: 10px 6px;
  border: 1px solid var(--border);
  border-radius: var(--r-sm);
  text-align: center;
  cursor: pointer;
  font-family: 'DM Sans', sans-serif;
  font-size: 12px;
  font-weight: 500;
  color: var(--muted);
  background: #fff;
  transition: all 0.15s;
}
.cat-option:hover { border-color: #999; color: var(--text); }
.cat-option.selected { border-color: var(--text); background: var(--text); color: #fff; }
.cat-emoji { font-size: 20px; display: block; margin-bottom: 4px; }

/* Fields */
.fields-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}
.field { display: flex; flex-direction: column; gap: 5px; }
.field.full { grid-column: 1 / -1; }
.field label {
  font-size: 11px;
  font-weight: 600;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 0.6px;
}
.field input, .field select, .field textarea {
  padding: 9px 11px;
  border: 1px solid var(--border);
  border-radius: var(--r-sm);
  font-family: 'DM Sans', sans-serif;
  font-size: 14px;
  background: var(--bg);
  color: var(--text);
  outline: none;
  transition: border 0.15s;
}
.field input:focus, .field select:focus, .field textarea:focus {
  border-color: #999;
  background: #fff;
}
.field textarea { resize: vertical; min-height: 72px; }

/* Actions */
.form-actions { display: flex; gap: 10px; padding-top: 0.25rem; }
.btn-submit {
  padding: 11px 28px;
  background: var(--text);
  color: #fff;
  border: none;
  border-radius: var(--r-sm);
  font-family: 'DM Sans', sans-serif;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: opacity 0.15s;
}
.btn-submit:hover { opacity: 0.82; }
.btn-submit:disabled { opacity: 0.5; cursor: not-allowed; }
.btn-cancel {
  padding: 11px 20px;
  border: 1px solid var(--border);
  border-radius: var(--r-sm);
  background: #fff;
  font-family: 'DM Sans', sans-serif;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  color: var(--text);
  transition: background 0.15s;
}
.btn-cancel:hover { background: var(--bg); }
.success-toast {
  background: var(--green-bg);
  color: var(--green);
  border-radius: var(--r-sm);
  padding: 10px 14px;
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 1rem;
}

@media (max-width: 520px) {
  .fields-grid { grid-template-columns: 1fr; }
  .cat-grid { grid-template-columns: repeat(3, 1fr); }
}
`;

const today = new Date().toISOString().split('T')[0];

export default function AddExpense() {
  const navigate = useNavigate();
  const { id } = useParams(); // present when editing
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    name: '',
    amount: '',
    category: 'Food',
    date: today,
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // ── Load existing data if editing ──
  useEffect(() => {
    if (!isEdit) return;
    const load = async () => {
      // const snap = await getDoc(doc(db, 'expenses', id));
      // if (snap.exists()) setForm(snap.data());
      // DEMO: no-op
    };
    load();
  }, [id, isEdit]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const selectCategory = cat => setForm({ ...form, category: cat });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.amount) return;
    setLoading(true);

    try {
      const payload = {
        ...form,
        amount: parseFloat(form.amount),
        // uid: getAuth().currentUser.uid,
        // createdAt: serverTimestamp(),
      };

      if (isEdit) {
        // await updateDoc(doc(db, 'expenses', id), payload);
        console.log('Updated:', payload);
      } else {
        // await addDoc(collection(db, 'expenses'), payload);
        console.log('Added:', payload);
      }

      setSuccess(true);
      setTimeout(() => navigate('/expenses'), 1200);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="add-wrap">
        <div className="page-title">{isEdit ? 'Edit expense' : 'Add expense'}</div>
        <div className="page-sub">Fill in the details below</div>

        {success && (
          <div className="success-toast">
            ✓ Expense {isEdit ? 'updated' : 'saved'} successfully! Redirecting…
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Amount */}
          <div className="form-block">
            <div className="block-title">Amount</div>
            <div className="amount-wrap">
              <span className="amount-prefix">₹</span>
              <input
                className="amount-input"
                type="number"
                name="amount"
                placeholder="0.00"
                value={form.amount}
                onChange={handleChange}
                min="0"
                step="0.01"
                required
              />
            </div>
          </div>

          {/* Category */}
          <div className="form-block">
            <div className="block-title">Category</div>
            <div className="cat-grid">
              {CATEGORIES.map(({ label, icon }) => (
                <button
                  key={label}
                  type="button"
                  className={`cat-option${form.category === label ? ' selected' : ''}`}
                  onClick={() => selectCategory(label)}
                >
                  <span className="cat-emoji">{icon}</span>
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Details */}
          <div className="form-block">
            <div className="block-title">Details</div>
            <div className="fields-grid">
              <div className="field">
                <label>Description</label>
                <input
                  name="name"
                  type="text"
                  placeholder="e.g. Zomato order"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="field">
                <label>Date</label>
                <input
                  name="date"
                  type="date"
                  value={form.date}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="field full">
                <label>Notes (optional)</label>
                <textarea
                  name="notes"
                  placeholder="Any extra details…"
                  value={form.notes}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={() => navigate('/expenses')}>
              Cancel
            </button>
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? 'Saving…' : isEdit ? 'Update expense' : 'Save expense'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}