import React, { useState, useRef, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { CenterColumn, CenterRow, Text } from "./Core";
import { Input } from "./Core/Input/Input";
import { SearchableSelector } from "./Core/SearchableSelector";
import { Button } from "./Core/Button/Button";
import { Checkbox } from "./Core/Checkbox";
import { Radio } from "./Core/Radio";
import { format } from "date-fns";
import { ChromePicker, ColorResult } from "react-color";
import type { ContentType, DynamicFormTypes } from "./types/type";
import { LoadingDots } from "./icons";
import { FormikObserver } from "./FormikObserver";
import { PhoneNumberInput } from "./PhoneNumberInput";

// Sample fields array (can be dynamically fetched or passed as props)
// const fields = [
//   {
//     id: "4g269y9cm",
//     identifier: "profileId",
//     label: "Profile Id",
//     placeholder: "Profile ID",
//     required: true,
//     type: "number",
//   },
//   {
//     disableIfPrefilled: true,
//     id: "hy0evf8jv",
//     identifier: "fruts",
//     label: "Select all that apply",
//     options: [
//       { id: "jjbih1uw2", value: "Orange" },
//       { id: "ikh5mbase", value: "Apple" },
//       { id: "2ztitpkls", value: "Carrot" },
//     ],
//     required: true,
//     type: "checkbox",
//   },
//   {
//     id: "riq2ww5dy",
//     label: "Phone number",
//     placeholder: "Please add your phone number",
//     required: false,
//     type: "phone",
//   },
//   {
//     id: "sit5ewvuo",
//     label: "Which one represents you",
//     options: [
//       { id: "k00kz23i8", value: "Teen" },
//       { id: "dn5ukq7nc", value: "Adult" },
//       { id: "zc7p1ov8q", value: "Elderly" },
//     ],
//     required: false,
//     type: "multipleChoice",
//   },
//   {
//     id: "ch723efuu",
//     label: "Check box",
//     options: [
//       { id: "9dy3y35mm", value: "Option 1" },
//       { id: "977j0bkji", value: "Op 2" },
//     ],
//     required: false,
//     type: "checkbox",
//   },
//   {
//     id: "cpcvei2kz",
//     identifier: "color",
//     label: "Dropdown",
//     options: [{ id: "l7az974dy", value: "Option 1" }],
//     required: false,
//     type: "dropdown",
//   },
//   {
//     id: "cu9f7wtdm",
//     identifier: "job",
//     label: "Radio Button",
//     options: [
//       { id: "yidyh7a1d", value: "Option 1" },
//       { id: "pyhddl3zd", value: "New Option" },
//     ],
//     required: true,
//     type: "radio",
//   },
//   {
//     id: "zg6l66tqz",
//     identifier: "date",
//     label: "Date Question",
//     required: true,
//     type: "date",
//   },
//   {
//     id: "btqk4j7na",
//     identifier: "address",
//     label: "Your Address",
//     required: false,
//     type: "address",
//   },
//   {
//     id: "xsxs3or18",
//     identifier: "url",
//     label: "Your website",
//     placeholder: "website",
//     required: false,
//     type: "url",
//   },
//   {
//     id: "t1zffeyys",
//     identifier: "tell_us_more",
//     label: "Additional Info",
//     placeholder: "Additional Info",
//     required: false,
//     type: "textarea",
//   },
// ];

// Function to dynamically build Yup validation schema
const buildValidationSchema = (
  fields: Array<DynamicFormTypes>,
  content?: ContentType,
) => {
  const schema = {};

  fields?.forEach((field) => {
    const { identifier, type, required, hidden, label, disallowSpecialChars } =
      field;

    let stringValidator = Yup.string();
    let emailValidator = Yup.string()
      .max(50, "Email can not be more than 50 characters")
      .email("Invalid email");
    let numberValidator = Yup.number();
    let dateValidator = Yup.date();
    let urlValidator = Yup.string().url("Invalid URL");
    let arrayValidator = Yup.array();

    if (required && !hidden) {
      const requiredMsg = `${content?.required ?? "Required"}`;
      stringValidator = stringValidator.required(requiredMsg);
      emailValidator = emailValidator.required(requiredMsg);
      numberValidator = numberValidator.required(requiredMsg);
      dateValidator = dateValidator.required(requiredMsg);
      urlValidator = urlValidator.required(requiredMsg);
      arrayValidator = arrayValidator.min(1, requiredMsg);
    }

    // if (maxLength) {
    stringValidator = stringValidator.max(
      type === "textarea" ? 1000 : 100,
      `${label ?? identifier} must be at most ${
        type === "textarea" ? 1000 : 100
      } characters`,
    );
    // }

    if (disallowSpecialChars) {
      stringValidator = stringValidator.matches(
        /^[a-zA-Z0-9\s]*$/,
        `${label ?? identifier} cannot contain special characters`,
      );
    }

    switch (type) {
      case "number":
        (schema as Record<string, any>)[identifier] = numberValidator;
        break;
      case "phone":
        (schema as Record<string, any>)[identifier] = stringValidator
          .matches(/^\+?\d{10,15}$/, "Phone number is invalid")
          .nullable();
        break;
      case "radio":
        (schema as Record<string, any>)[identifier] =
          stringValidator.nullable();
        break;
      case "checkbox":
        (schema as Record<string, any>)[identifier] = arrayValidator;
        break;
      case "dropdown":
      case "multipleChoice":
        (schema as Record<string, any>)[identifier] =
          stringValidator.nullable();
        break;
      case "date":
        (schema as Record<string, any>)[identifier] = dateValidator.required(
          `${label ?? "Date"} is required`,
        );
        break;
      case "url":
        (schema as Record<string, any>)[identifier] = urlValidator.nullable();
        break;
      case "textarea":
      case "text":
        (schema as Record<string, any>)[identifier] =
          stringValidator.nullable();
        break;
      case "email":
        (schema as Record<string, any>)[identifier] = emailValidator.nullable();
        break;
      case "color":
        (schema as Record<string, any>)[identifier] =
          stringValidator.nullable();
        break;
    }
  });

  return Yup.object().shape(schema);
};

// Dynamic form component
type DynamicFormProps = {
  onBack: () => void;
  fields: Array<DynamicFormTypes>;
  bookingQuestions?: any;
  onSubmit: (values: any) => void;
  isLoading: boolean;
  content?: ContentType | undefined;
  setBookingQuestions: (questions: any) => void;
};
export const DynamicForm = ({
  onBack,
  onSubmit,
  setBookingQuestions,
  isLoading,
  fields,
  bookingQuestions,
  content,
}: DynamicFormProps) => {
  const [questions, setQuestions] = useState<any>({});
  const [validateOnChange, setValidateOnChange] = useState(false);
  const handleDisable = (identifier: string, field: DynamicFormTypes) => {
    return bookingQuestions?.[identifier] && field?.disableIfPrefilled
      ? true
      : false;
  };
  useEffect(() => {
    setQuestions((prev: any) => ({
      ...(bookingQuestions ?? {}),
      ...(prev ?? {}),
    }));
  }, [bookingQuestions]);
  const ColorField: React.FC<{
    id: string;
    identifier: string;
    label?: string;
    value: any;
    disabled: boolean;
    setFieldValue: (f: string, v: any) => void;
  }> = ({ id, identifier, label, value, disabled, setFieldValue }) => {
    const parseColor = (str?: string) => {
      if (!str) return null;
      const trimmed = String(str).trim();
      const hexMatch = /^#([0-9a-fA-F]{3,8})$/i.exec(trimmed);
      if (hexMatch) return { hex: trimmed };

      const rgbMatch =
        /^rgb\s*\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/i.exec(
          trimmed,
        );
      if (rgbMatch)
        return {
          r: Number(rgbMatch[1]),
          g: Number(rgbMatch[2]),
          b: Number(rgbMatch[3]),
        };

      const rgbaMatch =
        /^rgba\s*\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(0|1|0?\.\d+)\s*\)$/i.exec(
          trimmed,
        );
      if (rgbaMatch)
        return {
          r: Number(rgbaMatch[1]),
          g: Number(rgbaMatch[2]),
          b: Number(rgbaMatch[3]),
          a: Number(rgbaMatch[4]),
        };

      return null;
    };

    const initial = value || "";
    const [inputValue, setInputValue] = useState<string>(initial);
    const parsed = parseColor(initial);
    const [pickerColor, setPickerColor] = useState<any>(
      parsed && parsed.hex ? parsed.hex : parsed || { r: 0, g: 0, b: 0, a: 1 },
    );

    const [open, setOpen] = useState(false);
    const pickerRef = useRef<HTMLDivElement | null>(null);
    const swatchRef = useRef<HTMLButtonElement | null>(null);

    useEffect(() => {
      const onDocClick = (e: MouseEvent) => {
        const target = e.target as Node;
        if (!open) return;
        if (
          pickerRef.current &&
          !pickerRef.current.contains(target) &&
          swatchRef.current &&
          !swatchRef.current.contains(target)
        ) {
          setOpen(false);
        }
      };
      document.addEventListener("mousedown", onDocClick);
      return () => document.removeEventListener("mousedown", onDocClick);
    }, [open]);

    const handlePickerChange = (color: ColorResult) => {
      setPickerColor(color.rgb);
      const str =
        color.rgb.a !== undefined && color.rgb.a < 1
          ? `rgba(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${Number(color.rgb.a.toFixed(2))})`
          : color.hex;
      setInputValue(str);
      setFieldValue(identifier, str);
      setBookingQuestions((prev: any) => {
        return { ...prev, [identifier]: str };
      });
    };

    const handleInputChange = (val: string) => {
      setInputValue(val);
      const p = parseColor(val);
      if (p) {
        if (p.hex) setPickerColor(p.hex);
        else setPickerColor({ r: p.r, g: p.g, b: p.b, a: p.a ?? 1 });
      }
      setFieldValue(identifier, val);
      setBookingQuestions((prev: any) => {
        return { ...prev, [identifier]: val };
      });
    };

    const swatchColor = () => {
      if (parsed && parsed.hex) return parsed.hex;
      if (parsed && typeof parsed.r === "number") {
        const a = parsed.a ?? 1;
        if (a === 1) return `rgb(${parsed.r}, ${parsed.g}, ${parsed.b})`;
        return `rgba(${parsed.r}, ${parsed.g}, ${parsed.b}, ${a})`;
      }
      return inputValue || "#000000";
    };

    return (
      <CenterColumn>
        <div style={{ position: "relative", width: "100%" }}>
          <CenterRow gap={8} width="100%">
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <button
                ref={swatchRef}
                type="button"
                aria-label="Pick color"
                onClick={() => setOpen((s) => !s)}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 6,
                  border: "1px solid #ddd",
                  background: swatchColor(),
                  cursor: "pointer",
                }}
              />
              <Input
                id={id}
                name={identifier}
                placeholder={label || "Color"}
                value={inputValue}
                onChange={(e: any) => handleInputChange(e.target.value)}
                disabled={disabled}
                style={{ minWidth: 0, flex: 1 }}
              />
            </div>
          </CenterRow>

          {open && (
            <div
              ref={pickerRef}
              style={{
                position: "absolute",
                zIndex: 60,
                top: 44,
                left: 0,
                boxShadow: "0 6px 18px rgba(0,0,0,0.12)",
                borderRadius: 8,
                background: "white",
              }}
            >
              <div style={{ padding: 8 }}>
                <ChromePicker
                  color={pickerColor}
                  onChange={handlePickerChange}
                  disableAlpha={false}
                />
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    marginTop: 8,
                  }}
                >
                  <Button type="button" onClick={() => setOpen(false)}>
                    Close
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
        <Text variant="light" fontSize={12}>
          Accepts hex, rgb() or rgba()
        </Text>
      </CenterColumn>
    );
  };
  return (
    <Formik
      initialValues={{ ...questions }}
      validationSchema={buildValidationSchema(fields, content)}
      onSubmit={(value) => {
        onSubmit(value);
        setValidateOnChange(true);
      }}
      validateOnMount={false}
      validateOnChange={
        Boolean(Object.values(questions).length) || validateOnChange
      }
    >
      {({ values, handleChange, handleBlur, setFieldValue, errors }) => {
        return (
          <Form
            style={{ maxHeight: "100%", overflowY: "scroll" }}
            className="hide-scrollbar custom-scrollbar px-2"
          >
            {fields.map((field) => {
              const {
                id,
                label,
                type,
                options,
                identifier,
                required,
                placeholder,
              } = field;
              return (
                !field.hidden && (
                  <CenterColumn maxHeight="400px" mt={2} key={id}>
                    <CenterColumn>
                      <Text opacity={0.8} variant="body2" color="headCell">
                        {label}
                      </Text>
                      {type === "number" && (
                        <CenterColumn>
                          <Input
                            type="number"
                            id={id}
                            name={identifier}
                            placeholder={placeholder || label}
                            bg="background"
                            onChange={(e) => {
                              handleChange(e);
                              setBookingQuestions({
                                ...values,
                                [e.target.name]: e.target.value,
                              });
                            }}
                            disabled={handleDisable(identifier, field)}
                            value={values[identifier]}
                          />
                        </CenterColumn>
                      )}
                      {type === "checkbox" && options && (
                        <div>
                          {options.map((option: any) => (
                            <CenterColumn key={option.id}>
                              <CenterRow gap={"8px"} bg="background">
                                <Checkbox
                                  checked={values[identifier]?.includes(
                                    option.value,
                                  )}
                                  name={identifier}
                                  value={option.value}
                                  onChange={(e) => {
                                    handleChange(e);
                                    setBookingQuestions({
                                      ...values,
                                      [e.target.name]: e.target.value,
                                    });
                                  }}
                                  disabled={
                                    bookingQuestions?.[identifier] &&
                                    field.disableIfPrefilled
                                      ? true
                                      : false
                                  }
                                />
                                <Text variant="light" fontSize={13}>
                                  {option.value}
                                </Text>
                              </CenterRow>
                            </CenterColumn>
                          ))}
                        </div>
                      )}
                      {type === "radio" && options && (
                        <div>
                          {options.map((option: any) => (
                            <CenterColumn key={option.id}>
                              <CenterRow gap={"8px"}>
                                <Radio
                                  name={identifier}
                                  value={option.value}
                                  checked={values[identifier] === option.value}
                                  onChange={(e) => {
                                    handleChange(e);
                                    setBookingQuestions({
                                      ...values,
                                      [e.target.name]: e.target.value,
                                    });
                                  }}
                                  disabled={
                                    bookingQuestions?.[identifier] &&
                                    field.disableIfPrefilled
                                      ? true
                                      : false
                                  }
                                />
                                <Text variant="light">{option.value}</Text>
                              </CenterRow>
                            </CenterColumn>
                          ))}
                        </div>
                      )}
                      {type === "dropdown" && options && (
                        <CenterColumn>
                          <CenterRow width="100%">
                            <SearchableSelector
                              options={options}
                              //   @ts-ignore
                              value={values[identifier as Record<string, any>]}
                              onChange={(value) => {
                                setFieldValue(identifier as string, value);
                                setBookingQuestions({
                                  ...values,
                                  [identifier]: value,
                                });
                              }}
                              placeholder="Select"
                              selectorStyle={{
                                border: "1px solid",
                                padding: "6px",
                                borderRadius: "8px",
                                fontSize: "14px",
                                paddingLeft: "10px",
                              }}
                              showBorder={true}
                              disabled={
                                bookingQuestions?.[identifier] &&
                                field.disableIfPrefilled
                                  ? true
                                  : false
                              }
                            />
                          </CenterRow>
                        </CenterColumn>
                        // <Input as="select" name={identifier}>
                        //   <option value="">Select</option>
                        //   {options.map((option) => (
                        //     <option key={option.id} value={option.value}>
                        //       {option.value}
                        //     </option>
                        //   ))}
                        // </Input>
                      )}
                      {type === "textarea" && (
                        <CenterColumn>
                          <Input
                            as="textarea"
                            id={id}
                            name={identifier}
                            placeholder={placeholder || label}
                            onChange={(e) => {
                              handleChange(e);
                              setBookingQuestions({
                                ...values,
                                [e.target.name]: e.target.value,
                              });
                            }}
                            disabled={handleDisable(identifier, field)}
                            value={values[identifier]}
                          />
                        </CenterColumn>
                      )}
                      {["url", "text", "email"].includes(type) && (
                        <CenterColumn>
                          <Input
                            id={id}
                            name={identifier}
                            placeholder={placeholder || label}
                            onChange={(e) => {
                              handleChange(e);
                              setBookingQuestions({
                                ...values,
                                [e.target.name]: e.target.value,
                              });
                            }}
                            disabled={handleDisable(identifier, field)}
                            value={values[identifier]}
                          />
                        </CenterColumn>
                      )}
                      {type === "phone" && (
                        <CenterColumn>
                          <PhoneNumberInput
                            id={id}
                            name={identifier}
                            placeholder={placeholder || label}
                            handleChange={(value) => {
                              setFieldValue(identifier as string, value);
                              setBookingQuestions({
                                ...values,
                                [identifier]: value,
                              });
                            }}
                            disabled={handleDisable(identifier, field)}
                            value={values[identifier]}
                          />
                        </CenterColumn>
                      )}
                      {type === "color" && (
                        <ColorField
                          id={id}
                          identifier={identifier}
                          label={label}
                          value={values[identifier]}
                          disabled={handleDisable(identifier, field)}
                          // @ts-ignore
                          setFieldValue={setFieldValue}
                        />
                      )}
                      {type === "date" && (
                        <CenterColumn>
                          <Input
                            type="date"
                            id={id}
                            name={identifier}
                            placeholder={placeholder || label}
                            bg="background"
                            borderRadius={4}
                            border={"1px solid"}
                            borderColor="border"
                            p={"8px"}
                            fontSize={"14px"}
                            onChange={(e) => {
                              handleChange(e);
                              setBookingQuestions({
                                ...values,
                                [e.target.name]: e.target.value,
                              });
                            }}
                            disabled={handleDisable(identifier, field)}
                            value={
                              values[identifier] &&
                              format(values[identifier], "yyyy-MM-dd")
                            }
                          />
                        </CenterColumn>
                      )}
                      {/* {type !== "checkbox" &&
                                type !== "radio" &&
                                type !== "dropdown" &&
                                type !== "textarea" && (
                                  <ErrorMessage name={identifier as string}>
                                    {(msg) => <div className="error">{msg}</div>}
                                  </ErrorMessage>
                                )} */}
                      <Error message={errors[identifier as string] as string} />
                    </CenterColumn>
                  </CenterColumn>
                )
              );
            })}
            <Text color="lightGray" variant="light" mt={"8px"}>
              By proceeding, you agree to our Terms and Privacy Policy.
            </Text>
            <CenterRow
              gap={8}
              mt={"8px"}
              width="100%"
              justifyContent="flex-end"
            >
              <Button
                _hover={{
                  backgroundColor: "#333",
                  color: "#fff",
                }}
                border="none"
                type="button"
                onClick={onBack}
              >
                {content?.back ?? "Back"}
              </Button>
              <Button
                minWidth="79px"
                minHeight="34px"
                bg="text"
                color="background"
                type="submit"
                disabled={isLoading}
                style={{
                  cursor: isLoading ? "not-allowed" : "pointer",
                  pointerEvents: "auto",
                }}
                onClick={() => {
                  setValidateOnChange(true);
                }}
              >
                {isLoading ? <LoadingDots color="currentColor" /> : (content?.submit ?? "Submit")}
              </Button>
            </CenterRow>
            <FormikObserver data={bookingQuestions} />
          </Form>
        );
      }}
    </Formik>
  );
};

const Error = ({ message }: { message: string | undefined }) => {
  if (!message) return null;
  return (
    <Text variant="error" fontSize={12}>
      {message}
    </Text>
  );
};
