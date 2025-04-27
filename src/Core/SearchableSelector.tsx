import { CSSProperties, useState } from "react";
import { Box, CenterRow } from "./Box/Box";
import { Text } from "./Text/Text";
import { CenterColumn } from "./Box/Box";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Input } from "./Input/Input";
import styled from "styled-components";
import { commonComposes } from "./common";

const StyledChevronDown = styled(ChevronDown)`
  color: ${(props: any) => props.theme.colors.text};
  width: 20px;
  transition: all 0.2s ease-in-out;
  ${commonComposes()}
`;
const StyledChevronUp = styled(ChevronUp)`
  color: ${(props: any) => props.theme.colors.text};
  width: 20px;
  transition: all 0.2s ease-in-out;
  ${commonComposes()}
`;
// Type definition for props
type Props = {
  value: string;
  onChange: (value: string) => void;
  options: {
    label?: string;
    value: string;
  }[];
  label?: string;
  placeholder?: string;
  showSuffix?: (timezone: string) => string;
  selectorStyle?: CSSProperties;
  disabled?: boolean;
  showBorder?: boolean;
};

export const SearchableSelector = ({
  value,
  onChange,
  options,
  label,
  placeholder,
  showSuffix,
  selectorStyle,
  disabled,
  showBorder,
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredOptions = options.filter((option) => {
    if (option.label) {
      return option.label?.toLowerCase().includes(searchTerm?.toLowerCase());
    }
    return option.value?.toLowerCase().includes(searchTerm?.toLowerCase());
  });

  return (
    <Box width="100%">
      {label && <Text>{label}</Text>}
      <Box
        bg="background"
        // border="1px solid gray"
        borderRadius={"4px"}
        cursor={disabled ? "not-allowed" : "pointer"}
        onClick={() => {
          if (disabled) return;
          setIsOpen(!isOpen);
        }}
        opacity={disabled ? 0.5 : 1}
      >
        {/* @ts-ignore */}
        <CenterRow
          width="100%"
          justifyContent="space-between"
          {...selectorStyle}
          borderColor={showBorder ? "border" : selectorStyle?.borderColor}
        >
          <Text fontSize="15px" truncate>
            {value || placeholder || "Select an option"}
          </Text>
          {isOpen ? <StyledChevronUp /> : <StyledChevronDown />}
        </CenterRow>
      </Box>
      {isOpen && (
        <Box
          position="absolute"
          bg="background"
          border="1px solid"
          borderColor="border"
          hideScrollBar
          borderRadius={"4px"}
          // width="100%"
          width={"200px"}
          mt={1}
          zIndex={99999999}
          maxHeight="300px"
          overflowY="scroll"
          overflowX="hidden"
          onBlur={() => {
            setTimeout(() => {
              setIsOpen(false);
            }, 350);
          }}
        >
          <Box p={2}>
            <Input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: "100%",
                padding: "8px",
                paddingTop: 6,
                paddingBottom: 6,
                fontSize: "14px",
                outline: "none",
              }}
              autoFocus
            />
          </Box>
          <CenterColumn px={1}>
            {filteredOptions.length > 0 ? (
              filteredOptions?.map((option) => (
                <Box
                  key={option.value}
                  padding={2}
                  cursor="pointer"
                  bg={value === option.value ? "lightGray" : "background"}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  borderRadius={"4px"}
                >
                  <Text variant="light" style={{ wordWrap: "break-word" }}>
                    {option.label ?? option.value}{" "}
                    {showSuffix && showSuffix(option.value)}
                  </Text>
                </Box>
              ))
            ) : (
              <Text p={2}>No results found</Text>
            )}
          </CenterColumn>
        </Box>
      )}
    </Box>
  );
};
