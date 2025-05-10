import { Formik, Form } from "formik";
import * as Yup from "yup";
import { CenterColumn, CenterRow, Text } from "./Core/index";
import { Input } from "./Core/Input/Input";
import { SearchableSelector } from "./Core/SearchableSelector";
import { Button } from "./Core/Button/Button";
import { Checkbox } from "./Core/Checkbox";
import { Radio } from "./Core/Radio";
import { format } from "date-fns";
import { DynamicFormTypes } from "./types/type";
import { LoadingDots } from "./icons/index";
import { FormikObserver } from "./FormikObserver";
import { PhoneNumberInput } from "./PhoneNumberInput";
import { ContentType } from "./types";
import { useState } from "react";

// Function to dynamically build Yup validation schema
const buildValidationSchema = (
  fields: Array<DynamicFormTypes>,
  content?: ContentType
) => {
  const schema = {};

  fields?.forEach((field) => {
    const { identifier, type, required, hidden, label } = field;

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
      } characters`
    );
    // }

    // if (disallowSpecialChars) {
    stringValidator = stringValidator.matches(
      /^[a-zA-Z0-9\s]*$/,
      `${label ?? identifier} cannot contain special characters`
    );
    // }

    switch (type) {
      case "number":
        (schema as Record<string, any>)[identifier] = numberValidator;
        break;
      case "phone":
        (schema as Record<string, any>)[identifier] = stringValidator
          .matches(/^\+?\d{10,15}$/, "Phone number is invalid")
          .nullable();
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
          `${label ?? "Date"} is required`
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
};
export const DynamicForm = ({
  onBack,
  onSubmit,
  isLoading,
  fields,
  bookingQuestions,
  content,
}: DynamicFormProps) => {
  const [validateOnChange, setValidateOnChange] = useState(false);
  const handleDisable = (identifier: string, field: DynamicFormTypes) => {
    return bookingQuestions?.[identifier] && field?.disableIfPrefilled
      ? true
      : false;
  };
  return (
    <Formik
      initialValues={{ ...bookingQuestions }}
      validationSchema={buildValidationSchema(fields, content)}
      onSubmit={onSubmit}
      validateOnMount={false}
      validateOnChange={
        Boolean(Object.values(bookingQuestions).length) || validateOnChange
      }
    >
      {({ values, handleChange, setFieldValue, errors }) => {
        return (
          <Form style={{ height: "440px", overflowY: "scroll" }}>
            {fields?.map((field) => {
              const { id, label, type, options, identifier, placeholder } =
                field;
              return (
                !field.hidden && (
                  <CenterColumn
                    maxHeight="400px"
                    mt={2}
                    key={id}
                    width={"350px"}
                  >
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
                            onChange={handleChange}
                            disabled={handleDisable(identifier, field)}
                            value={values[identifier]}
                          />
                        </CenterColumn>
                      )}
                      {type === "checkbox" && options && (
                        <div>
                          {options?.map((option: any) => (
                            <CenterColumn key={option.id}>
                              <CenterRow gap={"8px"} bg="background">
                                <Checkbox
                                  checked={values[identifier]?.includes(
                                    option.value
                                  )}
                                  name={identifier}
                                  value={option.value}
                                  onChange={handleChange}
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
                          {options?.map((option: any) => (
                            <CenterColumn key={option.id}>
                              <CenterRow gap={"8px"}>
                                <Radio
                                  name={identifier}
                                  value={option.value}
                                  onChange={handleChange}
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
                            onChange={handleChange}
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
                            onChange={handleChange}
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
                            }}
                            disabled={handleDisable(identifier, field)}
                            value={values[identifier]}
                          />
                        </CenterColumn>
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
                            onChange={handleChange}
                            disabled={handleDisable(identifier, field)}
                            value={
                              values[identifier] &&
                              format(values[identifier], "yyyy-MM-dd")
                            }
                          />
                        </CenterColumn>
                      )}

                      <Error message={errors[identifier as string] as string} />
                    </CenterColumn>
                  </CenterColumn>
                )
              );
            })}
            {/* <Text color="lightGray" variant="light" mt={'8px'}>
              By proceeding, you agree to our Terms and Privacy Policy.
            </Text> */}
            <CenterRow
              gap={"8px"}
              mt={"8px"}
              width="100%"
              justifyContent="flex-end"
            >
              <Button
                p="8px"
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
                border="none"
                bg="text"
                color="background"
                p={"8px"}
                type="submit"
                onClick={() => {
                  setValidateOnChange(true);
                }}
              >
                {isLoading ? <LoadingDots /> : content?.submit ?? "Submit"}
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
