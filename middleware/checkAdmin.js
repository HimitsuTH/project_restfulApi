module.exports.isAdmin = (req, res, next) => {
  const { role } = req.user;
  if (role.toLowerCase() === "admin") {
    next();
  } else {
    return res.status(403).json({
      error: {
        massage: "Admin only",
      },
    });
  }
};
