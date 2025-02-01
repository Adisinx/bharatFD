const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path")
const { Translate } = require("@google-cloud/translate").v2;



const app = express();
app.use(express.json());
app.use(cors());


require('dotenv').config();



process.env.GOOGLE_APPLICATION_CREDENTIALS = path.join(__dirname, process.env.GOOGLE_APPLICATION_CREDENTIALS);

const translate = new Translate();

console.log("Google Translate API initialized successfully!");


const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.error("MongoDB Connection Error:", err));


const faqSchema = new mongoose.Schema({
    question: { type: String, required: true },
    answer: { type: String, required: true },
    translations: {
        question_hi: String,
        question_bn: String,
        answer_hi: String,
        answer_bn: String,
    },
});


faqSchema.methods.getTranslatedText = function (lang) {
    return {
        question: this.translations[`question_${lang}`] || this.question,
        answer: this.translations[`answer_${lang}`] || this.answer,
    };
};

const FAQ = mongoose.model("FAQ", faqSchema);


async function autoTranslateFAQ(faq) {
    const languages = ["hi", "bn"];
    for (const lang of languages) {
        const [translatedQuestion] = await translate.translate(faq.question, lang);
        const [translatedAnswer] = await translate.translate(faq.answer, lang);
        faq.translations[`question_${lang}`] = translatedQuestion;
        faq.translations[`answer_${lang}`] = translatedAnswer;
    }
    return faq;
}




app.post("/faqs", async (req, res) => {
    console.log(40000)
    try {
        let faq = new FAQ(req.body);
        faq = await autoTranslateFAQ(faq); 
        await faq.save();
        res.status(201).json(faq);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});


app.get("/faqs", async (req, res) => {
    try {
        const lang = req.query.lang || "en";
        const faqs = await FAQ.find();
        const translatedFaqs = faqs.map((faq) => faq.getTranslatedText(lang));
        res.json(translatedFaqs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
