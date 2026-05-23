const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },

  answer: {
    type: String,
    default: "",
  },

  score: {
    type: Number,
    default: 0,
  },

  feedback: {
    strengths: String,
    weaknesses: String,
    gaps: String,
  },
});

const questionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  skill: {
    type: String,
    default: null,
  },
  type: {
    type: String,
    enum: ['technical', 'project'],
    default: 'technical',
  },
}, { _id: false });

const interviewSessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    jobTitle: {
      type: String,
      default: "Technical Interview",
    },

    jdContent: {
      type: String,
      default: null,
    },

    jdFileName: {
      type: String,
      default: null,
    },

    skills: {
      type: [String],
      default: [],
    },

    questions: {
      type: [questionSchema],
      default: [],
    },

    answers: {
      type: [answerSchema],
      default: [],
    },

    totalScore: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "InterviewSession",
  interviewSessionSchema
);