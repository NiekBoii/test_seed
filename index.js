import express from "express";
import cors from "cors";
import {PrismaClient} from '@prisma/client';
import httpStatus from "http-status-codes";

const prisma = new PrismaClient();

const app = express();
app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.get("/data", async (req, res) => {
    res.setHeader("X-Accel-Buffering", "no");
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    let take = 1000;
    console.log("Request");
    while (take <= 25000){
        console.log(`Take: ${take}`);
        await sleep(1000)
        const result = await prisma.data_seed.findMany({
            take: take,
            skip: take - 1000
        });
        take += 1000
        res.write(JSON.stringify(result))
    }
    console.log("Done response.");
    res.end()
});

app.all("/lifecheck", (req,res) => {
    console.log("lifecheck.");
    res.status(httpStatus.OK).json({success: true})
})

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


app.listen(8080 ,() => {
    console.log('Listening.');
});