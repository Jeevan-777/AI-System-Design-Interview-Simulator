function LoadBalancer() {
  return (
    <div style={{ padding: "40px", lineHeight: "1.7" }}>
      <h1>Load Balancer ⚖️</h1>

      <h3>What is Load Balancer?</h3>
      <p>
        A load balancer distributes incoming traffic across multiple servers
        so that no single server becomes overloaded.
      </p>

      <img
        src="/images/load_balancer.webp"
        alt="Load Balancer"
        style={{ width: "500px", margin: "20px 0" }}
      />

      <h3>Why is it important?</h3>
      <ul>
        <li>Improves system performance</li>
        <li>Ensures high availability</li>
        <li>Prevents server crashes</li>
      </ul>

      <h3>Real-world Example</h3>
      <p>
        Instagram uses load balancers to handle millions of user requests.
      </p>

      <h3>Interview Tip 💡</h3>
      <p>
        Always mention load balancer when designing scalable systems.
      </p>

      <br />

      <button onClick={() => window.location.href = "/learning"}>
        Back to Learning
      </button>
    </div>
  );
}

export default LoadBalancer;