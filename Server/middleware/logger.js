module.exports = (req, res, next) => {
  const user = req.userData ? `${req.userData.username || req.userData.userId} (${req.userData.role})` : 'Anonymous';
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} - User: ${user}`);
  next();
};
