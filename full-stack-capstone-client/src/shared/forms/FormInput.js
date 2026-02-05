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

// Styled wrapper for select - basic layout only, styling comes from parent StyledForm
const SelectWrapper = styled.div`
  display: flex;
  align-items: stretch;

  select {
    flex: 1;
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
`;

// Wrapper for select field layout
const SelectFieldWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
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
