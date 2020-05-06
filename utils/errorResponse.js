const errorResponse = (res, error) => {
  console.log(error);
  res.status(500).json({ error: "Server error" });
};

module.exports = errorResponse;
