import React from "react";
import PropTypes from "prop-types";
import { useMultiSelect } from "./hooks";
import { classNames } from "../../../utils";
import styles from "./styles.css";
import { animated, useTransition } from "react-spring";

const MultiSelect = ({
  disabled,
  clearable,
  options,
  defaultValues,
  label,
  separator,
  onChange,
  getOptionLabel,
  getOptionValue,
  optionRenderer,
  valueRenderer,
  filterOptions,
  className,
  autoFocus,
  isSearchable,
  ...props
}) => {
  const {
    _options,
    optionContainerRef,
    dropdownRef,
    menuOpened,
    selectedOptions,
    focusedOptionIndex,
    openMenu,
    setFocusedOptionIndex,
    getValueKey,
    getLabelKey,
    selectOption,
    cancelSelection,
    removeSelectedOption,
    searchingFor,
    onSearch
  } = useMultiSelect(
    disabled,
    autoFocus,
    onChange,
    options,
    defaultValues,
    getOptionLabel,
    getOptionValue,
    filterOptions,
    isSearchable
  );

  const parentClassNames = classNames(
    styles.select,
    selectedOptions.length && styles.valueSelected,
    isSearchable && searchingFor && styles.search,
    menuOpened ? styles.menuOpened : styles.menuClosed,
    separator && styles.hasSeparator,
    clearable && styles.clearable,
    disabled && styles.disabled,
    className
  );

  const transitions = useTransition(menuOpened, null, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    duration: 100
  });

  return (
    <div className={parentClassNames} {...props}>
      <div className={styles.fieldset}>
        {label && <label className={styles.label}>{label}</label>}
        <div className={styles.controls} onClick={openMenu} ref={dropdownRef}>
          {isSearchable && searchingFor ? (
            <input
              disabled={disabled}
              className={styles.input}
              value={searchingFor}
              onChange={onSearch}
              autoFocus
            />
          ) : (
            <div className={styles.values}>
              {selectedOptions.length > 0 &&
                selectedOptions.map((selectedOption, index) => (
                  <div className={styles.selectedOption} key={index}>
                    {valueRenderer
                      ? valueRenderer(selectedOption)
                      : getLabelKey(selectedOption)}
                    <div
                      className={styles.removeOption}
                      onClick={() => removeSelectedOption(selectedOption)}
                    />
                  </div>
                ))}
            </div>
          )}
          {clearable && (
            <div className={styles.clear} onClick={cancelSelection} />
          )}
          {separator && <span className={styles.separator} />}
          <div className={styles.arrowContainer}>
            <div className={styles.arrow} />
          </div>
        </div>
        {transitions.map(
            ({ item, key, props }) =>
              item && (
                <animated.div
                  className={styles.menu}
                  key={key}
                  ref={optionContainerRef}
                  style={props}>
                  {_options.map((_option, index) => (
                    <div
                      onClick={selectOption}
                      onMouseEnter={() => setFocusedOptionIndex(index)}
                      key={index}
                      index={index}
                      className={classNames(
                        index === focusedOptionIndex && styles.focusedOption,
                        selectedOptions.find(
                          (selectedOption) =>
                            getValueKey(selectedOption) === getValueKey(_option)
                        ) && styles.selected
                      )}>
                      {optionRenderer
                        ? optionRenderer(_option)
                        : getLabelKey(_option)}
                    </div>
                  ))}
                </animated.div>
              )
          )}
      </div>
    </div>
  );
};

MultiSelect.propTypes = {
  disabled: PropTypes.bool,
  clearable: PropTypes.bool,
  options: PropTypes.array,
  defaultValues: PropTypes.array,
  label: PropTypes.string,
  separator: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  getOptionLabel: PropTypes.func,
  getOptionValue: PropTypes.func,
  optionRenderer: PropTypes.func,
  valueRenderer: PropTypes.func,
  filterOptions: PropTypes.func,
  className: PropTypes.string,
  autoFocus: PropTypes.bool,
  isSearchable: PropTypes.bool
};

MultiSelect.defaultProps = {
  disabled: false,
  clearable: false,
  options: [],
  defaultValues: [],
  label: "",
  separator: false,
  getOptionLabel: null,
  getOptionValue: null,
  optionRenderer: null,
  valueRenderer: null,
  filterOptions: null,
  className: "",
  autoFocus: false,
  isSearchable: false
};

export default MultiSelect;