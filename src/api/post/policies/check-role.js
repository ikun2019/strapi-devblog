'use strict';

/**
 * `check-role` policy
 */

module.exports = (policyContext, config, { strapi }) => {
  // Add your own logic here.
  const { userRole } = config;
  // console.log(policyContext.state.user.role.name);
  const isEligible = policyContext.state.user && policyContext.state.user.role.name == userRole;

  if (isEligible) {
    return true;
  }

  return false;
};
