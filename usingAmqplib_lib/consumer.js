import amqplib from "amqplib";

async function startConsumer() {
  const queue = "emails.notifications.new";
  const connection = await amqplib.connect(process.env.AMQP_URL);

  const channel = await connection.createChannel();

  channel.consume(queue, (msg) => {
    if (msg !== null) {
      console.log("Recieved:", msg.content.toString());
      channel.ack(msg);
    } else {
      console.log("Consumer cancelled by server");
    }
  });

  //When the process is terminated, close the connection
  process.on("SIGINT", () => {
    channel.close();
    connection.close();
    console.log("[❎] Connection closed");
    process.exit(0);
  });
}

startConsumer();
