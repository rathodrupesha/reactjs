export function convertStringToCamelCase(str) {
  return str
    .split(" ")
    .map((s) => {
      let ns = "";
      ns = s[0]?.toUpperCase();
      for (let i = 1; i < s.length; i++) ns += s[i];
      return ns;
    })
    .join(" ");
}
export const moduleOperationKeys = ["view", "create", "update", "delete"];

export const isModuleAccesible = (_module, operation = "any") => {
  let user = JSON.parse(localStorage.getItem("HamroSuperAdminInfo"));
  if (!user) return false;
  user = user[0];
  if (user.role_id === 2) return true;
  let accessible = false;
  let isAnyAccessible = false;
  user.module_access.forEach((mdl) => {
    if (mdl.access_module.module === _module) {
      Object.keys(mdl).forEach((op) => {
        if (op === operation && mdl[op] === true) accessible = true;
        if (mdl[op]) isAnyAccessible = true;
      });
    }
  });
  return operation === "any" ? isAnyAccessible : accessible;
};
