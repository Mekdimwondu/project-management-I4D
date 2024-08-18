// middleware/auth.js

const jwt = require('jsonwebtoken');

const authMiddlewere = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ','');
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }
  
  try {
     jwt.verify(token, process.env.JWT_SECRET,(err, decoded) => {
      if (err) {
        return res.status(500).json({ message: 'Failed to authenticate token' ,err});
      }
  console.log(decoded)
      req.user = decoded;
      next();
    });
    
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = authMiddlewere;
