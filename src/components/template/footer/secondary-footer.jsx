import React from "react";
import { Link } from "react-router-dom";

export default () => {
  return (
    <div className="storefront-secondary-footer">
      Copyright © 2020 Express Layouts All Rights Reserved. <br />
      <Link to="/c/login">Administrative Login</Link> | Powered by E2Print
      Software
    </div>
  );
};
