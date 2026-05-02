import React, { useState, useEffect } from "react";
import "./App.css";

const phases = ["RED", "YELLOW", "GREEN"];

export default function App() {
  const [running, setRunning] = useState(false);

  const [data, setData] = useState([
    { name: "North Gate", vehicles: 8, phase: 0, timer: 10 },
    { name: "South Cross", vehicles: 3, phase: 1, timer: 5 },
    { name: "East Junction", vehicles: 15, phase: 2, timer: 3 },
    { name: "West Hub", vehicles: 1, phase: 0, timer: 7 },
  ]);

  const [cleared, setCleared] = useState(142);

  useEffect(() => {
    if (!running) return;

    const interval = setInterval(() => {
      setData((prev) =>
        prev.map((item) => {
          let newItem = { ...item };
          newItem.timer--;

          if (newItem.timer <= 0) {
            newItem.phase = (newItem.phase + 1) % 3;
            newItem.timer =
              newItem.phase === 1 ? 3 : newItem.phase === 2 ? 10 : 8;
          }

          return newItem;
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [running]);

  const totalVehicles = data.reduce((a, b) => a + b.vehicles, 0);
  const alerts = data.filter((d) => d.vehicles > 10).length;

  const getColor = (p) => {
    return p === 0 ? "red" : p === 1 ? "yellow" : "green";
  };

  const getCongestion = (v) => {
    if (v > 10) return "High";
    if (v > 5) return "Medium";
    return "Low";
  };

  return (
    <div className="container">
      {/* HEADER */}
      <div className="header">
        <div>
          <h1>🚦 Smart Traffic Management</h1>
          <p>Real-Time Signal Control — College Project</p>
        </div>
        <span className="status">{running ? "RUNNING" : "STOPPED"}</span>
      </div>

      {/* CARDS */}
      <div className="cards">
        <Card title="🚗 VEHICLES" value={totalVehicles} />
        <Card title="🚦 SIGNALS" value={data.length} />
        <Card title="✅ CLEARED" value={cleared} green />
        <Card title="⚠ ALERTS" value={alerts} red />
      </div>

      {/* BUTTONS */}
      <div className="controls">
        <button className="blue" onClick={() => setRunning(true)}>
          ▶ Start
        </button>
        <button className="gray" onClick={() => setRunning(false)}>
          ⏹ Stop
        </button>
        <button className="green">+ Add Vehicle</button>
        <button className="orange">↻ Reset</button>
      </div>

      {/* SIGNALS */}
      <div className="section">
        <h3>🚦 Intersection Signals</h3>
        <div className="signals">
          {data.map((d, i) => (
            <div key={i} className="signal-box">
              <h4>{d.name}</h4>

              <div className="light">
                <div className={`bulb red ${d.phase === 0 && "on"}`} />
                <div className={`bulb yellow ${d.phase === 1 && "on"}`} />
                <div className={`bulb green ${d.phase === 2 && "on"}`} />
              </div>

              <span className="timer">{d.timer}s</span>
            </div>
          ))}
        </div>
      </div>

      {/* TABLE */}
      <div className="section">
        <h3>📊 Live Traffic Table</h3>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Intersection</th>
              <th>Waiting</th>
              <th>Signal</th>
              <th>Congestion</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {data.map((d, i) => {
              const congestion = getCongestion(d.vehicles);
              return (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>{d.name}</td>
                  <td>{d.vehicles}</td>
                  <td className={getColor(d.phase)}>
                    {phases[d.phase]}
                  </td>
                  <td>{congestion}</td>
                  <td>
                    {congestion === "High"
                      ? "⚠ Congested"
                      : "✅ Clear"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Card({ title, value, green, red }) {
  return (
    <div className="card">
      <p>{title}</p>
      <h2
        style={{
          color: green ? "#2e7d32" : red ? "#c62828" : "#1a73e8",
        }}
      >
        {value}
      </h2>
    </div>
  );
}