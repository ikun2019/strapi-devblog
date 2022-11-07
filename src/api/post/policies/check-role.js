'use strict';

/**
 * `check-role` policy
 */

module.exports = (policyContext, config, { strapi }) => {
  // Add your own logic here.
  const { userRole } = config;

  const isEligible = policyContext.state.user && policyContext.state.user.role.code == userRole;

  if (isEligible) {
    return true;
  }

  return false;
};
