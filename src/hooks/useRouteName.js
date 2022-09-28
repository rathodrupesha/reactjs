import routes from "routes";

export const useRouteName = () => {
  let name = "";
  routes.forEach((route) => {
    if (route.type === "menu") {
      route.items.forEach((item) => {
        if (window.location.href.indexOf(item.layout + item.path) !== -1) {
          name = routes.rtlActive ? item.rtlName : item.name;
        }
      });
    } else {
      if (window.location.href.indexOf(route.layout + route.path) !== -1) {
        name = routes.rtlActive ? route.rtlName : route.name;
      }
    }
  });
  return name;
};
