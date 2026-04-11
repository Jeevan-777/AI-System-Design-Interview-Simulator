function Queue() {
  return (
    <div style={{ padding: "40px", lineHeight: "1.7" }}>
      <h1>Message Queue 📩</h1>

      <h3>What is a Message Queue?</h3>
      <p>
        A message queue allows tasks to be processed asynchronously by sending
        messages between services.
      </p>

      <img
        src="/images/message_queue.webp"
        alt="Queue"
        style={{ width: "500px", margin: "20px 0" }}
      />

      <h3>Why is it important?</h3>
      <ul>
        <li>Handles background processing</li>
        <li>Improves scalability</li>
        <li>Decouples services</li>
      </ul>

      <h3>Where is it used?</h3>
      <ul>
        <li>Sending notifications</li>
        <li>Email processing</li>
        <li>Video processing</li>
      </ul>

      <h3>Real-world Example</h3>
      <p>
        Instagram uses queues to process notifications and uploads.
      </p>

      <h3>Interview Tip 💡</h3>
      <p>
        Mention queues for asynchronous tasks and scalability.
      </p>

      <br />

      <button onClick={() => window.location.href = "/learning"}>
        Back to Learning
      </button>
    </div>
  );
}

export default Queue;