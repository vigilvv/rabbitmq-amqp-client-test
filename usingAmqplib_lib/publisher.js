import amqplib from "amqplib";

import {} from "dotenv/config";

async function startPublisher() {
  const exchange = "emails-new";
  const queue = "emails.notifications.new";
  const routingKey = "notification";

  try {
    const connection = await amqplib.connect(process.env.AMQP_URL);

    const channel = await connection.createChannel();

    channel.assertExchange(exchange, "direct", "durable");
    channel.assertQueue(queue, "durable");
    channel.bindQueue(queue, exchange, routingKey);

    channel.sendToQueue(queue, Buffer.from("something to do"));

    //   setInterval(() => {
    //     ch1.sendToQueue(queue, Buffer.from("something to do"));
    //   }, 1000);

    setTimeout(() => {
      //Close the connection
      connection.close();
      console.log("[❎] Connection closed");
      process.exit(0);
    }, 500);
  } catch (error) {
    console.error(error);

    //Retry after 3 second
    setTimeout(() => {
      startPublisher();
    }, 3000);
  }
}

startPublisher();
