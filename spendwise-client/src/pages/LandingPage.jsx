import { Link, useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleGetStarted = () => {
    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/register");
    }
  };

  return (
    <div className="landing-page">
      <header className="landing-nav">
        <div className="landing-brand">
          <div className="brand-mark">💸</div>
          <div>
            <div className="brand-name">SpendWise</div>
            <div className="brand-subtitle">Smart expense tracking</div>
          </div>
        </div>

        <div className="landing-nav-actions">
          <Link to="/login" className="nav-link-btn secondary-link">
            Log In
          </Link>
          <Link to="/register" className="nav-link-btn primary-link">
            Sign Up
          </Link>
        </div>
      </header>

      <main className="hero-section">
        <div className="hero-left">
          <div className="hero-badge">Analytics-first finance tracker</div>

          <h1 className="hero-title">
            Track spending with clarity,
            <br />
            not spreadsheets.
          </h1>

          <p className="hero-description">
            SpendWise helps you log expenses, analyze categories, monitor
            monthly trends, and stay in control of your money with a modern,
            premium dashboard.
          </p>

          <div className="hero-actions">
            <button className="hero-primary-btn" onClick={handleGetStarted}>
              {user ? "Open Dashboard" : "Get Started"}
            </button>

            <Link to="/login" className="hero-secondary-btn">
              View Demo Flow
            </Link>
          </div>

          <div className="hero-stats">
            <div className="hero-stat-card">
              <div className="hero-stat-value">JWT</div>
              <div className="hero-stat-label">Secure auth</div>
            </div>

            <div className="hero-stat-card">
              <div className="hero-stat-value">Charts</div>
              <div className="hero-stat-label">Analytics dashboard</div>
            </div>

            <div className="hero-stat-card">
              <div className="hero-stat-value">CRUD</div>
              <div className="hero-stat-label">Manage expenses</div>
            </div>
          </div>
        </div>

        <div className="hero-right">
          <div className="hero-dashboard-preview">
            <div className="preview-topbar">
              <div className="preview-dots">
                <span />
                <span />
                <span />
              </div>
              <div className="preview-title">SpendWise Dashboard</div>
            </div>

            <div className="preview-grid">
              <div className="preview-card preview-card-large">
                <div className="preview-card-label">Total Spent</div>
                <div className="preview-card-value">$1,284.40</div>
                <div className="preview-line-chart">
                  <div className="line-segment line-1"></div>
                  <div className="line-segment line-2"></div>
                  <div className="line-segment line-3"></div>
                  <div className="line-segment line-4"></div>
                </div>
              </div>

              <div className="preview-card">
                <div className="preview-card-label">Top Category</div>
                <div className="preview-pill">🍔 Food</div>
              </div>

              <div className="preview-card">
                <div className="preview-card-label">Transactions</div>
                <div className="preview-card-value small">32</div>
              </div>

              <div className="preview-card preview-list-card">
                <div className="preview-card-label">Recent Expenses</div>

                <div className="preview-list-item">
                  <span className="preview-tag food">🍔 Food</span>
                  <span>$14.50</span>
                </div>

                <div className="preview-list-item">
                  <span className="preview-tag transport">🚗 Transport</span>
                  <span>$8.20</span>
                </div>

                <div className="preview-list-item">
                  <span className="preview-tag shopping">🛍️ Shopping</span>
                  <span>$59.99</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <section className="features-section">
        <div className="feature-card">
          <div className="feature-icon">📊</div>
          <h3>Visual Analytics</h3>
          <p>
            Understand your spending through monthly trends and category
            breakdowns.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">✍️</div>
          <h3>Fast Expense Logging</h3>
          <p>
            Add, edit, delete, and organize expenses with a clean and responsive
            interface.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">🔐</div>
          <h3>Secure by Default</h3>
          <p>
            Built with JWT authentication and protected API routes for each
            user.
          </p>
        </div>
      </section>

      <section className="cta-section">
        <div className="cta-card">
          <h2>Start tracking your money smarter</h2>
          <p>
            Build better spending habits with a dashboard designed for clarity.
          </p>
          <div className="cta-actions">
            <Link to="/register" className="nav-link-btn primary-link">
              Create Account
            </Link>
            <Link to="/login" className="nav-link-btn secondary-link">
              Log In
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
