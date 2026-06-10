import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { token, user } = useAuth();
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/interview/my`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setInterviews(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const totalSessions = interviews.length;
  const avgScore = totalSessions
    ? (interviews.reduce((s, i) => s + i.avgScore, 0) / totalSessions).toFixed(1)
    : 0;
  const totalQuestions = interviews.reduce((s, i) => s + i.questions.length, 0);

  function scoreColor(score) {
    if (score >= 7) return "#22c55e";
    if (score >= 5) return "#f97316";
    return "#ef4444";
  }

  function timeAgo(dateStr) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    return `${days} days ago`;
  }

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h4 className="fw-bold mb-1">Your Progress</h4>
          <p className="text-muted mb-0" style={{ fontSize: "0.9rem" }}>
            Hi {user?.name}, here's how you've been doing.
          </p>
        </div>
        <Link to="/interview" className="btn btn-primary px-4">
          New Interview
        </Link>
      </div>

      {/* Stats */}
      <div className="row g-3 mb-5">
        {[
          { label: "Total Sessions", value: totalSessions, color: "#7c6ff7" },
          { label: "Avg Score", value: `${avgScore} / 10`, color: "#22c55e" },
          { label: "Questions Done", value: totalQuestions, color: "#f97316" },
        ].map((s, i) => (
          <div className="col-6 col-md-4" key={i}>
            <div className="card p-4 shadow-sm text-center">
              <div className="fw-bold mb-1" style={{ fontSize: "1.8rem", color: s.color }}>
                {s.value}
              </div>
              <div className="text-muted" style={{ fontSize: "0.85rem" }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Sessions list */}
      <h6 className="text-muted fw-semibold mb-3" style={{ letterSpacing: "0.5px" }}>
        RECENT SESSIONS
      </h6>

      {loading ? (
        <p className="text-muted">Loading...</p>
      ) : interviews.length === 0 ? (
        <div className="card p-5 text-center shadow-sm">
          <p className="text-muted mb-3">You haven't done any interviews yet.</p>
          <Link to="/interview" className="btn btn-primary px-4">
            Start Your First Interview
          </Link>
        </div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {interviews.map((iv) => (
            <div
              key={iv._id}
              className="card p-3 shadow-sm d-flex flex-row align-items-center justify-content-between flex-wrap gap-2"
            >
              <div>
                <div className="fw-semibold mb-1">{iv.role}</div>
                <div className="text-muted" style={{ fontSize: "0.83rem" }}>
                  {timeAgo(iv.createdAt)} · {iv.questions.length} questions
                </div>
              </div>
              <div className="text-end">
                <div className="fw-bold" style={{ fontSize: "1.4rem", color: scoreColor(iv.avgScore) }}>
                  {iv.avgScore} / 10
                </div>
                <div className="text-muted" style={{ fontSize: "0.8rem" }}>avg score</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}