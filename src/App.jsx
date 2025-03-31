import { useEffect, useState } from "react";

function AnalyticsDashboard() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const logsPerPage = 10;

  useEffect(() => {
    fetch("https://snippet-manager-analytics-a0adad83c031.herokuapp.com/logs")
      .then((res) => res.json())
      .then((data) => {
        setLogs(data);
        setLoading(false);
      })
      .catch((err) => console.error("Error fetching logs:", err));
  }, []);

  const filteredLogs = logs
    .filter((log) => {
      if (search) {
        return log.action.toLowerCase().includes(search.toLowerCase());
      }
      return true;
    })
    .filter((log) => {
      const logDate = new Date(log.timestamp);
      const now = new Date();
      if (filter === "last-day") {
        return now - logDate < 24 * 60 * 60 * 1000;
      } else if (filter === "last-week") {
        return now - logDate < 7 * 24 * 60 * 60 * 1000;
      } else if (filter === "last-month") {
        return now - logDate < 30 * 24 * 60 * 60 * 1000;
      }
      return true;
    })
    .sort((a, b) => {
      return sortOrder === "asc"
        ? new Date(a.timestamp) - new Date(b.timestamp)
        : new Date(b.timestamp) - new Date(a.timestamp);
    });

  const totalPages = Math.ceil(filteredLogs.length / logsPerPage);
  const displayedLogs = filteredLogs.slice((currentPage - 1) * logsPerPage, currentPage * logsPerPage);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-2xl p-6">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Snippet Manager Analytics Dashboard</h1>
        <p className="text-center text-gray-600 mb-4">Total Logs: {filteredLogs.length}</p>

        <div className="flex justify-between mb-4">
          <input
            type="text"
            placeholder="Search by action..."
            className="border p-2 rounded w-1/3"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select className="border p-2 rounded" value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All</option>
            <option value="last-day">Last Day</option>
            <option value="last-week">Last Week</option>
            <option value="last-month">Last Month</option>
          </select>
          <button className="border p-2 rounded bg-blue-500 text-white" onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}>
            Sort {sortOrder === "asc" ? "⬆" : "⬇"}
          </button>
        </div>

        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-white shadow-md rounded-lg">
              <thead>
                <tr className="bg-blue-500 text-white text-left">
                  <th className="p-4">Timestamp</th>
                  <th className="p-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {displayedLogs.map((log, index) => (
                  <tr key={index} className="border-b hover:bg-gray-100">
                    <td className="p-4 text-gray-700">{new Date(log.timestamp).toLocaleString()}</td>
                    <td className="p-4 text-gray-700">{log.action}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex justify-between mt-4">
          <button
            className="border p-2 rounded bg-gray-300 disabled:opacity-50"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          >
            Prev
          </button>
          <span>Page {currentPage} of {totalPages}</span>
          <button
            className="border p-2 rounded bg-gray-300 disabled:opacity-50"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return <AnalyticsDashboard />;
}
