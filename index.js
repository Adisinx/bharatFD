const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path")
const { Translate } = require("@google-cloud/translate").v2;
// require("dotenv").config(); // Load environment variables from .env file

// Initialize Express
const app = express();
app.use(express.json());
app.use(cors());

// Initialize Google Translate API
const translate = new Translate({
    keyFilename: path.join(__dirname, "./key.json") // Path to your service account JSON file
});

// Connect to MongoDB Atlas
const MONGO_URI = "mongodb+srv://gurnoorbhinders:yy6L856nmkRgkaXg@cluster0.evcbl.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster0"; // Use environment variables for security
mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("Connected to MongoDB Atlas"))
  .catch(err => console.error("MongoDB Connection Error:", err));

// Define Mongoose Schema & Model
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

// Method to fetch translated text dynamically
faqSchema.methods.getTranslatedText = function (lang) {
    return {
        question: this.translations[`question_${lang}`] || this.question,
        answer: this.translations[`answer_${lang}`] || this.answer,
    };
};

const FAQ = mongoose.model("FAQ", faqSchema);

// Auto-translate function for FAQ entries
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

// API Routes

// Create FAQ
app.post("/faqs", async (req, res) => {
    console.log(40000)
    try {
        let faq = new FAQ(req.body);
        faq = await autoTranslateFAQ(faq); // Auto-translate before saving
        await faq.save();
        res.status(201).json(faq);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Get FAQs with language selection
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

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
