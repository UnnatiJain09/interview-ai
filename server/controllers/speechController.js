const { transcribeAudio } = require('../services/whisperService');

// @desc    Transcribe candidate speech to text using Whisper API
// @route   POST /api/speech/transcribe
const transcribe = async (req, res, next) => {
  try {
    const audioFile = req.file;
    const { fallbackText } = req.body;

    if (!audioFile && !fallbackText) {
      return res.status(400).json({
        success: false,
        message: 'No audio file or fallback text provided for speech recognition.',
      });
    }

    const filePath = audioFile ? audioFile.path : null;
    const result = await transcribeAudio(filePath, fallbackText);

    res.status(200).json({
      success: true,
      transcript: result.transcript,
      engine: result.engine,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { transcribe };
