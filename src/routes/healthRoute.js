// const express = require("express");
import express from 'express';

const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "RentEase API is healthy",
    timestamp: new Date().toISOString(),
  });
});

// module.exports = router;
export default router;
