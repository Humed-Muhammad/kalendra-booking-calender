import styled from "styled-components";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { Box } from "./Core";
import { useKalendra } from "./context/context";

const Wrapper = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 2px;
  border: 1px solid;
  // border-color: ${(props) => props.theme.colors?.border ?? "#333"};
  border-radius: 6px;
  width: 100%;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: #4a4a4a;
`;

const StyledPhoneInput = styled(PhoneInput)<{ themeName: string }>`
  .form-control {
    width: 100%;
    font-size: 16px;
    padding-left: 58px;
    border-radius: 0px;
    border: none;
    background-color: ${(props) =>
      props.theme.colors?.background ?? "transparent"};
    color: ${(props) =>
      (props.theme.colors?.text ?? props.themeName === "light")
        ? "#333"
        : "white"};
    transition: border 0.2s ease, box-shadow 0.2s ease;
    
    &:disabled {
      cursor: not-allowed;
    }
  }

  .flag-dropdown,
  .country-list {
    background-color: ${(props) =>
      (props.theme.colors?.background ?? props.themeName === "light")
        ? "#f0f0f0"
        : "#222"};
    border: none;
    border-radius: 0px;
    &:hover {
      background-color: ${(props) =>
        (props.theme.colors?.background ?? props.themeName === "light")
          ? "lightGray"
          : "#222"};
  }

  .country-list {
    z-index: 1000;
  }
  .country{
    &:hover {
      background-color: ${(props) =>
        (props.theme.colors?.dayBg ?? props.themeName === "light")
          ? "#f0f0f0"
          : "#333"};
    }
  }
    .highlight {
    background-color: ${(props) =>
      (props.theme.colors?.dayBg ?? props.themeName === "light")
        ? "lightGray"
        : "#333"} !important;
    }
`;

const HelperText = styled.p`
  font-size: 13px;
  color: #777;
`;

type PhoneNumberInputProps = {
  id: string;
  name: string;
  label?: string;
  placeholder?: string;
  handleChange?: (value: string) => void;
  values?: any;
  disabled?: boolean;
  field?: any;
  value?: string;
};
export const PhoneNumberInput = ({
  id,
  name,
  label,
  placeholder,
  value,
  disabled,
  handleChange,
  values = {},
  field = {},
}: PhoneNumberInputProps) => {
  const { themeMode: theme } = useKalendra();
  return (
    <Wrapper
      style={{
        borderColor: theme === "light" ? "lightGray" : "#333",
      }}
    >
      {label && <Label htmlFor={id}>{label}</Label>}
      <StyledPhoneInput
        themeName={theme}
        inputProps={{
          id,
          name,
          placeholder: placeholder || label,
          disabled,
        }}
        country={"us"}
        value={value}
        onChange={handleChange}
        disabled={disabled}
        autocompleteSearch
        countryCodeEditable
        enableSearch
        enableLongNumbers
      />
    </Wrapper>
  );
};
