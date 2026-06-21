const express = require("express");
const cookieParser = require("cookie-parser");
const cron = require("node-cron");
const cors = require("cors");
require("dotenv").config();

const usersRouter = require("./routes/usersRouter");
const { errorHandler } = require("./middlewares/errorMiddleware");
const openAIRouter = require("./routes/openAIRouter");
const stripeRouter = require("./routes/stripeRouter");
const User = require("./models/User");

require("./utils/connectDB")();

const app = express();
const PORT = process.env.PORT || 8090;

// Cron for trial users
cron.schedule("0 0 * * * *", async () => {
  try {
    const today = new Date();

    await User.updateMany(
      {
        trialActive: true,
        trialExpires: { $lt: today },
      },
      {
        trialActive: false,
        subscriptionPlan: "Free",
        monthlyRequestCount: 5,
      }
    );
  } catch (error) {
    console.log(error);
  }
});

// Free Plan Reset
cron.schedule("0 0 1 * * *", async () => {
  try {
    const today = new Date();

    await User.updateMany(
      {
        subscriptionPlan: "Free",
        nextBillingDate: { $lt: today },
      },
      {
        monthlyRequestCount: 0,
      }
    );
  } catch (error) {
    console.log(error);
  }
});

// Basic Plan Reset
cron.schedule("0 0 1 * * *", async () => {
  try {
    const today = new Date();

    await User.updateMany(
      {
        subscriptionPlan: "Basic",
        nextBillingDate: { $lt: today },
      },
      {
        monthlyRequestCount: 0,
      }
    );
  } catch (error) {
    console.log(error);
  }
});

// Premium Plan Reset
cron.schedule("0 0 1 * * *", async () => {
  try {
    const today = new Date();

    await User.updateMany(
      {
        subscriptionPlan: "Premium",
        nextBillingDate: { $lt: today },
      },
      {
        monthlyRequestCount: 0,
      }
    );
  } catch (error) {
    console.log(error);
  }
});

// Middlewares
app.use(express.json());
app.use(cookieParser());

const corsOptions = {
  origin: [
    "http://localhost:3000",
    "https://your-frontend-url.onrender.com"
  ],
  credentials: true,
};

app.use(cors(corsOptions));

// Root Route
app.get("/", (req, res) => {
  res.send("MERN AI Backend Running Successfully 🚀");
});

// Routes
app.use("/api/v1/users", usersRouter);
app.use("/api/v1/openai", openAIRouter);
app.use("/api/v1/stripe", stripeRouter);

// Error Handler
app.use(errorHandler);

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});