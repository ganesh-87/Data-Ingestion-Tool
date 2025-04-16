import { useState } from "react";
import ConnectionForm from "./components/ConnectionForm";
import TableSelector from "./components/TableSelector";
import ColumnSelector from "./components/ColumnSelector";
import ExportButton from "./components/ExportButton";
import CSVUploader from "./components/CSVUploader";

function App() {
  const [sourceType, setSourceType] = useState("");
  const [connection, setConnection] = useState({
    host: "",
    port: "",
    database: "",
    username: "",
    jwtToken: "",
    tablename: "",
  });

  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState("");
  const [columns, setColumns] = useState([]);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [status, setStatus] = useState("");

  const handleSourceChange = (e) => {
    setSourceType(e.target.value);
    // Reset all state when source changes
    setConnection({
      host: "",
      port: "",
      database: "",
      username: "",
      jwtToken: "",
      tablename: "",
    });
    setTables([]);
    setSelectedTable("");
    setColumns([]);
    setSelectedColumns([]);
    setStatus("");
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Data Ingestion Tool</h1>

      {/* Source Type Selector */}
      <label className="block mb-2 font-medium">Select Source:</label>
      <select
        value={sourceType}
        onChange={handleSourceChange}
        className="border p-2 rounded w-full mb-6"
      >
        <option value="">-- Select Source --</option>
        <option value="clickhouse">ClickHouse (to CSV)</option>
        <option value="flatfile">Flat File (to ClickHouse)</option>
      </select>

      {/* ClickHouse to CSV */}
      {sourceType === "clickhouse" && (
        <>
          <ConnectionForm
            connection={connection}
            setConnection={setConnection}
            setTables={setTables}
            setSelectedTable={setSelectedTable}
            setColumns={setColumns}
            setSelectedColumns={setSelectedColumns}
            setMessage={setStatus}
          />
          {tables.length > 0 && (
            <TableSelector
              tables={tables}
              selectedTable={selectedTable}
              setSelectedTable={setSelectedTable}
              connection={connection}
              setColumns={setColumns}
              setSelectedColumns={setSelectedColumns}
            />
          )}
          {columns.length > 0 && (
            <ColumnSelector
              columns={columns}
              selectedColumns={selectedColumns}
              setSelectedColumns={setSelectedColumns}
            />
          )}
          {selectedColumns.length > 0 && selectedTable && (
            <div className="mt-4">
              <ExportButton
                connection={connection}
                selectedTable={selectedTable}
                selectedColumns={selectedColumns}
                setMessage={setStatus}
              />
            </div>
          )}
        </>
      )}

      {/* Flat File to ClickHouse */}
      {sourceType === "flatfile" && (
        <>
          <div className="grid grid-cols-2 gap-4 mb-6">
            {[
              "host",
              "port",
              "database",
              "username",
              "jwtToken",
              "tablename",
            ].map((field) => (
              <input
                key={field}
                name={field}
                value={connection[field]}
                onChange={(e) =>
                  setConnection({
                    ...connection,
                    [e.target.name]: e.target.value,
                  })
                }
                placeholder={field}
                className="border p-2 rounded"
              />
            ))}
          </div>
          <CSVUploader
            connection={connection}
            selectedTable={connection.tablename}
            setMessage={setStatus}
          />
        </>
      )}

      {/* Status Display */}
      {status && (
        <div className="mt-6 p-4 bg-gray-100 border rounded">
          <strong>Status:</strong> {status}
        </div>
      )}
    </div>
  );
}

export default App;
