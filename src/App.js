import React, { useState } from "react";

export default function App() {
  const [target, setTarget] = useState("");
  const [suggestionBy, setSuggestionBy] = useState("");
  const [tableData, setTableData] = useState([]);
  const [responseMessage, setResponseMessage] = useState("");

  const isValidTarget = (value) => {
    return /^[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+$/.test(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!target) {
      alert("Target is mandatory");
      return;
    }

    if (!isValidTarget(target)) {
      alert("Target format must be like abhi11j/SampleWebApp");
      return;
    }

    if (!suggestionBy) {
      alert("Please select suggestion type");
      return;
    }

    const payload = {
      target: target,
      suggestion_by: Number(suggestionBy),
    };

    try {
      const response = await fetch("http://localhost:5000/api/scan-repos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success) {
        const rows = data.suggestions.map((s, index) => ({
          id: index,
          title: s.title,
          source: s.source,
          priority: s.priority,
          detail: s.detail,
          status: "Pending",
        }));

        setTableData(rows);
      } else {
        alert(data.message || "Scan failed");
      }
    } catch {
      alert("Backend not connected");
    }
  };

  const handleImplement = async (index) => {
    const row = tableData[index];

    const payload = {
      target: target,
      suggestions: [
        {
          title: row.title,
          source: row.source,
          priority: row.priority,
          detail: row.detail,
        },
      ],
    };

    try {
      const response = await fetch(
        "http://localhost:5000/api/apply-suggestions",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();
      const updatedData = [...tableData];

      if (result.success === true) {
        updatedData[index].status = "Success";
        setResponseMessage(result.result?.message || "Applied successfully");
      } else {
        updatedData[index].status = "Failed";
        setResponseMessage("Implementation failed");
      }

      setTableData(updatedData);
    } catch {
      const updatedData = [...tableData];
      updatedData[index].status = "Failed";
      setTableData(updatedData);
      setResponseMessage("Server error");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>Project Improvement Hub</h2>

        <form onSubmit={handleSubmit}>
          <div style={styles.field}>
            <label>Target *</label>
            <input
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              placeholder="abhi11j/SampleWebApp"
              style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <label>Suggestion Type</label>
            <select
              value={suggestionBy}
              onChange={(e) => setSuggestionBy(e.target.value)}
              style={styles.input}
            >
              <option value="">Select</option>
              <option value="1">GitHub Automated</option>
              <option value="2">GitHub + AI Assisted</option>
              <option value="3">AI Automated</option>
              <option value="4">Manual</option>
            </select>
          </div>

          <button type="submit" style={styles.button}>
            Search
          </button>
        </form>

        {tableData.length > 0 && (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Title</th>
                <th style={styles.th}>Source</th>
                <th style={styles.th}>Priority</th>
                <th style={styles.th}>Detail</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Action</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, i) => (
                <tr key={i}>
                  <td style={styles.td}>{row.title}</td>
                  <td style={styles.td}>{row.source}</td>
                  <td style={styles.td}>{row.priority}</td>
                  <td style={styles.td}>{row.detail}</td>
                  <td style={styles.td}>{row.status}</td>
                  <td style={styles.td}>
                    <button
                      onClick={() => handleImplement(i)}
                      disabled={row.status === "Success"}
                    >
                      Implement
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {responseMessage && (
          <p style={{ marginTop: 10, color: "green" }}>
            {responseMessage}
          </p>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#6a5acd",
  },
  card: {
    background: "#fff",
    padding: 30,
    width: 900,
    borderRadius: 10,
  },
  field: { marginBottom: 15 },
  input: { width: "100%", padding: 8 },
  button: {
    width: "100%",
    padding: 10,
    background: "green",
    color: "#fff",
    border: "none",
    cursor: "pointer",
  },
  table: {
    width: "100%",
    marginTop: 20,
    borderCollapse: "collapse",
    border: "2px solid #333",
  },
  th: {
    border: "1px solid #333",
    padding: 8,
    background: "#f0f0f0",
  },
  td: {
    border: "1px solid #333",
    padding: 8,
  },
  title: { textAlign: "center" },
};
