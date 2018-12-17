import _ from "lodash";

export default email => {
  if (_.isNull(email) || !_.isString(email) || _.isEmpty(email)) return false;

  if (false === /illinois.gov/.test(email)) return false;

  return true;
};
