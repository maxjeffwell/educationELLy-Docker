import React from 'react';
import { Controller } from 'react-hook-form';
import { Form, Input, Label } from 'semantic-ui-react';
import styled from 'styled-components';

// Valid enum values for student fields (must match server validation)
export const VALID_DESIGNATIONS = [
  { key: 'ell', value: 'ELL', text: 'ELL' },
  { key: 'rfep', value: 'RFEP', text: 'RFEP' },
  { key: 'ifep', value: 'IFEP', text: 'IFEP' },
  { key: 'eo', value: 'EO', text: 'EO' },
  { key: 'tbd', value: 'TBD', text: 'TBD' },
];

export const VALID_COMPOSITE_LEVELS = [
  { key: 'beginning', value: 'Beginning', text: 'Beginning' },
  {
    key: 'early-intermediate',
    value: 'Early Intermediate',
    text: 'Early Intermediate',
  },
  { key: 'intermediate', value: 'Intermediate', text: 'Intermediate' },
  {
    key: 'early-advanced',
    value: 'Early Advanced',
    text: 'Early Advanced',
  },
  { key: 'advanced', value: 'Advanced', text: 'Advanced' },
  { key: 'na', value: 'N/A', text: 'N/A' },
];

// Styled wrapper for select to match labeled inputs
const SelectWrapper = styled.div`
  display: inline-flex;
  align-items: stretch;
  max-width: 100%;

  .icon-label {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 50px;
    min-width: 50px;
    border: 2px solid #f2711c;
    border-radius: 5px;
    background: #e8e8e8;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    border-right: none;
  }

  select {
    width: 232px;
    max-width: calc(100% - 50px);
    font-family: 'Roboto', sans-serif;
    font-size: 1.2em;
    font-weight: 400;
    color: rgba(191, 191, 191, 1);
    background-color: #f9fafb;
    border-top: 2px solid #21ba45;
    border-right: 2px solid #21ba45;
    border-bottom: 2px solid #21ba45;
    border-left: none;
    border-radius: 0;
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
    padding: 10px;
    cursor: pointer;
    height: 48px;
    box-sizing: border-box;
  }

  select.has-value {
    color: #2185d0;
    font-weight: 700;
    font-size: 2em;
    background-color: #f9fafb;
    padding: 5px 10px;
  }

  select:focus {
    outline: none;
    border-color: #21ba45;
  }

  select option {
    font-family: 'Roboto', sans-serif;
    font-size: 14px;
    font-weight: 400;
    color: #333;
    background-color: white;
  }
`;

// Custom form input component that integrates React Hook Form with Semantic UI
export const FormInput = ({
  name,
  control,
  rules,
  label,
  labelPosition = 'left',
  placeholder,
  type = 'text',
  icon,
  iconPosition,
  defaultValue = '',
  ...inputProps
}) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      defaultValue={defaultValue}
      render={({ field, fieldState: { error } }) => (
        <Form.Field error={!!error}>
          <Input
            {...field}
            {...inputProps}
            label={label}
            labelPosition={labelPosition}
            placeholder={placeholder}
            type={type}
            icon={icon}
            iconPosition={iconPosition}
          />
          {error && (
            <Label pointing prompt>
              {error.message}
            </Label>
          )}
        </Form.Field>
      )}
    />
  );
};

// Semantic UI styled input similar to LabelInputField from react-semantic-redux-form
export const LabeledFormInput = ({
  name,
  control,
  rules,
  label,
  labelPosition = 'left',
  placeholder,
  type = 'text',
  defaultValue = '',
  ...inputProps
}) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      defaultValue={defaultValue}
      render={({ field, fieldState: { error } }) => (
        <Form.Field error={!!error}>
          <Input
            {...field}
            {...inputProps}
            label={label}
            labelPosition={labelPosition}
            placeholder={placeholder}
            type={type}
          />
          {error && (
            <Label pointing prompt>
              {error.message}
            </Label>
          )}
        </Form.Field>
      )}
    />
  );
};

// Select component using native HTML select - styled to match LabeledFormInput
export const LabeledFormSelect = ({
  name,
  control,
  rules,
  label,
  placeholder,
  options,
  defaultValue = '',
}) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      defaultValue={defaultValue}
      render={({
        field: { onChange, value, onBlur, ref },
        fieldState: { error },
      }) => (
        <Form.Field error={!!error}>
          <SelectWrapper>
            <div className="icon-label">{label}</div>
            <select
              ref={ref}
              value={value || ''}
              onChange={e => onChange(e.target.value)}
              onBlur={onBlur}
              className={value ? 'has-value' : ''}
            >
              <option value="" disabled>
                {placeholder}
              </option>
              {options.map(opt => (
                <option key={opt.key} value={opt.value}>
                  {opt.text}
                </option>
              ))}
            </select>
          </SelectWrapper>
          {error && (
            <Label pointing prompt>
              {error.message}
            </Label>
          )}
        </Form.Field>
      )}
    />
  );
};
