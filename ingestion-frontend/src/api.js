const BASE_URL = "http://localhost:8080/api/clickhouse";

export const getTables = async (connection) => {
  const res = await fetch(`${BASE_URL}/tables`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(connection),
  });
  return res.json();
};

export const getColumns = async (connection, tableName) => {
  const res = await fetch(`${BASE_URL}/columns?tableName=${tableName}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(connection),
  });
  return res.json();
};

export const exportTable = async (connection, tableName, columns) => {
  const url = new URL(`${BASE_URL}/export`);
  url.searchParams.set("tableName", tableName);
  if (columns?.length > 0) {
    columns.forEach((col) => url.searchParams.append("columns", col));
  }

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(connection),
  });

  const text = await res.text();
  console.log(text);
  return text;
};

export const ingestCSV = async (formData) => {
  const res = await fetch(`${BASE_URL}/ingest`, {
    method: "POST",
    body: formData,
  });
  const text = await res.text();
  return text;
};
