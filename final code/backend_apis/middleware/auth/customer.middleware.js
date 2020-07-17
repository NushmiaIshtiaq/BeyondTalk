const isCustomer = (req, res, next) => {
  const user = req.user;
  if (user.role == "customer") return next();
  res.sendStatus(403);
};

export default isCustomer;
