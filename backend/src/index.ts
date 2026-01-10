import express from "express";
import apiRouter from "./routes/v1";
import serverConfig from "./config/serverConfig";
import morgan from "morgan";
const app = express();
const PORT = serverConfig.PORT;

app.use(express.json());
app.use(require('cors')());
app.use(morgan('dev'));


app.get("/", (req, res) => {
    res.send("Inventory System Backend API");
});

app.use("/api/v1", apiRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
