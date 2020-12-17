import { useState, useRef, useEffect } from "react";
import { usePrevious } from "hooks";
import {
  useHandleKeyboardHook,
  useHandleKeyboardHookBasicParameters
} from "../hooks";
import { blankValue, matchOption, uniqueOptionsByModifier } from "../helpers";

const newFirstOption = {
  label: "",
  value: "",
  onClick: null
};

export function useCreatableSelect(
  disabled,
  onChange,
  options,
  getOptionLabel,
  optionsFilter,
  searchable,
  value,
  inputValue,
  onInputChange,

  focusedOptionIndex,
  setFocusedOptionIndex,
  menuOpened,
  selectOption,
  setMenuOpened,

  typeLabel,
  isValidNewOption,
  newOptionCreator,
  promptTextCreator,
  _options,
  setOptions,
  setOption
) {
  const newOptions = useRef([]);
  const [showError, setShowError] = useState(false);
  const [addingNewOption, setAddingNewOption] = useState(false);
  const [firstOption, setFirstOption] = useState(null);

  useEffect(() => {
    if (disabled) return;
    if (optionsFilter && !optionsFilter(value) && getOptionLabel(value)) {
      onInputChange("");
      onChange(blankValue);
    }
  }, [disabled, value, optionsFilter, onInputChange, getOptionLabel, onChange]);

  const newOptionCreatorCallback = () => {
    if (newOptionCreator) newOptionCreator(inputValue);
    const newOptionObject = { label: inputValue, value: inputValue };
    newOptions.current.push(newOptionObject);
    setOption(newOptionObject);
  };

  newFirstOption.label =
    addingNewOption && inputValue ? promptTextCreator(inputValue) : typeLabel;
  newFirstOption.value = "";
  newFirstOption.onClick =
    addingNewOption && inputValue ? newOptionCreatorCallback : () => {};

  const previousInputValue = usePrevious(inputValue);

  useEffect(() => {
    if (previousInputValue !== inputValue) setFirstOption(newFirstOption);
  }, [inputValue, previousInputValue]);

  useEffect(() => {
    let updatedOptions = uniqueOptionsByModifier(
      [...options, ...newOptions.current],
      getOptionLabel
    );
    if (optionsFilter) updatedOptions = updatedOptions.filter(optionsFilter);
    if (addingNewOption && searchable && inputValue)
      updatedOptions = matchOption(updatedOptions, getOptionLabel, inputValue);
    updatedOptions.unshift(firstOption);
    setOptions(updatedOptions);
  }, [
    addingNewOption,
    inputValue,
    options,
    getOptionLabel,
    optionsFilter,
    searchable,
    firstOption,
    setOptions
  ]);

  const {
    onTypeArrowDownHandler,
    onTypeArrowUpHandler
  } = useHandleKeyboardHookBasicParameters(
    menuOpened,
    _options,
    focusedOptionIndex,
    setFocusedOptionIndex,
    inputValue,
    onInputChange,
    searchable
  );

  const onTypeDefaultHandler = (e) => {
    if (!menuOpened) return;
    if (!inputValue && String.fromCharCode(e.keyCode).match(/(\w|\s)/g)) {
      setAddingNewOption(true);
      onInputChange(e.key);
      e.preventDefault();
    }
  };

  useHandleKeyboardHook(
    onTypeArrowDownHandler,
    onTypeArrowUpHandler,
    selectOption,
    onTypeDefaultHandler
  );

  const onSearch = (e) => {
    const newOption = e.target.value;
    const hasError = isValidNewOption && !isValidNewOption(newOption);
    if (
      newOption &&
      optionsFilter &&
      !optionsFilter({ label: newOption, value: newOption })
    )
      setAddingNewOption(false);
    else setAddingNewOption(!!newOption);
    onInputChange(newOption);
    setShowError(hasError);
    setMenuOpened(!hasError);
  };

  return {
    showError,
    onSearch
  };
}
