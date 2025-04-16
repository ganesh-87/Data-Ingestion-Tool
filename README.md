ClickHouse Data Ingestion Tool

# Purpose
The ClickHouse Data Ingestion Tool is a web-based application that facilitates bidirectional data ingestion between a ClickHouse database and a Flat File (CSV) platform.
The tool supports:
ClickHouse to Flat File (CSV): Export data from ClickHouse tables to CSV files.

Flat File to ClickHouse: Ingest data from CSV files into ClickHouse tables.

Additionally, the application uses JWT (JSON Web Token) authentication for secure access to the ClickHouse database. The JWT tokens are stored in a jwtAuth table within ClickHouse and are validated for each connection.

# Technologies Used
Backend: Java with Spring Boot

Frontend: HTML, CSS, JavaScript (Vite for the development server)

Database: ClickHouse

CSV Handling: OpenCSV library for reading and writing CSV files

Authentication: JWT (JSON Web Tokens) for secure connections to ClickHouse

# ClickHouse Database Setup Using Docker
To run a local ClickHouse instance, follow these steps:

Install Docker if you don’t already have it. You can download Docker from here.

Run ClickHouse using Docker:

Run the following command to start ClickHouse in a Docker container:

docker run -d --name clickhouse-server -p 8123:8123 -p 9000:9000 yandex/clickhouse-server
This will start ClickHouse on port 8123 for HTTP and 9000 for native client connections.

Access ClickHouse:

To interact with ClickHouse from your local machine, open the ClickHouse client by running:

docker exec -it clickhouse-server clickhouse-client
Create the jwtAuth Table:

After connecting to ClickHouse, you need to create the jwtAuth table to store JWT tokens:

CREATE TABLE jwtAuth (
    tableName String,
    jwtToken String
) ENGINE = MergeTree() ORDER BY tableName;
This table will store the JWT tokens used for authenticating access to ClickHouse.

# Running the Backend
To run the backend of the application:

Open your project in your IDE (e.g., Spring Tool Suite, IntelliJ).

Run the Application:

Right-click on the project folder.

Select Run as Spring Boot App.

This will start the backend on http://localhost:8080.

# Running the Frontend
To run the frontend, follow these steps:

Navigate to the frontend project directory where your Vite project is located (usually inside a frontend folder).

Install Dependencies:

If you haven't already, run the following command to install the required dependencies:

npm install
Start the Development Server:

Run the following command to start the frontend development server:

npm run dev
The frontend will be accessible at http://localhost:3000.
