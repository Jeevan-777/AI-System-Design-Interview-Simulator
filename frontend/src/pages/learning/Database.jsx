function Database() {
  return (
    <div style={{ padding: "40px", lineHeight: "1.7" }}>
      <h1>Database 🗄️</h1>

      <h3>What is a Database?</h3>
      <p>
        A database is a system used to store, manage, and retrieve data efficiently.
        It allows multiple users and applications to access data in an organized way.
      </p>

      <img
        src="/images/DBMS.webp"
        alt="Database"
        style={{ width: "500px", margin: "20px 0" }}
      />

      <h3>Types of Databases</h3>
      <ul>
        <li><b>SQL:</b> MySQL, PostgreSQL (structured data)</li>
        <li><b>NoSQL:</b> MongoDB, Cassandra (scalable & flexible)</li>
      </ul>

      <h3>Why is it important?</h3>
      <ul>
        <li>Stores user data, posts, messages</li>
        <li>Ensures data consistency</li>
        <li>Supports large-scale applications</li>
      </ul>

      <h3>Real-world Example</h3>
      <p>
        Instagram stores user profiles, posts, likes, and comments in databases.
      </p>

      <h3>Interview Tip 💡</h3>
      <p>
        Always mention scaling techniques like <b>sharding</b> and <b>replication</b>.
      </p>

      <br />

      <button onClick={() => window.location.href = "/learning"}>
        Back to Learning
      </button>
    </div>
  );
}

export default Database;