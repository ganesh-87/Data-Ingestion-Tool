import { getTables } from "../api.js";

const ConnectionForm = ({
  connection,
  setConnection,
  setTables,
  setSelectedTable,
  setColumns,
  setSelectedColumns,
  setMessage,
}) => {
  const handleChange = (e) => {
    setConnection({ ...connection, [e.target.name]: e.target.value });
  };

  const fetchTables = async () => {
    const result = await getTables(connection);
    setTables(result);
    setSelectedTable("");
    setColumns([]);
    setSelectedColumns([]);
    setMessage("Tables fetched successfully");
  };

  return (
    <div className="grid grid-cols-2 gap-4 mb-6">
      {["host", "port", "database", "username", "jwtToken"].map((field) => (
        <input
          key={field}
          name={field}
          value={connection[field]}
          onChange={handleChange}
          placeholder={field}
          className="border p-2 rounded"
        />
      ))}
      <button
        onClick={fetchTables}
        className="col-span-2 bg-blue-500 text-white px-4 py-2 rounded"
      >
        Connect & Fetch Tables
      </button>
    </div>
  );
};

export default ConnectionForm;
