const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  // Get token from header
  const authHeader = req.header('Authorization');
  if (!authHeader) {
    return res.status(401).json({ success: false, error: { code: 'NO_TOKEN', message: 'No authorization header found' } });
  }

  // Token is usually "Bearer {token}"
  const token = authHeader.startsWith('Bearer ') ? authHeader.substring(7) : authHeader;

  if (!token) {
    return res.status(401).json({ success: false, error: { code: 'NO_TOKEN', message: 'No token, authorization denied' } });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'GullakSuperSecureJWTSecretKey172903');
    req.user = decoded.userId;
    next();
  } catch (err) {
    res.status(401).json({ success: false, error: { code: 'INVALID_TOKEN', message: 'Token is not valid' } });
  }
};
