import Icon from './Icons';

export default function StatCard({ label, value, trend, trendDirection, icon, color, isInitialLoading }) {
  const trendClass =
    trendDirection === 'up'
      ? 'stat-card__trend--up'
      : trendDirection === 'down'
        ? 'stat-card__trend--down'
        : 'stat-card__trend--neutral';

  return (
    <article className="stat-card">
      <div className={`stat-card__icon-wrap stat-card__icon-wrap--${color}`}>
        <Icon name={icon} />
      </div>
      <div className="stat-card__label">{label}</div>
      <div className="stat-card__value">
        {isInitialLoading ? (
          <span
            aria-hidden="true"
            style={{
              display: 'inline-block',
              width: '60px',
              height: '28px',
              borderRadius: '6px',
              background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 1.4s infinite',
            }}
          />
        ) : (
          value
        )}
      </div>
      <div className={`stat-card__trend ${trendClass}`}>
        {!isInitialLoading && trendDirection === 'up' && <Icon name="trendUp" />}
        {!isInitialLoading && trendDirection === 'down' && <Icon name="trendDown" />}
        {isInitialLoading ? (
          <span
            aria-hidden="true"
            style={{
              display: 'inline-block',
              width: '80px',
              height: '12px',
              borderRadius: '4px',
              background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 1.4s infinite',
            }}
          />
        ) : (
          trend
        )}
      </div>
    </article>
  );
}
