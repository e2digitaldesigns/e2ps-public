import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import _ from "lodash";
import { Link, useHistory, useLocation } from "react-router-dom";

import PageHeader from "../../../template/main-content/page-header";
import { getUserInvoiceItems } from "../../../../redux/actions/invoices/invoiceItemActions";
import { dateParser } from "../../../../_utils";

import usePrevious from "./../../../../_utils/custom-hooks/previous-state";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default props => {
  const query = useQuery();
  const history = useHistory();

  const type = props.match.params.type;

  const prevType = usePrevious(type);

  const dispatch = useDispatch();
  const redux = useSelector(state => state.invoiceItems);
  const listing = redux.dataSet;
  const resultTotal = redux.total;

  const [documentState, setDocumentState] = useState({
    docReady: false,
    updating: true
  });

  const [pageState, setPageState] = useState({
    page: query.get("page") ? parseInt(query.get("page")) : 1,
    results: query.get("results") ? parseInt(query.get("results")) : 10,
    st: query.get("st") ? query.get("st") : ""
  });

  const totalPages = Math.ceil(resultTotal / pageState.results);

  useEffect(() => {
    console.log(43);
    if (type !== prevType) {
      setPageState(pageState => ({
        ...pageState,
        page: 1,
        st: ""
      }));

      setDocumentState(documentState => ({
        ...documentState,
        docReady: true,
        updating: true
      }));
    }

    if (!documentState.updating) return;

    let stillHere = true;

    async function loadData() {
      try {
        const result = await dispatch(getUserInvoiceItems(type, pageState));

        if (result.error.errorCode === "0x0" && stillHere === true) {
          setDocumentState(documentState => ({
            ...documentState,
            docReady: true,
            updating: false
          }));
        }
      } catch (err) {
        if (stillHere === true) {
          setDocumentState(documentState => ({
            ...documentState,
            updating: false
          }));
        }
      }
    }

    loadData();

    return () => {
      stillHere = false;
    };
  }, [dispatch, type, documentState.updating, pageState, prevType]);

  const handleGetQuantity = data => {
    if (data.itemType === "design") return 1;

    const {
      activeProductSizeIndex,
      activeProductQuantityIndex
    } = data.theItem.selections;

    return data.theItem.productSizes[activeProductSizeIndex].quantities[
      activeProductQuantityIndex
    ].quantity;
  };

  const handlePagination = (e, page = 1) => {
    e.preventDefault();
    const linkage = `/account/history/${type}?page=${page}&mr=${pageState.results}&st=${pageState.st}`;
    setPageState({ ...pageState, page });
    setDocumentState({
      ...documentState,
      updating: true
    });

    history.push(linkage);
  };

  const handlePageStateChange = e => {
    e.preventDefault();
    let { name, value } = e.target;
    setPageState({ ...pageState, [name]: value });
  };

  if (documentState.docReady === false) return <></>;

  return (
    <>
      <PageHeader
        pageName={type === "orders" ? "Order History" : "Estimates"}
      />

      <div className="card">
        <div className="input-group">
          <input
            type="text"
            className="form-input"
            name="st"
            value={pageState.st}
            placeholder="..."
            onChange={e => handlePageStateChange(e)}
          />
          <button
            className="btn btn-primary input-group-btn"
            onClick={e => handlePagination(e)}
          >
            Search
          </button>
        </div>
      </div>

      <table className="table table-striped table-hover">
        <thead>
          <tr>
            <th>Date</th>
            <th>Order #</th>
            <th>Qty</th>
            <th>Product</th>
            <th>Price</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {listing.map((m, index) => (
            <tr key={index}>
              <td>{dateParser(m.orderDate, "xs")}</td>
              <td>
                <Link to={`/account/invoice/${m.invoiceId}`}>{m.orderId}</Link>
              </td>
              <td>{handleGetQuantity(m)}</td>
              <td>{m.theItem.displayName}</td>
              <td>${m.item.itemPrice}</td>
              <td>{m.status}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <ul className="pagination">
        <li className={`page-item ${pageState.page === 1 && "disabled"}`}>
          <a href="/#" onClick={e => handlePagination(e, pageState.page - 1)}>
            Prev
          </a>
        </li>

        {_.range(totalPages).map(m => (
          <li
            key={m}
            className={`page-item ${pageState.page === m + 1 && "active"}`}
          >
            <a href="/#" onClick={e => handlePagination(e, m + 1)}>
              {m + 1}
            </a>
          </li>
        ))}

        <li
          className={`page-item ${pageState.page === totalPages && "disabled"}`}
        >
          <a href="/#" onClick={e => handlePagination(e, pageState.page + 1)}>
            Next
          </a>
        </li>
      </ul>
    </>
  );
};
