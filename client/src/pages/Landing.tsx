import { useNavigate } from 'react-router-dom';
import { Brain, CheckSquare, FileText, MessageSquareText, Video, Star, Clock, ArrowUpRight } from 'lucide-react';
import './Landing.css';

const Landing = () => {
  const navigate = useNavigate();

  const rooms = [
    { icon: CheckSquare, label: 'Tasks', desc: 'priorities, due dates, focus' },
    { icon: FileText, label: 'Notes', desc: 'drafts, ideas, references' },
    { icon: MessageSquareText, label: 'Tweets', desc: 'threads worth re-reading' },
    { icon: Video, label: 'Videos', desc: 'lectures and longreads' },
    { icon: Star, label: 'Favorites', desc: 'the canon, all in one place' },
    { icon: Clock, label: 'Activity', desc: 'a quiet record of work' },
  ];

  return (
    <div className="landing">
      {/* ===== NAVBAR ===== */}
      <nav className="landing-nav">
        <div className="landing-nav-inner">
          <div className="landing-logo" onClick={() => navigate('/')}>
            <div className="landing-logo-icon">
              <Brain size={20} />
            </div>
            <span className="landing-logo-text">Second Brain</span>
          </div>
          <div className="landing-nav-links">
            <a href="#features" className="landing-nav-link">Features</a>
            <a href="#philosophy" className="landing-nav-link">Philosophy</a>
            <a href="#faq" className="landing-nav-link">FAQ</a>
          </div>
          <button className="btn-primary landing-nav-cta" onClick={() => navigate('/login')}>
            Open app <ArrowUpRight size={14} />
          </button>
        </div>
      </nav>

      {/* ===== HERO ===== */}
      <section className="landing-hero">
        <div className="landing-hero-inner">
          <div className="landing-hero-left">
            <p className="landing-hero-tag">AN ARCHIVE FOR THINKING · EST. 2026</p>
            <h1 className="heading-serif landing-hero-title">
              A quieter place<br />
              for the things<br />
              <em>you keep returning<br />to.</em>
            </h1>
          </div>
          <div className="landing-hero-right">
            <p className="landing-hero-desc">
              Tasks, notes, tweets, lectures —<br />
              gathered into one calm desk you<br />
              actually want to open in the<br />
              morning.
            </p>
            <div className="landing-hero-actions">
              <button className="btn-accent" onClick={() => navigate('/login')}>
                Enter the desk <ArrowUpRight size={16} />
              </button>
              <a href="#features" className="landing-hero-see">
                See what's inside
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ===== PREVIEW WINDOW ===== */}
      <section className="landing-preview">
        <div className="landing-preview-inner">
          <div className="preview-window">
            <div className="preview-titlebar">
              <div className="preview-dots">
                <span className="dot dot-r"></span>
                <span className="dot dot-y"></span>
                <span className="dot dot-g"></span>
              </div>
              <span className="preview-path">second-brain / today</span>
            </div>
            <div className="preview-body">
              <div className="preview-col">
                <h4 className="preview-col-title">TASKS</h4>
                <div className="preview-item">
                  <span className="preview-dot preview-dot--red"></span>
                  <span>Outline the essay</span>
                </div>
                <div className="preview-item">
                  <span className="preview-dot preview-dot--empty"></span>
                  <span>Reply to Mira</span>
                </div>
                <div className="preview-item">
                  <span className="preview-dot preview-dot--empty"></span>
                  <span>Renew library card</span>
                </div>
              </div>
              <div className="preview-col preview-col--border">
                <h4 className="preview-col-title">NOTE</h4>
                <h3 className="preview-note-title">On slow software.</h3>
                <p className="preview-note-text">
                  The good tools wait. They don't tug at the sleeve. They sit on the table until the hand reaches for them — patient, useful, near.
                </p>
              </div>
              <div className="preview-col preview-col--border">
                <h4 className="preview-col-title">SAVED</h4>
                <div className="preview-saved-item">
                  <span className="preview-saved-icon preview-saved-icon--red">▶</span>
                  <span>Lecture:&nbsp; <em>Memory & form</em></span>
                </div>
                <div className="preview-saved-item">
                  <span className="preview-saved-icon preview-saved-icon--pink">♡</span>
                  <span>Thread on attention as currency</span>
                </div>
                <div className="preview-saved-item">
                  <span className="preview-saved-icon preview-saved-icon--tan">📄</span>
                  <span>Draft: letter to a future self</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SIX ROOMS ===== */}
      <section className="landing-rooms" id="features">
        <div className="landing-rooms-inner">
          <div className="landing-rooms-header">
            <h2 className="heading-serif landing-rooms-title">
              Six rooms.<br />
              <em>One desk.</em>
            </h2>
            <p className="landing-rooms-desc">
              Each module is a small, well-lit room. Walk in, do the one thing, walk back out. No dashboards demanding your attention.
            </p>
          </div>
          <div className="rooms-grid">
            {rooms.map((room) => (
              <div key={room.label} className="room-card">
                <div className="room-icon">
                  <room.icon size={20} />
                </div>
                <h3 className="room-label">{room.label}</h3>
                <p className="room-desc">{room.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PHILOSOPHY ===== */}
      <section className="landing-philosophy" id="philosophy">
        <div className="landing-philosophy-inner">
          <p className="philosophy-label">PHILOSOPHY</p>
          <blockquote className="heading-serif philosophy-quote">
            "We shape our tools, and thereafter our tools shape us."
          </blockquote>
          <p className="philosophy-attr">— after McLuhan</p>
          <p className="philosophy-text">
            Second Brain is built for the long read, the slow draft, the idea you'll come back to next March. It tries to be small enough to forget you're using it, and present enough to be useful when you do.
          </p>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="landing-cta">
        <div className="landing-cta-inner">
          <h2 className="heading-serif landing-cta-title">
            Begin a habit<br />
            <em>worth keeping.</em>
          </h2>
          <button className="btn-secondary landing-cta-btn" onClick={() => navigate('/login')}>
            Open the app <ArrowUpRight size={14} />
          </button>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="landing-footer">
        <div className="landing-footer-inner">
          <span className="footer-brand">Second Brain</span>
          <span className="footer-copy">© 2026 — built quietly.</span>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
