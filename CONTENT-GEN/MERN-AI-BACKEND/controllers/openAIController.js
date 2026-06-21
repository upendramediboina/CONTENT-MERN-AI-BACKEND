const asyncHandler = require("express-async-handler");
const ContentHistory = require("../models/ContentHistory");
const User = require("../models/User");

// ---- Demo AI Controller ----

const openAIController = asyncHandler(async (req, res) => {
  const { prompt } = req.body;

  try {
    const content = `
# AI Generated Content

Topic: ${prompt}

${prompt} is an important topic in today's world.

This is a demo AI-generated article created for testing purposes.

Key Points:
- Easy to understand
- Professional writing style
- Suitable for blogs and articles
- Generated without OpenAI or Gemini APIs

Benefits:
1. Saves time
2. Improves productivity
3. Helps create content quickly
4. Useful for testing MERN applications

Conclusion:
This content was generated in demo mode. Your MERN AI Content Generator application, authentication system, MongoDB database, content history, and frontend integration are all working correctly.

You can replace this demo response with OpenAI, Gemini, Claude, or any other AI provider later.
`;

    const newContent = await ContentHistory.create({
      user: req?.user?._id,
      content,
    });

    const userFound = await User.findById(req?.user?.id);

    if (userFound) {
      userFound.contentHistory.push(newContent._id);
      userFound.apiRequestCount += 1;
      await userFound.save();
    }

    res.status(200).json(content);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = {
  openAIController,
};  