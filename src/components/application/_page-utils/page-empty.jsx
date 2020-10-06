import React from "react";
import { Link } from "react-router-dom";
import PageHeader from "../../template/main-content/page-header";

export default ({ pageName, icon, title, subTitle, action = null }) => {
  return (
    <>
      <PageHeader pageName={pageName} />
      <div className="empty">
        <div className="empty-icon">
          <span className="material-icons md-48">{icon}</span>
        </div>
        <p className="empty-title h5">{title}</p>
        <p className="empty-subtitle">{subTitle}</p>
        {action && (
          <div className="empty-action">
            <Link to={action.link} className="btn btn-primary">
              <span className="material-icons md-light">{icon}</span>{" "}
              {action.text}
            </Link>
          </div>
        )}
      </div>
    </>
  );
};
