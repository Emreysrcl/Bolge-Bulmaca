import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const db = new pg.Client({
    user:"postgres",
    host:"localhost",
    database:"world",
    password:"traslan2003trA",
    port: 5432,
  });
  db.connect();



let quiz=[
    {sehirad:"Adana",bolgead:"Akdeniz Bölgesi"}
];

let totalCorrect = 0;

let currentQuestion = {};


db.query("SELECT * FROM turkey",(err,res)=>{
    if(err){
        console.error("Error executing query",err.stack);
    }
    else{
        quiz = res.rows;
    }
    db.end();
});

app.get("/",async(req,res)=>{
    totalCorrect = 0;
    await nextQuestion();
    console.log(currentQuestion);
    res.render("index.ejs",{question:currentQuestion});
});

app.post("/submit",(req,res)=>{
    let answer = req.body.answer.trim();
    let isCorrect=false;
    if(currentQuestion.bolgead.toLowerCase() === answer.toLowerCase() ){
        totalCorrect++;
        console.log(totalCorrect);
        isCorrect=true;
    }
    nextQuestion();
    res.render("index.ejs",{
        question:currentQuestion,
        wasCorrect:isCorrect,
        totalScore:totalCorrect,
    })
})


async function nextQuestion() {
    const randomCountry =quiz[Math.floor(Math.random()*quiz.length)];
    currentQuestion = randomCountry;
}


app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });