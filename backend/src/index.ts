import express from "express";
import apiRouter from "./routes/v1";
import serverConfig from "./config/serverConfig";

const app = express();
const PORT = serverConfig.PORT;

app.use(express.json());


app.get("/", (req, res) => {
    res.send("Inventory System Backend API");
});

app.use("/api/v1", apiRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
