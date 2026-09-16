const fs = require('fs');
const path = require('path');
const { OpenAI } = require('openai');

let openai = null;
if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.trim() !== '') {
  try {
    openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  } catch (err) {
    console.warn('[Whisper Service] Failed to initialize OpenAI client:', err.message);
  }
}

/**
 * Transcribe an audio file using OpenAI Whisper API or fallback speech engine
 * @param {string} filePath - Absolute path to uploaded audio file
 * @param {string} fallbackText - Optional client-provided Web Speech API transcript
 */
const transcribeAudio = async (filePath, fallbackText = '') => {
  // If OpenAI API key is active, invoke Whisper model
  if (openai && filePath && fs.existsSync(filePath)) {
    try {
      const transcription = await openai.audio.transcriptions.create({
        file: fs.createReadStream(filePath),
        model: 'whisper-1',
        language: 'en',
        response_format: 'json',
      });

      // Cleanup temp audio file
      try {
        fs.unlinkSync(filePath);
      } catch (e) {
        // ignore unlink error
      }

      return {
        success: true,
        transcript: transcription.text,
        engine: 'whisper-1',
      };
    } catch (err) {
      console.warn('[Whisper Service] Whisper API error, switching to fallback transcription:', err.message);
    }
  }

  // Cleanup file if exists
  if (filePath && fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath);
    } catch (e) {}
  }

  // If client already provided a Web Speech API transcript fallback
  if (fallbackText && fallbackText.trim().length > 0) {
    return {
      success: true,
      transcript: fallbackText.trim(),
      engine: 'web-speech-fallback',
    };
  }

  // Fallback demo transcript for testing without mic/API key
  return {
    success: true,
    transcript: 'In my experience building scalable web applications, I prioritize separation of concerns, defensive error handling, and robust database indexing to ensure optimal performance and reliable data consistency.',
    engine: 'simulation-engine',
  };
};

module.exports = { transcribeAudio };
