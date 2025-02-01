# BharatFD

### 🚀 **Project Overview**
BharatFD is a full-stack application designed to demonstrate integration with MongoDB, TinyMCE, and Google Cloud Translate. This project leverages the power of modern technologies to build an efficient and user-friendly web application.

---

### **Images**
1.Adding the text into form
![Add Image](/Screenshots/1.adding_content.png)

2.Submitting the Content into the form
![Submit Image](/Screenshots/2.submitting_content.png)

3.Content added in English
![English Image](/Screenshots/3.english.png)

4.Content added in Hindi
![Hindi Image](/Screenshots/3.rename.png)

5.Content added in Bengali
![Bengali Image](/Screenshots/3.Bengali.png)






### 🛠 **Tech Stack**
- **Frontend:** HTML, CSS, JavaScript (with TinyMCE editor)
- **Backend:** Node.js, Express
- **Database:** MongoDB (using MongoDB Atlas)
- **Cloud Services:** Google Cloud Translate API

---

### ⚡ **Setup Instructions**

#### 1. **Clone the Repository**
Clone the repository to your local machine:
```sh
git clone https://github.com/Adisinx/bharatFD.git
cd bharatFD

```

### ⚡ **Setup Instructions**

#### 2. **Install Dependencies**
Make sure you have Node.js installed. Then, install the required dependencies:
```sh
npm install

```

#### 3. **Configuration**
Create a `.env` file in the root directory of the project and add the following variables:
```env
MONGO_URI=your-mongodb-connection-url
TINYMCE_API_KEY=your-tinymce-api-key
GOOGLE_APPLICATION_CREDENTIALS=./key.json

```


#### 4. **Setup TinyMCE**
- Sign in to [TinyMCE](https://www.tiny.cloud/).
- Go to **Settings → Domain Access**.
- Allow access to your specific domain where the TinyMCE editor is being used.


#### 5. **Google Cloud API Setup**
- Create a service account in [Google Cloud](https://cloud.google.com) for the Translate API.
- Download the credentials file (in `.json` format) and place it in the project directory as `key.json`.

### **Example API Usage**

#### **POST /faqs**

This endpoint allows you to create a new FAQ. The FAQ will be automatically translated into Hindi and Bengali using Google Cloud Translate API.

##### Request Body (JSON):
```json
{
  "question": "What is the capital of India?",
  "answer": "New Delhi"
}
```



#### **GET /faqs**

This endpoint retrieves all FAQs. You can specify a language (`lang`) in the query parameter to fetch the translations for the question and answer.

##### Request (URL):
```bash
GET /faqs?lang=hi
```
Response (JSON):
json
Copy
Edit
[
  {
    "question": "भारत की राजधानी क्या है?",
    "answer": "नई दिल्ली"
  },
  {
    "question": "ভারতের রাজধানী কোথায়?",
    "answer": "নতুন দিল্লি"
  }
]
