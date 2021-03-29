import store from '../../redux/store';

import rules from "./rules";

export const hasPermission = (action) => {
  const { user: { role } } = store.getState();

  if (role === 'admin') {
    // Admin users should not see login and signup if they're logged in
    // This avoid flashing content when checking for guestOnly role
    return !['signup:view', 'login:view'].includes(role);
  }

  const permissions = rules[role];
  if (!permissions) {
    // role is not present in the rules
    return false;
  }

  const staticPermissions = permissions.static;

  if (staticPermissions && staticPermissions.includes(action)) {
    // static rule not provided for action
    return true;
  }

  const dynamicPermissions = permissions.dynamic;

  if (dynamicPermissions) {
    const permissionCondition = dynamicPermissions[action];
    if (!permissionCondition) {
      // dynamic rule not provided for action
      return false;
    }

    return permissionCondition();
  }
  return false;
};

const Can = ({
  perform,
  yes = () => null,
  no = () => null,
}) => (hasPermission(perform) ? yes() : no());

export default Can;
