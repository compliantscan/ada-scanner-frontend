import Icon from './Icons';
import { planFeatures } from './mockData';

export default function PlanCard() {
  return (
    <section className="plan-card">
      <span className="plan-card__badge">Founding Agency Plan</span>

      <div className="plan-card__price">
        <span className="plan-card__price-amount">$199</span>
        <span className="plan-card__price-period">/month</span>
      </div>

      <ul className="plan-card__features">
        {planFeatures.map((feature) => (
          <li key={feature} className="plan-card__feature">
            <span className="plan-card__check">
              <Icon name="check" />
            </span>
            {feature}
          </li>
        ))}
      </ul>

      <div className="plan-card__illustration" aria-hidden="true">
        <div className="plan-card__illus-card plan-card__illus-card--1">
          Executive Report
          <div className="plan-card__illus-bar" />
          <div className="plan-card__illus-bar plan-card__illus-bar--short" />
        </div>
        <div className="plan-card__illus-card plan-card__illus-card--2">
          Developer Report
          <div className="plan-card__illus-bar" />
          <div className="plan-card__illus-bar plan-card__illus-bar--short" />
        </div>
        <div className="plan-card__illus-card plan-card__illus-card--3">
          Shareable Link
        </div>
      </div>

      <button type="button" className="plan-card__cta">
        Upgrade to Founding Plan
      </button>
    </section>
  );
}
