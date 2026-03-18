import { useEffect, useMemo, useState } from "react";
import "./App.css";

type Emotion =
  | "Happy"
  | "Angry"
  | "Sad"
  | "Silly"
  | "Tired"
  | "Overwhelmed";

type EmotionCounts = Record<Emotion, number>;

const defaultCounts: EmotionCounts = {
  Happy: 0,
  Angry: 0,
  Sad: 0,
  Silly: 0,
  Tired: 0,
  Overwhelmed: 0,
};

const emotionColors: Record<Emotion, string> = {
  Happy: "#FFD93D",
  Angry: "#FF6B6B",
  Sad: "#4D96FF",
  Silly: "#6BCB77",
  Tired: "#9D79F2",
  Overwhelmed: "#FF8CC6",
};

function App() {
  const [counts, setCounts] = useState<EmotionCounts>(defaultCounts);

  useEffect(() => {
    const saved = localStorage.getItem("emotionCounts");
    const savedDate = localStorage.getItem("emotionCountsDate");
    const today = new Date().toDateString();

    if (saved && savedDate === today) {
      setCounts(JSON.parse(saved));
    } else {
      localStorage.setItem("emotionCountsDate", today);
      localStorage.setItem("emotionCounts", JSON.stringify(defaultCounts));
      setCounts(defaultCounts);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("emotionCounts", JSON.stringify(counts));
    localStorage.setItem("emotionCountsDate", new Date().toDateString());
  }, [counts]);

  const addEmotion = (emotion: Emotion) => {
    setCounts((prev) => ({
      ...prev,
      [emotion]: prev[emotion] + 1,
    }));
  };

  const resetToday = () => {
    const ok = window.confirm("Clear all emotion counts for today?");
    if (!ok) return;

    setCounts(defaultCounts);
    localStorage.setItem("emotionCounts", JSON.stringify(defaultCounts));
    localStorage.setItem("emotionCountsDate", new Date().toDateString());
  };

  const total = useMemo(() => {
    return Object.values(counts).reduce((sum, value) => sum + value, 0);
  }, [counts]);

  const maxCount = useMemo(() => {
    const max = Math.max(...Object.values(counts));
    return max === 0 ? 1 : max;
  }, [counts]);

  const emotionList: Emotion[] = [
    "Happy",
    "Angry",
    "Sad",
    "Silly",
    "Tired",
    "Overwhelmed",
  ];

  return (
    <div className="app">
      <header className="hero">
        <div className="hero-badge">Prototype Emotion Website</div>
        <h1>Emotion Tracker</h1>
        <p>
          A fun dashboard that shows which emotions were chosen throughout the day.
        </p>
      </header>

      <section className="top-cards">
        <div className="big-card total-card">
          <h2>Total Emotion Selections Today</h2>
          <div className="big-number">{total}</div>
        </div>

        <div className="big-card info-card">
          <h2>How it will work</h2>
          <p>
            Each time a child presses an emotion button on the prototype, the website
            increases that emotion’s count for the day.
          </p>
          <button className="reset-btn" onClick={resetToday}>
            Reset Today
          </button>
        </div>
      </section>

      <section className="panel">
        <h2>Test Buttons</h2>
        <p className="panel-text">
          Use these buttons to simulate your prototype sending emotion data.
        </p>

        <div className="button-grid">
          {emotionList.map((emotion) => (
            <button
              key={emotion}
              className="emotion-button"
              style={{ backgroundColor: emotionColors[emotion] }}
              onClick={() => addEmotion(emotion)}
            >
              {emotion}
            </button>
          ))}
        </div>
      </section>

      <section className="panel">
        <h2>Today’s Emotion Counts</h2>

        <div className="stats-grid">
          {emotionList.map((emotion) => (
            <div className="stat-card" key={emotion}>
              <div
                className="stat-dot"
                style={{ backgroundColor: emotionColors[emotion] }}
              ></div>
              <h3>{emotion}</h3>
              <div className="stat-number">{counts[emotion]}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="panel">
        <h2>Emotion Graph</h2>
        <p className="panel-text">
          This graph shows how many times each emotion was chosen today.
        </p>

        <div className="chart">
          {emotionList.map((emotion) => {
            const heightPercent = (counts[emotion] / maxCount) * 100;

            return (
              <div className="bar-group" key={emotion}>
                <div className="bar-value">{counts[emotion]}</div>
                <div className="bar-area">
                  <div
                    className="bar"
                    style={{
                      height: `${heightPercent}%`,
                      backgroundColor: emotionColors[emotion],
                    }}
                  ></div>
                </div>
                <div className="bar-label">{emotion}</div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="panel future-panel">
        <h2>Wireless Prototype Connection</h2>
        <p className="panel-text">
          This website is ready for the next step: receiving emotion data from your
          prototype automatically.
        </p>
        <p className="panel-text">
          For wireless connection, your Arduino Uno will need extra Wi-Fi hardware,
          or you can switch to an ESP32.
        </p>
      </section>
    </div>
  );
}

export default App;
