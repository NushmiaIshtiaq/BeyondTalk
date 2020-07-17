const isAdmin = (req, res, next) => {
  const user = req.user;
  if (user.role == "admin") return next();
  res.sendStatus(403);
};

export default isAdmin;
