const isEmployee = (req, res, next) => {
  const user = req.user;
  if (user.role == "employee") return next();
  res.sendStatus(403);
};

export default isEmployee;
