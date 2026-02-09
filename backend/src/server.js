import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import placesRouter from "./routes/places.js";

dotenv.config();

const PORT = process.env.PORT || 2005;
const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
    res.json({ status: "ok" });
});

app.use("/api/places", placesRouter);

async function startServer() {
    try {
        app.listen(PORT, () => {
            console.log("🚀 Server started successfully");
            console.log(`📍 Running at:${PORT}`);
        });
    } catch (error) {
        console.error("❌ Failed to start server:", error.message);
        process.exit(1);
    }
}

startServer();