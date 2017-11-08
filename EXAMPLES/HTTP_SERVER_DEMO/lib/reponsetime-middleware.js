module.exports = () => (req, res, next) => {
  res.setHeader("X-NPZ-ReponseTimeinMS", "");
  req.__meinFeld = () => "dkdkdk";
  next();
};
