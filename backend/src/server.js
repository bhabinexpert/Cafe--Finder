import express from "express";
import cors from 'cors';
const PORT = 2005;
const app = express();
app.use(cors);
app.use(express.json());
async function startServer(){
    try {
        app.listen(PORT, () => {
        console.log('🚀 Server started successfully');
     
        console.log(`📍 Running at: http://localhost:${PORT}`);
    });
    } catch (error) {
        console.error('❌ Failed to start server:', error.message);
        process.exit(1);
    }
}
startServer();