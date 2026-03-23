import React, { useEffect, useState } from "react";
import "./App.css";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

function App() {
  const [stats, setStats] = useState(null);
  const [history, setHistory] = useState({ cpu: [], memory: [], disk: [] });

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("http://127.0.0.1:5000/api/stats");
      const data = await res.json();
      setStats(data);
      //chart history
      setHistory(prev => ({
        cpu: [...prev.cpu.slice(-19), { value: data.cpu_percent }],
        memory: [...prev.memory.slice(-19), { value: data.memory.percent }],
        disk: [...prev.disk.slice(-19), { value: data.disk.percent }]
      }));
    };

    fetchData();
    const interval = setInterval(fetchData, 2000);
    return () => clearInterval(interval);
  }, []);

  if (!stats) return <div className="App">Loading...</div>;

  const renderBar = (label, value) => {
    let color = "#4caf50";
    if (value > 90) color = "#f44336";
    else if (value > 80) color = "#ffeb3b";

    return (
      <div className="card">
        <p>{label}: {value}%</p>
        <div className="bar">
          <div className="fill" style={{ width: `${value}%`, backgroundColor: color }}></div>
        </div>
      </div>
    );
  };

  const renderChart = (title, data) => (
    <div className="chart-card">
      <h3>{title} History</h3>
      <ResponsiveContainer width="100%" height={100}>
        <LineChart data={data}>
          <XAxis dataKey="index" hide />
          <YAxis domain={[0, 100]} hide />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke="#4caf50" dot={false} strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );

  return (
    <div className="App">
      <h1 className="title">PC Monitor</h1>

      {renderBar("CPU", stats.cpu_percent)}
      {renderBar("Memory", stats.memory.percent)}
      {renderBar("Disk", stats.disk.percent)}

      {renderChart("CPU", history.cpu.map((v, i) => ({ ...v, index: i })))}
      {renderChart("Memory", history.memory.map((v, i) => ({ ...v, index: i })))}
      {renderChart("Disk", history.disk.map((v, i) => ({ ...v, index: i })))}
    </div>
  );
}

export default App;