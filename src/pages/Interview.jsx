import { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const roles = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "DSA / Problem Solving",
  "System Design",
];

export default function Interview() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState("setup");
  const [selectedRole, setSelectedRole] = useState("");
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [allAnswers, setAllAnswers] = useState([]);
  const [loading, setLoading] = useState(false);

  // This function builds headers fresh every time using latest token
  function getHeaders() {
    return { Authorization: `Bearer ${token}` };
  }

  async function startInterview() {
    if (!selectedRole) return;
    setLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/interview/generate`,
        { role: selectedRole },
        { headers: getHeaders() }
      );
      setQuestions(res.data.questions);
      setCurrentQ(0);
      setAllAnswers([]);
      setAnswer("");
      setFeedback(null);
      setStep("interview");
    } catch (err) {
      console.error("Generate error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to generate questions.");
    } finally {
      setLoading(false);
    }
  }

  async function submitAnswer() {
    if (!answer.trim()) return;
    setLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/interview/evaluate`,
        { question: questions[currentQ], answer, role: selectedRole },
        { headers: getHeaders() }
      );
      setFeedback(res.data);
    } catch (err) {
      console.error("Evaluate error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to evaluate answer.");
    } finally {
      setLoading(false);
    }
  }

  async function nextQuestion() {
    const saved = [
      ...allAnswers,
      { question: questions[currentQ], answer, ...feedback },
    ];
    setAllAnswers(saved);

    if (currentQ + 1 >= questions.length) {
      try {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/interview/save`,
          { role: selectedRole, questions: saved },
          { headers: getHeaders() }
        );
      } catch (err) {
        console.error("Save error:", err.message);
      }
      setStep("done");
    } else {
      setCurrentQ(currentQ + 1);
      setAnswer("");
      setFeedback(null);
    }
  }

  const avgScore =
    allAnswers.length
      ? Math.round(allAnswers.reduce((s, a) => s + a.score, 0) / allAnswers.length)
      : 0;

  // ── SETUP SCREEN ──────────────────────────────────────────
  if (step === "setup") {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-12 col-md-7 col-lg-6">
            <h4 className="fw-bold mb-1">Choose a role</h4>
            <p className="text-muted mb-4" style={{ fontSize: "0.9rem" }}>
              Pick the role you're preparing for and we'll generate questions for you.
            </p>

            <div className="d-flex flex-column gap-2 mb-4">
              {roles.map((role) => (
                <div
                  key={role}
                  onClick={() => setSelectedRole(role)}
                  className="card p-3 d-flex flex-row align-items-center justify-content-between"
                  style={{
                    cursor: "pointer",
                    border: selectedRole === role ? "2px solid #7c6ff7" : "1px solid #e9ecef",
                    background: selectedRole === role ? "#f5f3ff" : "#fff",
                    borderRadius: 10,
                    transition: "all 0.15s",
                  }}
                >
                  <span className="fw-medium">{role}</span>
                  {selectedRole === role && (
                    <span style={{ color: "#7c6ff7", fontWeight: 700 }}>✓</span>
                  )}
                </div>
              ))}
            </div>

            <button
              className="btn btn-primary w-100 py-2"
              onClick={startInterview}
              disabled={!selectedRole || loading}
            >
              {loading
                ? "Generating questions..."
                : selectedRole
                ? `Start — ${selectedRole}`
                : "Select a role first"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── INTERVIEW SCREEN ──────────────────────────────────────
  if (step === "interview") {
    const progress = Math.round(((currentQ + 1) / questions.length) * 100);

    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-7">

            {/* Progress */}
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="text-muted" style={{ fontSize: "0.85rem" }}>
                Question {currentQ + 1} of {questions.length}
              </span>
              <span className="badge-role">{selectedRole}</span>
            </div>
            <div className="progress mb-4">
              <div className="progress-bar" style={{ width: `${progress}%` }} />
            </div>

            {/* Question card */}
            <div className="card p-4 mb-4 shadow-sm">
              <p
                className="text-muted mb-1"
                style={{ fontSize: "0.78rem", fontWeight: 600, letterSpacing: "0.5px" }}
              >
                QUESTION {currentQ + 1}
              </p>
              <p className="mb-0 fw-medium" style={{ fontSize: "1.05rem", lineHeight: 1.6 }}>
                {questions[currentQ]}
              </p>
            </div>

            {/* Answer input */}
            {!feedback && (
              <>
                <textarea
                  className="form-control mb-3"
                  rows={5}
                  placeholder="Write your answer here..."
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  style={{ resize: "vertical", fontSize: "0.95rem" }}
                />
                <button
                  className="btn btn-primary w-100 py-2"
                  onClick={submitAnswer}
                  disabled={!answer.trim() || loading}
                >
                  {loading ? "Evaluating your answer..." : "Submit Answer"}
                </button>
              </>
            )}

            {/* Feedback */}
            {feedback && (
              <div className="card p-4 shadow-sm">
                <div className="d-flex align-items-center gap-3 mb-3">
                  <div className="score-circle">{feedback.score}</div>
                  <div>
                    <div className="fw-semibold">Score: {feedback.score} / 10</div>
                    <div className="text-muted" style={{ fontSize: "0.85rem" }}>
                      AI Evaluation
                    </div>
                  </div>
                </div>

                <p
                  className="text-muted mb-4"
                  style={{ fontSize: "0.92rem", lineHeight: 1.7 }}
                >
                  {feedback.feedback}
                </p>

                <div className="row g-3 mb-4">
                  <div className="col-12 col-sm-6">
                    <div className="strength-box">
                      <p
                        className="fw-semibold text-success mb-2"
                        style={{ fontSize: "0.8rem" }}
                      >
                        ✓ STRENGTHS
                      </p>
                      {feedback.strengths?.map((s, i) => (
                        <p key={i} className="mb-1" style={{ fontSize: "0.88rem" }}>
                          • {s}
                        </p>
                      ))}
                    </div>
                  </div>
                  <div className="col-12 col-sm-6">
                    <div className="improve-box">
                      <p
                        className="fw-semibold text-warning mb-2"
                        style={{ fontSize: "0.8rem" }}
                      >
                        ↑ IMPROVE
                      </p>
                      {feedback.improve?.map((s, i) => (
                        <p key={i} className="mb-1" style={{ fontSize: "0.88rem" }}>
                          • {s}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>

                <button className="btn btn-primary w-100 py-2" onClick={nextQuestion}>
                  {currentQ + 1 >= questions.length
                    ? "View Final Report"
                    : "Next Question →"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── DONE SCREEN ───────────────────────────────────────────
  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-7 col-lg-6 text-center">
          <div style={{ fontSize: "3rem", marginBottom: 16 }}>🎉</div>
          <h4 className="fw-bold mb-2">Interview Complete!</h4>
          <p className="text-muted mb-4">
            You finished the <strong>{selectedRole}</strong> interview.
          </p>

          <div className="row g-3 mb-4">
            {[
              { label: "Avg Score", value: `${avgScore} / 10`, color: "#7c6ff7" },
              { label: "Questions", value: questions.length, color: "#22c55e" },
              { label: "Answered", value: allAnswers.length, color: "#f97316" },
            ].map((s, i) => (
              <div className="col-4" key={i}>
                <div className="card p-3 shadow-sm">
                  <div
                    className="fw-bold"
                    style={{ fontSize: "1.5rem", color: s.color }}
                  >
                    {s.value}
                  </div>
                  <div className="text-muted" style={{ fontSize: "0.82rem" }}>
                    {s.label}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="d-flex gap-3 justify-content-center flex-wrap">
            <button
              className="btn btn-primary px-4"
              onClick={() => {
                setStep("setup");
                setSelectedRole("");
                setAllAnswers([]);
                setFeedback(null);
              }}
            >
              Try Again
            </button>
            <button
              className="btn btn-outline-secondary px-4"
              onClick={() => navigate("/dashboard")}
            >
              View Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}