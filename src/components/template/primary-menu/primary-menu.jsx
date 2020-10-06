import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";

export default () => {
  const history = useHistory();
  const system = useSelector(state => state.system);
  const products = system.products;
  const [menuState, setMenuState] = useState({ menuOpen: true });

  useEffect(() => {
    let stillHere = true;

    if (stillHere) {
      setMenuState(menuState => ({ ...menuState, menuOpen: false }));
    }

    return () => {
      stillHere = false;
    };
  }, []);

  useEffect(() => {
    console.log(12);
    let stillHere = true;

    history.listen(location => {
      if (stillHere) {
        setMenuState(menuState => ({ ...menuState, menuOpen: false }));
      }
    });

    return () => {
      stillHere = false;
    };
  }, [history]);

  const menuToggle = () => {
    setMenuState({ ...menuState, menuOpen: !menuState.menuOpen });
  };

  return (
    <div className="storefront-primary-menu-container">
      <div className="storefront-primary-menu-brand">
        <div className="name">{system.name}</div>
        <div className="burger">
          <span
            className="icon material-icons md-24 pointer"
            onClick={menuToggle}
          >
            menu
          </span>
        </div>
      </div>
      <div className="storefront-primary-menu">
        <ul
          className={`storefront-primary-menu-ul ${
            menuState.menuOpen && "primary-menu-open"
          }`}
        >
          <li>
            <Link to="/home">Home</Link>
          </li>
          <li>
            <Link to="/start-order">Start Order</Link>
          </li>

          <li>
            <Link to="/print">Print</Link>

            {products.print.length > 0 && (
              <ul>
                {products.print.map((m, i) => (
                  <li key={i}>
                    <Link to={`/print/${m.url}`}> {m.displayName}</Link>
                  </li>
                ))}
              </ul>
            )}
          </li>

          {products.design.length > 0 && (
            <>
              <li>
                <Link to="/design">Design</Link>
                <ul>
                  {products.design.map((m, i) => (
                    <li key={i}>
                      <Link to={`/design/${m.url}`}> {m.displayName}</Link>
                    </li>
                  ))}
                </ul>
              </li>
            </>
          )}

          <li>
            <Link to="/wide-format">Wide Format </Link>

            {products.wideFormat.length > 0 && (
              <ul>
                {products.wideFormat.map((m, i) => (
                  <li key={i}>
                    <Link to={`/wide-format/${m.url}`}> {m.displayName}</Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
          {/* <li>
            <Link to="/quote-request">Custom Quote</Link>
          </li> */}
          <li className="primary-menu-right">
            <Link to="/contact">Contact Us</Link>
          </li>
        </ul>
      </div>
    </div>
  );
};
