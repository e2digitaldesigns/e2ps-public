import React, { useEffect, useState } from "react";
import axios from "axios";
import PageHeader from "../../template/main-content/page-header";

export default props => {
  const url = props.match.params.url;

  const [pageState, setPageState] = useState({
    name: " Loading...",
    info: " "
  });

  useEffect(() => {
    let stillHere = true;

    async function loadData() {
      const { data } = await axios.get(
        `${process.env.REACT_APP_REST_API}pages/storeFront/${url}`
      );

      if (data.error.errorCode === "0x0" && stillHere) {
        setPageState(pageState => ({
          name: data.dataSet.name,
          info: data.dataSet.info
        }));
      }
      try {
      } catch (err) {}
    }

    loadData();

    return () => {
      stillHere = false;
    };
  }, [url]);

  return (
    <>
      <PageHeader pageName={pageState.name} />

      {pageState.info.split("\n").map((item, key) => {
        return (
          <React.Fragment key={key}>
            {item}
            <br />
          </React.Fragment>
        );
      })}
    </>
  );
};
