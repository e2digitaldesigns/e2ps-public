import React, { useState } from "react";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import _ from "lodash";
import Pagination from "react-bootstrap/Pagination";

import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";

const PaginationUI = ({ itemsCount, currentPage, pageSize, onPageChange }) => {
  const pagesCount = Math.ceil(itemsCount / pageSize);
  if (pagesCount <= 1) return null;
  const pages = _.range(1, pagesCount + 1);

  return (
    <>
      <Pagination size="sm">
        <Pagination.First
          className={currentPage <= 1 ? "disabled" : "undefined"}
          onClick={() => onPageChange(1)}
        />

        <Pagination.Prev
          className={currentPage <= 1 ? "disabled" : "undefined"}
          onClick={() => onPageChange(currentPage - 1)}
        />

        {pages.map(page => (
          <Pagination.Item
            key={page}
            active={currentPage === page}
            onClick={() => onPageChange(page)}
          >
            {page}
          </Pagination.Item>
        ))}

        <Pagination.Next
          className={currentPage === pagesCount ? "disabled" : "undefined"}
          onClick={() => onPageChange(currentPage + 1)}
        />

        <Pagination.Last
          className={currentPage === pagesCount ? "disabled" : "undefined"}
          onClick={() => onPageChange(pagesCount)}
        />
      </Pagination>
    </>
  );
};

PaginationUI.propTypes = {
  itemsCount: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

export default PaginationUI;

export const Paginate = (items, pageNumber, pageSize) => {
  const startIndex = (pageNumber - 1) * pageSize;
  return _(items).slice(startIndex).take(pageSize).value();
};

export const SearchFilter = ({
  pageSize,
  filter,
  domainId = null,
  handleDomainChange = null,
  handleFilterChange,
  handlePageSizeChange,
  storeFilter = false,
}) => {
  const storeFronts = useSelector(state => state.system.storeFronts);
  const perPage = [5, 10, 25, 50, 100];
  const [resultsPerPage, SetResultsPerPage] = useState(pageSize);

  function updatePerPage(num) {
    SetResultsPerPage(num);
    handlePageSizeChange(num);
  }

  function domainName() {
    let theDomain =
      domainId === ""
        ? "Store"
        : storeFronts.find(f => f._id === domainId).domain;
    return theDomain;
  }

  return (
    <React.Fragment>
      <InputGroup size="sm">
        <DropdownButton
          as={InputGroup.Prepend}
          variant="primary"
          title={resultsPerPage + " Results Per Page "}
        >
          {perPage.map(m => (
            <Dropdown.Item key={m} onClick={() => updatePerPage(m)}>
              {m}
            </Dropdown.Item>
          ))}
        </DropdownButton>

        {storeFilter && (
          <DropdownButton
            as={InputGroup.Prepend}
            variant="secondary"
            title={domainName()}
          >
            <Dropdown.Item onClick={e => handleDomainChange(e, "")}>
              {"All Stores"}
            </Dropdown.Item>

            {storeFronts.map(m => (
              <Dropdown.Item
                key={m._id}
                onClick={e => handleDomainChange(e, m._id)}
              >
                {m.domain + " - " + m.name}
              </Dropdown.Item>
            ))}
          </DropdownButton>
        )}

        <FormControl
          aria-describedby="basic-addon1"
          value={filter}
          onChange={e => handleFilterChange(e)}
        />

        {/* <Button
          variant="primary"
          type="submit"
          size="sm"
          as={InputGroup.Append}
        >
          Search
        </Button> */}
      </InputGroup>
    </React.Fragment>
  );
};
