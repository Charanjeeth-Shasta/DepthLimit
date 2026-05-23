const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');

// Parse file based on extension
const parseFile = async (filePath) => {
  try {
    const ext = path.extname(filePath).toLowerCase();

    if (ext === '.txt') {
      return await parseTxt(filePath);
    } else if (ext === '.pdf') {
      return await parsePdf(filePath);
    } else if (ext === '.docx') {
      return await parseDocx(filePath);
    } else {
      throw new Error(`Unsupported file format: ${ext}`);
    }
  } catch (error) {
    console.error('File parsing error:', error.message);
    throw error;
  }
};

// Parse TXT file
const parseTxt = async (filePath) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
};

// Parse PDF file
const parsePdf = async (filePath) => {
  try {
    const fileBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(fileBuffer);
    return data.text;
  } catch (error) {
    throw new Error(`PDF parsing failed: ${error.message}`);
  }
};

// Parse DOCX file
const parseDocx = async (filePath) => {
  try {
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value;
  } catch (error) {
    throw new Error(`DOCX parsing failed: ${error.message}`);
  }
};

module.exports = {
  parseFile,
  parseTxt,
  parsePdf,
  parseDocx
};
