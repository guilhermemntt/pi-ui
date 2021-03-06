import PropTypes from "prop-types";
import React from "react";
import { classNames } from "../../utils";
import Icon from "../Icon/Icon.jsx";
import styles from "./styles.css";

const TextInput = ({
  type,
  label,
  id,
  error,
  wrapperClassNames,
  inputClassNames,
  ...props
}) => {
  return (
    <div className={classNames(styles.textinputWrapper, wrapperClassNames)}>
      <input
        id={id}
        placeholder=" "
        className={classNames(
          styles.textinput,
          error && styles.textinputError,
          inputClassNames
        )}
        type={type}
        {...props}
      />
      <label htmlFor={id} className={styles.textinputLabel}>
        {label}
      </label>
      <Icon
        type="alert"
        backgroundColor="#ed6d47"
        iconColor="#feb8a5"
        className={classNames(
          styles.errorIcon,
          error && styles.errorIconActive
        )}
      />
      <p
        className={classNames(styles.errorMsg, error && styles.errorMsgActive)}>
        {error}
      </p>
    </div>
  );
};

TextInput.propTypes = {
  type: PropTypes.string,
  label: PropTypes.string,
  id: PropTypes.string.isRequired,
  error: PropTypes.string,
  wrapperClassNames: PropTypes.string,
  inputClassNames: PropTypes.string
};

TextInput.defaultProps = {
  type: "text",
  label: "Label"
};

export default TextInput;
