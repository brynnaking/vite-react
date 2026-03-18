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

const emptyCounts: EmotionCounts = {
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
  const [counts, setCounts] = useState<EmotionCounts>(emptyCounts);
  const [lastUpdated, setLastUpdated] = useState<string>("Waiting for data...");
  const [connected, setConnected] = useState<boolean>(false);

  const emotionList: Emotion[] = [
    "Happy",
    "Angry",
    "Sad",
    "Silly",
    "Tired",
    "Overwhelmed",
  ];

  useEffect(() => {
    const fetchEmotionData = async () => {
      try {
        const response = await fetch("https://YOUR-BACKEND-URL/api/emotions/today");
        if (!response.ok) {
          throw new Error("Failed to load data");
        }

        const data = await response.json();

        setCounts({
          Happy: data.Happy ?? 0,
          Angry: data.Angry ?? 0,
          Sad: data.Sad ?? 0,
          Silly: data.Silly ?? 0,
          Tired: data.Tired ?? 0,
          Overwhelmed: data.Overwhelmed ?? 0,
        });

        setLastUpdated(new Date().toLocaleTimeString());
        setConnected(true);
      } catch (error) {
        console.error("Error loading emotion data:", error);
        setConnected(false);
      }
    };

    fetchEmotionData();
    const interval = setInterval(fetchEmotionData, 5000);

    return () => clearInterval(interval);
  }, []);

  const total = useMemo(() => {
    return Object.values(counts).reduce((sum, value) => sum + value, 0);
  }, [counts]);

  const maxCount = useMemo(() => {
    const max = Math.max(...Object.values(counts));
    return max === 0 ? 1 : max;
  }, [counts]);

  return (
    <div className="app">
      <header className="hero">
        <div className="hero-badge">Emotion Prototype Dashboard</div>
        <h1>Emotion Tracker</h1>
        <p>
          This website updates automatically when an emotion button is pressed on the prototype.
        </p>
      </header>

      <section className="top-cards">
        <div className="big-card total-card">
          <h2>Total Emotion Selections Today</h2>
          <div className="big-number">{total}</div>
        </div>

        <div className="big-card info-card">
          <h2>System Status</h2>
          <p>
            Connection:{" "}
            <span className={connected ? "status-on" : "status-off"}>
              {connected ? "Connected" : "Not Connected"}
            </span>
          </p>
          <p>Last updated: {lastUpdated}</p>
          <p>
            Data comes from the Arduino system, not from buttons on this website.
          </p>
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
    </div>
  );
}

export default App;
