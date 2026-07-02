import { useEffect, useState } from 'react';

const STEPS = [
  { id: 'overview', label: 'Overview' },
  { id: 'tech', label: 'Tech & Features' },
  { id: 'scope', label: 'Scope' },
  { id: 'budget', label: 'Budget' },
  { id: 'description', label: 'Description' },
  { id: 'goals', label: 'Goals' },
  { id: 'review', label: 'Review & Send' },
];

const SERVICES = [
  'Custom Software Development',
  'Web Development',
  'Mobile App Development',
  'Digital Marketing',
  'UI/UX Design',
  'IT Consultancy',
];

const COMPLEXITY = [
  { value: 'Large', desc: 'Long-term, complex builds (e.g. a full SaaS platform)' },
  { value: 'Medium', desc: 'Well-defined projects (e.g. a company website or app)' },
  { value: 'Small', desc: 'Quick, low-complexity tasks (e.g. a landing page)' },
];

const PRICING = ['Fixed Price', 'Monthly Retainer', 'Hourly', 'Not Sure'];
const CURRENCIES = ['USD', 'PKR', 'GBP', 'EUR', 'AED', 'CAD', 'AUD', 'INR'];

const CONTACT_EMAIL = 'info@msakithub.com';

// Renders the AI-generated brief as an editable, multi-step wizard. The final
// step hands the brief to MSAK via a prefilled email (and a copy-to-clipboard
// fallback).
export default function ProjectBriefModal({ draft, onClose, onSave }) {
  const [form, setForm] = useState(() => normalize(draft));
  const [step, setStep] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && close();
    window.addEventListener('keydown', onKey);
    // Lock background scroll while the modal is open.
    const prevHtml = document.documentElement.style.overflow;
    const prevBody = document.body.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.documentElement.style.overflow = prevHtml;
      document.body.style.overflow = prevBody;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form]);

  function close() {
    onSave?.(form);
    onClose();
  }

  const set = (path, value) =>
    setForm((f) => {
      const next = structuredClone(f);
      let node = next;
      const keys = path.split('.');
      for (let i = 0; i < keys.length - 1; i++) node = node[keys[i]];
      node[keys[keys.length - 1]] = value;
      return next;
    });

  const toggleService = (s) =>
    set('services', form.services.includes(s) ? form.services.filter((x) => x !== s) : [...form.services, s]);

  function briefText() {
    const f = form;
    return [
      `PROJECT BRIEF — ${f.title}`,
      ``,
      `Services: ${f.services.join(', ') || '—'}`,
      `Technologies: ${f.technologies.join(', ') || '—'}`,
      `Key features: ${f.features.join(', ') || '—'}`,
      ``,
      `Scope: ${f.scope.complexity || '—'}`,
      `Timeline: ${timeline(f.scope)}`,
      ``,
      `Budget: ${f.budget.pricingType || '—'} · ${f.budget.currency} ${f.budget.estimatedCost || ''}`.trim(),
      f.budget.comments ? `Budget notes: ${f.budget.comments}` : '',
      ``,
      `Description:`,
      f.description || '—',
      ``,
      `Existing assets: ${f.existingAssets || 'None specified'}`,
      ``,
      `Business goal: ${f.goals.businessGoal || '—'}`,
      `Success metric: ${f.goals.successMetric || '—'}`,
      ``,
      `Contact: ${f.contact.name || '—'}${f.contact.company ? ` (${f.contact.company})` : ''} · ${f.contact.email || '—'}`,
    ]
      .filter((l) => l !== undefined)
      .join('\n');
  }

  function sendEmail() {
    onSave?.(form);
    const subject = `Project Brief: ${form.title || 'New enquiry'}`;
    const url = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(briefText())}`;
    window.location.href = url;
  }

  async function copyBrief() {
    try {
      await navigator.clipboard.writeText(briefText());
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* ignore */
    }
  }

  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  return (
    <div className="msak-modal-overlay" onClick={close}>
      <div className="msak-wiz" onClick={(e) => e.stopPropagation()}>
        {/* Sidebar stepper */}
        <aside className="msak-wiz-side">
          <div className="msak-wiz-side-title">PROJECT BRIEF</div>
          <ol className="msak-stepper">
            {STEPS.map((s, i) => (
              <li
                key={s.id}
                className={`msak-step ${i === step ? 'active' : ''} ${i < step ? 'done' : ''}`}
                onClick={() => setStep(i)}
              >
                <span className="msak-step-dot" />
                <span className="msak-step-label">{s.label}</span>
              </li>
            ))}
          </ol>
          <div className="msak-wiz-side-foot">MSAK IT Hub · {CONTACT_EMAIL}</div>
        </aside>

        {/* Main panel */}
        <div className="msak-wiz-main">
          <div className="msak-wiz-head">
            <div className="msak-wiz-count">Step {step + 1} of {STEPS.length}</div>
            <button className="msak-icon-btn" onClick={close} aria-label="Close">✕</button>
          </div>

          <div className="msak-wiz-body">
            {current.id === 'overview' && (
              <Section title="Project overview" sub="A clear title and the MSAK services your project needs.">
                <Label required>Project Title</Label>
                <input className="msak-inp" value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="e.g. E-commerce website for a retail brand" />
                <Label style={{ marginTop: 20 }} required>Which services does this need?</Label>
                <div className="msak-chip-select">
                  {SERVICES.map((s) => (
                    <button type="button" key={s} className={`msak-select-chip ${form.services.includes(s) ? 'on' : ''}`} onClick={() => toggleService(s)}>
                      {s}
                    </button>
                  ))}
                </div>
              </Section>
            )}

            {current.id === 'tech' && (
              <Section title="Technology & features" sub="The stack and the key things this project should do.">
                <Label>Suggested technologies / tools</Label>
                <TagEditor items={form.technologies} placeholder="Add a technology…" onChange={(v) => set('technologies', v)} />
                <Label style={{ marginTop: 20 }}>Key features & deliverables</Label>
                <TagEditor items={form.features} placeholder="Add a feature…" onChange={(v) => set('features', v)} />
              </Section>
            )}

            {current.id === 'scope' && (
              <Section title="Scope & timeline" sub="How big is this, and when would you like it?">
                <Label required>How complex is this project?</Label>
                <RadioCards options={COMPLEXITY} value={form.scope.complexity} onChange={(v) => set('scope.complexity', v)} />
                <div className="msak-two-col">
                  <div>
                    <Label>Preferred Start Date</Label>
                    <input className="msak-inp" value={form.scope.startDate} onChange={(e) => set('scope.startDate', e.target.value)} placeholder="e.g. Next month" />
                  </div>
                  <div>
                    <Label>Target Completion</Label>
                    <input className="msak-inp" value={form.scope.completionDate} onChange={(e) => set('scope.completionDate', e.target.value)} placeholder="e.g. In 3 months" />
                  </div>
                </div>
              </Section>
            )}

            {current.id === 'budget' && (
              <Section title="Budget" sub="A rough idea helps us scope the right solution.">
                <Label required>How would you like to price this?</Label>
                <RadioCards options={PRICING.map((p) => ({ value: p }))} value={form.budget.pricingType} onChange={(v) => set('budget.pricingType', v)} columns={2} />
                <div className="msak-two-col">
                  <div>
                    <Label>Currency</Label>
                    <select className="msak-inp" value={form.budget.currency} onChange={(e) => set('budget.currency', e.target.value)}>
                      {CURRENCIES.map((c) => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <Label>Estimated Budget</Label>
                    <input className="msak-inp" value={form.budget.estimatedCost} onChange={(e) => set('budget.estimatedCost', e.target.value)} placeholder="e.g. $5,000" />
                  </div>
                </div>
                <Label style={{ marginTop: 18 }}>Additional notes on budget</Label>
                <textarea className="msak-inp msak-area" value={form.budget.comments} onChange={(e) => set('budget.comments', e.target.value)} rows={3} />
              </Section>
            )}

            {current.id === 'description' && (
              <Section title="Project details" sub="The more detail you provide, the more accurate our proposal.">
                <Label required>Describe your project</Label>
                <textarea className="msak-inp msak-area msak-tall" value={form.description} onChange={(e) => set('description', e.target.value)} rows={9} />
                <Label style={{ marginTop: 18 }}>Existing assets or materials you can share</Label>
                <textarea className="msak-inp msak-area" value={form.existingAssets} onChange={(e) => set('existingAssets', e.target.value)} rows={3} placeholder="None specified" />
              </Section>
            )}

            {current.id === 'goals' && (
              <Section title="Goals" sub="What does success look like for your business?">
                <Label required>What is the main business goal?</Label>
                <textarea className="msak-inp msak-area" value={form.goals.businessGoal} onChange={(e) => set('goals.businessGoal', e.target.value)} rows={4} />
                <Label style={{ marginTop: 18 }}>How will you measure success?</Label>
                <textarea className="msak-inp msak-area" value={form.goals.successMetric} onChange={(e) => set('goals.successMetric', e.target.value)} rows={4} />
              </Section>
            )}

            {current.id === 'review' && (
              <ReviewStep form={form} set={set} goTo={setStep} />
            )}
          </div>

          {/* Footer nav */}
          <div className="msak-wiz-foot">
            {step > 0 ? (
              <button className="msak-btn ghost" onClick={() => setStep(step - 1)}>Back</button>
            ) : <span />}
            {isLast ? (
              <div className="msak-foot-right">
                <button className="msak-btn ghost" onClick={copyBrief}>{copied ? 'Copied ✓' : 'Copy brief'}</button>
                <button className="msak-btn primary" onClick={sendEmail}>Send brief to MSAK</button>
              </div>
            ) : (
              <button className="msak-btn primary" onClick={() => setStep(step + 1)}>Save &amp; Continue</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Review (final step) --------------------------------------------------
function ReviewStep({ form, set, goTo }) {
  return (
    <Section title="Review & send" sub="Check your brief and add your contact details, then send it to our team.">
      <SummaryCard title="Project Title" onEdit={() => goTo(0)}>
        <p className="msak-strong">{form.title || '—'}</p>
        <div style={{ height: 8 }} />
        <TagList items={form.services} empty="No services selected" />
      </SummaryCard>

      <SummaryCard title="Tech & Features" onEdit={() => goTo(1)}>
        <TagList items={form.technologies} empty="No technologies" />
        <div style={{ height: 8 }} />
        <TagList items={form.features} empty="No features" />
      </SummaryCard>

      <SummaryCard title="Scope & Budget" onEdit={() => goTo(2)}>
        <div className="msak-grid-3">
          <Field label="Size" value={form.scope.complexity} />
          <Field label="Timeline" value={timeline(form.scope)} />
          <Field label="Budget" value={`${form.budget.pricingType || ''} ${form.budget.currency} ${form.budget.estimatedCost || ''}`.trim()} />
        </div>
      </SummaryCard>

      <SummaryCard title="Description" onEdit={() => goTo(4)}>
        <Paragraphs text={form.description} />
        <div className="msak-subfield">
          <span className="msak-sub-label">Existing assets</span>
          <p>{form.existingAssets || 'None specified'}</p>
        </div>
      </SummaryCard>

      <SummaryCard title="Goals" onEdit={() => goTo(5)}>
        <div className="msak-subfield"><span className="msak-sub-label">Business goal</span><p>{form.goals.businessGoal || '—'}</p></div>
        <div className="msak-subfield"><span className="msak-sub-label">Success metric</span><p>{form.goals.successMetric || '—'}</p></div>
      </SummaryCard>

      <h3 className="msak-section-title">Your contact details</h3>
      <div className="msak-card">
        <div className="msak-two-col">
          <div>
            <Label>Full Name</Label>
            <input className="msak-inp" value={form.contact.name} onChange={(e) => set('contact.name', e.target.value)} placeholder="Your name" />
          </div>
          <div>
            <Label>Email</Label>
            <input className="msak-inp" value={form.contact.email} onChange={(e) => set('contact.email', e.target.value)} placeholder="you@company.com" />
          </div>
        </div>
        <Label style={{ marginTop: 14 }}>Company (optional)</Label>
        <input className="msak-inp" value={form.contact.company} onChange={(e) => set('contact.company', e.target.value)} placeholder="Company name" />
      </div>
    </Section>
  );
}

// --- Building blocks ------------------------------------------------------
function Section({ title, sub, children }) {
  return (
    <div className="msak-wiz-section">
      <h2 className="msak-wiz-title">{title}</h2>
      {sub && <p className="msak-wiz-sub">{sub}</p>}
      <div className="msak-wiz-fields">{children}</div>
    </div>
  );
}

function Label({ children, required, style }) {
  return (
    <label className="msak-flabel" style={style}>
      {children} {required && <span className="msak-req">*</span>}
    </label>
  );
}

function RadioCards({ options, value, onChange, columns = 1 }) {
  return (
    <div className={`msak-radio-cards ${columns === 2 ? 'cols-2' : ''}`}>
      {options.map((o) => (
        <button type="button" key={o.value} className={`msak-radio-card ${value === o.value ? 'selected' : ''}`} onClick={() => onChange(o.value)}>
          <span className="msak-radio-mark" />
          <span>
            <span className="msak-radio-title">{o.value}</span>
            {o.desc && <span className="msak-radio-desc">{o.desc}</span>}
          </span>
        </button>
      ))}
    </div>
  );
}

function TagEditor({ items = [], onChange, placeholder }) {
  const [text, setText] = useState('');
  function add() {
    const v = text.trim();
    if (!v || items.includes(v)) return;
    onChange([...items, v]);
    setText('');
  }
  return (
    <div className="msak-tag-editor">
      <div className="msak-tags">
        {items.map((t, i) => (
          <span key={i} className="msak-tag editable">
            {t}
            <button type="button" className="msak-tag-x" onClick={() => onChange(items.filter((_, j) => j !== i))}>×</button>
          </span>
        ))}
      </div>
      <input
        className="msak-tag-input"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); add(); } }}
        onBlur={add}
        placeholder={placeholder}
      />
    </div>
  );
}

function SummaryCard({ title, onEdit, children }) {
  return (
    <section className="msak-card">
      <div className="msak-card-head">
        <h4>{title}</h4>
        <button className="msak-edit-pencil" onClick={onEdit} title="Edit this section">✎</button>
      </div>
      {children}
    </section>
  );
}

function Field({ label, value }) {
  return (
    <div className="msak-field-box">
      <div className="msak-field-label">{label}</div>
      <div className="msak-field-value">{value || '—'}</div>
    </div>
  );
}

function TagList({ items, empty }) {
  if (!Array.isArray(items) || items.length === 0) return <p className="msak-muted">{empty}</p>;
  return <div className="msak-tags">{items.map((t, i) => <span key={i} className="msak-tag">{t}</span>)}</div>;
}

function Paragraphs({ text }) {
  if (!text) return <p className="msak-muted">—</p>;
  return String(text).split(/\n{2,}|\n/).filter(Boolean).map((p, i) => <p key={i}>{p}</p>);
}

function timeline(scope) {
  if (scope.startDate && scope.completionDate) return `${scope.startDate} → ${scope.completionDate}`;
  return scope.startDate || scope.completionDate || '—';
}

// Fill any missing fields so the editor never hits undefined.
function normalize(d = {}) {
  return {
    title: d.title || '',
    services: d.services || [],
    technologies: d.technologies || [],
    features: d.features || [],
    scope: { complexity: '', startDate: '', completionDate: '', ...(d.scope || {}) },
    budget: { pricingType: '', currency: 'USD', estimatedCost: '', comments: '', ...(d.budget || {}) },
    description: d.description || '',
    existingAssets: d.existingAssets || '',
    goals: { businessGoal: '', successMetric: '', ...(d.goals || {}) },
    contact: { name: '', email: '', company: '', ...(d.contact || {}) },
  };
}
