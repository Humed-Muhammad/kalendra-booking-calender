import styled from "styled-components";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { Box } from "./Core/index";

const Wrapper = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 2px;
  border: 1px solid;
  border-color: ${(props: any) => props.theme.colors.border};
  border-radius: 6px;
  width: 100%;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: #4a4a4a;
`;

const StyledPhoneInput = styled(PhoneInput)`
  .form-control {
    width: 100%;
    font-size: 16px;
    padding-left: 58px;
    border-radius: 0px;
    border: none !important;
    transition: border 0.2s ease, box-shadow 0.2s ease;

    &:disabled {
      background-color: #f5f5f5;
      cursor: not-allowed;
    }
  }

  .flag-dropdown {
    // background-color: white;
    border: none;
    // border-radius: 12px 0 0 12px;
  }

  .country-list {
    z-index: 1000;
  }
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
}: PhoneNumberInputProps) => {
  return (
    <Wrapper>
      {label && <Label htmlFor={id}>{label}</Label>}
      <StyledPhoneInput
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
      />
    </Wrapper>
  );
};
