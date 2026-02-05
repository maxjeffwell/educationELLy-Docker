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

export const VALID_ELL_STATUS = [
  { key: 'active', value: 'Active', text: 'Active' },
  { key: 'former', value: 'Former', text: 'Former' },
  { key: 'never', value: 'Never', text: 'Never' },
  { key: 'monitored', value: 'Monitored', text: 'Monitored' },
  { key: 'exited', value: 'Exited', text: 'Exited' },
  { key: 'waived', value: 'Waived', text: 'Waived' },
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

// Styled wrapper for select to match labeled inputs exactly
const SelectWrapper = styled.div`
  display: flex;
  align-items: stretch;

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
    flex: 1;
    font-family: 'Roboto', sans-serif !important;
    font-size: 2em !important;
    font-weight: 700 !important;
    color: rgba(191, 191, 191, 0.87) !important;
    background-color: #e8e8e8 !important;
    border-top: 2px solid #21ba45 !important;
    border-right: 2px solid #21ba45 !important;
    border-bottom: 2px solid #21ba45 !important;
    border-left: none !important;
    border-radius: 0 !important;
    border-top-right-radius: 5px !important;
    border-bottom-right-radius: 5px !important;
    padding: 5px 5px 5px 10px !important;
    cursor: pointer;
    box-sizing: border-box;
    width: 322px !important;
    min-width: 322px !important;
    max-width: 322px !important;
    height: auto;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
  }

  select.has-value {
    color: #2185d0 !important;
    font-weight: 700 !important;
  }

  select:focus {
    outline: none;
  }

  select option {
    font-family: 'Roboto', sans-serif;
    font-size: 14px;
    font-weight: 400;
    color: #333;
    background-color: white;
  }

  /* Mobile responsive - match text inputs */
  @media (max-width: 768px) {
    select {
      font-size: 1.5em;
    }
  }

  @media (max-width: 480px) {
    select {
      font-size: 1.2em;
      padding: 8px;
    }
  }
`;

// Wrapper to properly position error labels below the select field
const SelectFieldWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  .ui.left.labeled.input {
    width: 100%;
  }

  /* Error label styling - position below the field */
  .ui.label.pointing.prompt {
    display: block !important;
    margin-top: 8px !important;
    margin-left: 50px !important;
    width: auto !important;
    text-align: left !important;
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
          <SelectFieldWrapper>
            <div className="ui left labeled input">
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
            </div>
            {error && (
              <Label pointing prompt>
                {error.message}
              </Label>
            )}
          </SelectFieldWrapper>
        </Form.Field>
      )}
    />
  );
};
