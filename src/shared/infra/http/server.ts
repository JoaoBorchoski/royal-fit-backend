import { app } from "./app"
import { mqWorkerRun } from "@shared/infra/mq/mq-worker-run"

app.listen(3333, () => console.log("Server is running on port 3333!"))

mqWorkerRun()

// import { app } from "./app"
// import { mqWorkerRun } from "@shared/infra/mq/mq-worker-run"
// import { createServer } from "http"
// import { Server } from "socket.io"

// const server = createServer(app)
// const io = new Server(server, {
//   cors: {
//     origin: "*",
//     methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
//   },
// })

// io.on("connection", (socket) => {
//   //   console.log("Novo cliente conectado")

//   socket.on("disconnect", () => {
//     // console.log("Cliente desconectado")
//   })
// })

// server.listen(5500, () => {
//   console.log("Server is running on port 5500!")
// })

// mqWorkerRun()

// export { io }
