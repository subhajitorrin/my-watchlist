import jwt from "jsonwebtoken";

function authToken(req, res, next) {
  const token = req.cookies.mywatchlisttoken;
  if (!token) {
    return res.status(401).json({
      message: "No token provided, authorization denied",
      success: false
    });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.id = decoded.id;
    req.email = decoded.email;
    req.name = decoded.name;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid token, authorization denied",
      success: false
    });
  }
}

export default authToken;
