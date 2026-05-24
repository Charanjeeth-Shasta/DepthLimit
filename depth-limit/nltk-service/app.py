from fastapi import FastAPI
from pydantic import BaseModel
from pypdf import PdfReader
import spacy
import random
import json

app = FastAPI()

# Load spaCy NLP model
nlp = spacy.blank("en")

# Load Questions Database
with open("data/questions.json", "r") as file:
    QUESTIONS_DB = json.load(file)

# Skills Database
SKILLS_DB = {
    "python": "Python",
    "java": "Java",
    "c": "C",
    "c++": "C++",
    "javascript": "JavaScript",
    "react": "React",
    "reactjs": "React",
    "node": "Node.js",
    "nodejs": "Node.js",
    "express": "Express",
    "mongodb": "MongoDB",
    "sql": "SQL",
    "html": "HTML",
    "css": "CSS",
    "machine learning": "Machine Learning",
    "deep learning": "Deep Learning",
    "flask": "Flask",
    "git": "Git"
}

# Project Questions Database
PROJECT_QUESTIONS = {
    "Flask": [
        "Why did you choose Flask for backend?",
        "How did you deploy the Flask application?",
        "How does routing work in Flask?",
        "How do APIs work in Flask?"
    ],

    "MongoDB": [
        "Why did you choose MongoDB?",
        "How did you design database schema?",
        "How did you optimize MongoDB queries?",
        "How do you handle relationships in MongoDB?"
    ],

    "Machine Learning": [
        "How did you preprocess the dataset?",
        "How did you evaluate model performance?",
        "Why did you choose that ML algorithm?",
        "How did you handle overfitting?"
    ],

    "React": [
        "How did you structure React components?",
        "How did you manage state in React?",
        "How did frontend communicate with backend?",
        "How did you optimize React rendering?"
    ]
}

# Interview Modes
INTERVIEW_MODES = {
    "quick": 5,
    "standard": 10,
    "advanced": 15
}


# Request Model
class ResumeRequest(BaseModel):
    file_path: str
    difficulty: str = "medium"
    mode: str = "standard"
    previous_questions: list = []
    jd_content: str = None


# Extract Text From PDF
def extract_text_from_pdf(file_path):
    text = ""
    reader = PdfReader(file_path)
    for page in reader.pages:
        text += page.extract_text() or ""
    return text


# Extract Skills Using NLP
def extract_skills(text):

    doc = nlp(text.lower())

    extracted_skills = set()

    # Token-based extraction
    for token in doc:

        word = token.text.strip()

        if word in SKILLS_DB:
            extracted_skills.add(SKILLS_DB[word])

    # Multi-word matching
    lower_text = text.lower()

    for skill in SKILLS_DB:

        if skill in lower_text:
            extracted_skills.add(SKILLS_DB[skill])

    return list(extracted_skills)


# Generate Technical Questions
def generate_questions(
    skills,
    difficulty,
    mode,
    previous_questions
):

    final_questions = {}

    total_questions_needed = INTERVIEW_MODES.get(
        mode,
        10
    )

    all_questions = []

    # Collect Questions
    for skill in skills:

        if skill in QUESTIONS_DB:

            difficulty_questions = QUESTIONS_DB[
                skill
            ].get(
                difficulty,
                []
            )

            # Remove Previously Asked Questions
            filtered_questions = [

                question

                for question in difficulty_questions

                if question not in previous_questions
            ]

            for question in filtered_questions:

                all_questions.append({
                    "skill": skill,
                    "question": question
                })

    # Shuffle Questions
    random.shuffle(all_questions)

    # Select Limited Questions
    selected_questions = all_questions[
        :total_questions_needed
    ]

    # Organize By Skill
    for item in selected_questions:

        skill = item["skill"]
        question = item["question"]

        if skill not in final_questions:
            final_questions[skill] = []

        final_questions[skill].append(question)

    return final_questions


# Generate Project Questions
def generate_project_questions(
    skills,
    previous_questions
):

    project_questions = {}

    for skill in skills:

        if skill in PROJECT_QUESTIONS:

            available_questions = [

                question

                for question in PROJECT_QUESTIONS[skill]

                if question not in previous_questions
            ]

            if available_questions:

                selected = random.sample(
                    available_questions,
                    min(2, len(available_questions))
                )

                project_questions[skill] = selected

    return project_questions


# Root Route
@app.get("/")
def home():

    return {
        "message": "DepthLimit NLP Service Running"
    }


# Generate Interview Questions
@app.post("/generate-questions")
def generate_interview(request: ResumeRequest):

    # Extract Resume Text
    text = extract_text_from_pdf(
        request.file_path
    )

    # Extract Skills from Resume
    resume_skills = extract_skills(text)

    # If JD provided, extract JD skills and find intersection
    final_skills = resume_skills
    if request.jd_content:
        jd_skills = extract_skills(request.jd_content)
        # Use intersection of resume and JD skills for more targeted questions
        final_skills = list(set(resume_skills) & set(jd_skills))
        if not final_skills:
            # If no intersection, use JD skills (what they need to know)
            final_skills = jd_skills if jd_skills else resume_skills

    # Generate Technical Questions
    questions = generate_questions(
        final_skills,
        request.difficulty,
        request.mode,
        request.previous_questions
    )

    # Generate Project Questions
    project_questions = generate_project_questions(
        final_skills,
        request.previous_questions
    )

    return {

        "message": "Questions generated successfully",

        "difficulty": request.difficulty,

        "mode": request.mode,

        "skills": final_skills,

        "questions": questions,

        "project_questions": project_questions,

        "text": text
    }