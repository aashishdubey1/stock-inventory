import express from "express";
import authRoutes from "./routes/auth.routes";
import serverConfig from "./config/serverConfig";

const app = express();
const PORT = serverConfig.PORT;

app.use(express.json());


app.get("/", (req, res) => {
    res.send("Inventory System Backend API");
});

app.use("/auth", authRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
