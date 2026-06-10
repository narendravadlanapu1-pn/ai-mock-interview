import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { user } = useAuth();

  return (
    <div>
      {/* Hero */}
      <section className="py-5" style={{ background: "linear-gradient(135deg, #f0edff 0%, #fafafa 100%)" }}>
        <div className="container text-center py-4">
          <span className="badge bg-light text-primary border mb-3 px-3 py-2" style={{ fontSize: "0.8rem" }}>
            AI-Powered Interview Prep
          </span>
          <h1 className="fw-bold mb-3 hero-title" style={{ fontSize: "2.6rem", lineHeight: 1.2 }}>
            Practice interviews.<br />Get real feedback.
          </h1>
          <p className="text-muted mx-auto mb-4" style={{ maxWidth: 480, fontSize: "1rem", lineHeight: 1.7 }}>
            Answer role-specific questions, get scored by AI, and track your progress — all in one place.
          </p>
          <div className="d-flex gap-3 justify-content-center flex-wrap">
            <Link
              to={user ? "/interview" : "/register"}
              className="btn btn-primary px-4 py-2"
            >
              Start Practicing
            </Link>
            {!user && (
              <Link to="/login" className="btn btn-outline-secondary px-4 py-2">
                Login
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-5">
        <div className="container">
          <div className="row g-4">
            {[
              {
                icon: "🤖",
                title: "AI-Generated Questions",
                desc: "Questions are tailored to the role you're preparing for — no generic lists.",
              },
              {
                icon: "📊",
                title: "Instant Feedback",
                desc: "Every answer gets a score and clear feedback so you know where to improve.",
              },
              {
                icon: "📈",
                title: "Track Your Progress",
                desc: "See all your past sessions and how your scores change over time.",
              },
            ].map((f, i) => (
              <div className="col-md-4" key={i}>
                <div className="card h-100 p-4 text-center shadow-sm">
                  <div style={{ fontSize: "2rem", marginBottom: 12 }}>{f.icon}</div>
                  <h5 className="fw-semibold mb-2">{f.title}</h5>
                  <p className="text-muted mb-0" style={{ fontSize: "0.9rem", lineHeight: 1.6 }}>
                    {f.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-5 bg-light">
        <div className="container">
          <h2 className="fw-bold text-center mb-5">How it works</h2>
          <div className="row g-4">
            {[
              { step: "1", title: "Pick a role", desc: "Choose the job role you're preparing for." },
              { step: "2", title: "Answer questions", desc: "AI gives you 5 questions one by one." },
              { step: "3", title: "Get feedback", desc: "Each answer is scored and explained." },
              { step: "4", title: "Review & improve", desc: "Check your dashboard to track progress." },
            ].map((s, i) => (
              <div className="col-6 col-md-3" key={i}>
                <div className="card p-4 text-center shadow-sm h-100">
                  <div
                    className="mx-auto mb-3 d-flex align-items-center justify-content-center fw-bold"
                    style={{
                      width: 40, height: 40, borderRadius: "50%",
                      background: "#e8e4ff", color: "#5b4fcf", fontSize: "1rem",
                    }}
                  >
                    {s.step}
                  </div>
                  <h6 className="fw-semibold mb-1">{s.title}</h6>
                  <p className="text-muted mb-0" style={{ fontSize: "0.85rem" }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-4 text-muted border-top" style={{ fontSize: "0.85rem" }}>
        Built with ❤️ using MERN + Gemini AI
      </footer>
    </div>
  );
}