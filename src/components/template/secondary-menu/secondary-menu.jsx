import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";

import AccountMenu from "./account-menu";

export default () => {
  const system = useSelector(state => state.system);
  const { products, storeFrontSettings } = system;
  const history = useHistory();
  const [menuState, setMenuState] = useState({ primaryMenu: "print" });
  let url = history.location.pathname.split("/")[1];

  const defaultMenu = storeFrontSettings.template.defaultMenu;

  useEffect(() => {
    console.log(18);
    let stillHere = true;
    let primaryMenu;

    const getMenu = url => {
      let data;
      switch (url) {
        case "account":
          data = "account";
          break;

        case "design":
          data = "design";
          break;

        case "print":
          data = "print";
          break;

        case "wide-format":
          data = "wide-format";
          break;

        default:
          data = defaultMenu;
          break;
      }

      return data;
    };

    if (stillHere) {
      primaryMenu = getMenu(url);
      setMenuState(menuState => ({
        ...menuState,
        primaryMenu,
        secondaryMenu: primaryMenu !== defaultMenu ? defaultMenu : ""
      }));
    }

    history.listen(location => {
      primaryMenu = getMenu(location.pathname.split("/")[1]);

      if (stillHere) {
        setMenuState(menuState => ({
          ...menuState,
          primaryMenu,
          secondaryMenu: primaryMenu !== defaultMenu ? defaultMenu : ""
        }));
      }
    });

    return () => {
      stillHere = false;
    };
  }, [defaultMenu, history, url]);

  const itemMenu = (menuType, header) => {
    return (
      <>
        <ul>
          <li className="storefront-secondary-menu-header">{header}</li>
          {products[menuType].map((m, i) => (
            <li key={i}>
              <Link to={`/${menuType}/${m.url}`}> {m.displayName}</Link>
            </li>
          ))}
        </ul>
      </>
    );
  };

  return (
    <div className="storefront-secondary-menu">
      {menuState.primaryMenu === "account" && <AccountMenu />}
      {menuState.primaryMenu === "print" && itemMenu("print", "Print")}
      {menuState.primaryMenu === "design" && itemMenu("design", "Design")}

      {menuState.secondaryMenu === "print" && itemMenu("print", "Print")}
      {menuState.secondaryMenu === "design" && itemMenu("design", "Design")}
    </div>
  );
};
