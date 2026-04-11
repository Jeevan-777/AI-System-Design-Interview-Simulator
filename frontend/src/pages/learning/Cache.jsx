function Cache() {
  return (
    <div style={{ padding: "40px", lineHeight: "1.7" }}>
      <h1>Cache (Redis) ⚡</h1>

      <h3>What is Cache?</h3>
      <p>
        Cache stores frequently accessed data in memory so that it can be
        retrieved much faster than from a database.
      </p>

      <img
        src="/images/redish-cache.webp"
        alt="Cache"
        style={{ width: "500px", margin: "20px 0" }}
      />

      <h3>Why is it important?</h3>
      <ul>
        <li>Improves performance</li>
        <li>Reduces database load</li>
        <li>Faster response time</li>
      </ul>

      <h3>Where is it used?</h3>
      <ul>
        <li>User sessions</li>
        <li>News feeds</li>
        <li>Trending data</li>
      </ul>

      <h3>Real-world Example</h3>
      <p>
        Instagram caches user feeds so loading is fast.
      </p>

      <h3>Interview Tip 💡</h3>
      <p>
        Always mention cache to optimize performance in system design.
      </p>

      <br />

      <button onClick={() => window.location.href = "/learning"}>
        Back to Learning
      </button>
    </div>
  );
}

export default Cache;