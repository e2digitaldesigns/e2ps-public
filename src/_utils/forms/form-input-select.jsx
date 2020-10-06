import React from "react";
import { FormStates } from "./states";

export default ({
  type = "text",
  rows = 5,
  name,
  displayName,
  value,
  onChange,
  options = [],
  placeholder,
  theOptions = null,
  labelSize = ["", "col-4 col-sm-12"],
  required = false
}) => {
  const handleOptionParser = () => {
    if (options === "states") return <FormStates />;

    if (theOptions !== null) return theOptions;

    return (
      <>
        {options.map((m, i) => (
          <option key={i} value={m.value}>
            {m.display}
          </option>
        ))}
      </>
    );
  };

  return (
    <div className="form-group mb-4">
      {labelSize[0] && (
        <div className={labelSize[0]}>
          <label className="form-label form-label-text-align" htmlFor={name}>
            {displayName}
          </label>
        </div>
      )}
      <div className={labelSize[1]}>
        {type === "select" ? (
          <select
            className="form-select"
            name={name}
            value={value}
            onChange={e => onChange(e)}
          >
            {handleOptionParser()}
          </select>
        ) : type === "textarea" ? (
          <textarea
            className="form-input"
            rows={rows}
            name={name}
            value={value}
            onChange={e => onChange(e)}
            placeholder={placeholder}
          />
        ) : (
          <input
            className="form-input"
            type={type}
            name={name}
            value={value}
            onChange={e => onChange(e)}
            placeholder={placeholder}
            required={required}
          />
        )}
      </div>
    </div>
  );
};
