export default email => {
  // probably already handled by the required flag
  if (_.isNull(email) || !_.isString(email) || _.isEmpty(email)) return false;

  if (false === /illinois.gov/.test(email)) return false;

  return true;
};
