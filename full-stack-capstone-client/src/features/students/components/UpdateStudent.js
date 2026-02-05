import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, Form, Icon, Button } from 'semantic-ui-react';
import styled from 'styled-components';

import {
  fetchStudent,
  updateStudent,
  selectStudentById,
} from '../studentsSlice';
import { showModal, hideModal } from '../../modals';
import { validationRules } from '../../../validators/hookFormValidators';
import {
  LabeledFormInput,
  LabeledFormSelect,
  VALID_DESIGNATIONS,
  VALID_COMPOSITE_LEVELS,
  VALID_ELL_STATUS,
} from '../../../shared';
import DeleteStudent from './DeleteStudent';

export const StyledForm = styled(Form)`
  /* Fix dropdown menu visibility - ensure closed by default */
  .ui.dropdown .menu {
    display: none !important;
  }
  .ui.dropdown.visible .menu,
  .ui.dropdown.active .menu {
    display: block !important;
  }

  &&& form.ui.form {
    display: grid;
    grid-template-columns: 1fr;
    min-width: 372px;
    padding-bottom: 0;
    align-items: flex-start;
  }

  /* All form fields should take full width */
  &&& div.field {
    text-align: center;
    width: 100% !important;
  }

  &&& .icon {
    size: 100px;
  }

  /* ========== TEXT INPUT: LABEL STYLING ========== */
  &&& .ui.labeled.input > .ui.label {
    border: 2px solid ${props => props.theme.orange};
    border-radius: 5px 0 0 5px;
    border-right: none;
    width: 50px;
    min-width: 50px;
    max-width: 50px;
    text-align: center;
    display: flex !important;
    align-items: center;
    justify-content: center;
    background-color: ${props => props.theme.white};
    margin: 0 !important;
    padding: 0.5em !important;
  }

  /* ========== TEXT INPUT: CONTAINER ========== */
  &&& .ui.labeled.input {
    display: flex !important;
    width: 100%;
  }

  /* ========== TEXT INPUT: INPUT ELEMENT ========== */
  &&& .ui.labeled.input > input {
    font-family: 'Roboto', 'sans-serif';
    font-size: 2em;
    font-weight: 700;
    color: ${props => props.theme.blue};
    padding: 5px 5px 5px 10px;
    background-color: ${props => props.theme.white};
    border: 2px solid ${props => props.theme.green};
    border-left: none;
    border-radius: 0 5px 5px 0;
    flex: 1;
    min-height: 48px;
  }

  &&& .ui.labeled.input > input::placeholder {
    color: rgba(191, 191, 191, 0.87);
    font-weight: 700;
  }

  /* ========== DROPDOWN: FIELD CONTAINER (ensure full width) ========== */
  &&& .labeled-select-field {
    width: 100% !important;
  }

  /* ========== DROPDOWN: CUSTOM CONTAINER ========== */
  &&& .labeled-select-container {
    display: flex !important;
    width: 100% !important;
    align-items: stretch;
  }

  /* ========== DROPDOWN: ICON LABEL (matches text input labels) ========== */
  &&& .labeled-select-container > .select-icon-label {
    border: 2px solid ${props => props.theme.orange} !important;
    border-radius: 5px 0 0 5px !important;
    border-right: none !important;
    width: 50px !important;
    min-width: 50px !important;
    max-width: 50px !important;
    text-align: center !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    background-color: ${props => props.theme.white} !important;
    margin: 0 !important;
    padding: 0.5em !important;
  }

  /* ========== DROPDOWN: SELECTION ELEMENT ========== */
  &&& .labeled-select-container > .ui.selection.dropdown {
    font-family: 'Roboto', 'sans-serif' !important;
    font-size: 2em !important;
    font-weight: 700 !important;
    color: ${props => props.theme.blue} !important;
    padding: 5px 5px 5px 10px !important;
    background-color: ${props => props.theme.white} !important;
    border: 2px solid ${props => props.theme.green} !important;
    border-left: none !important;
    border-radius: 0 5px 5px 0 !important;
    min-height: 48px !important;
    height: auto !important;
    line-height: 1.2em !important;
    flex: 1 1 auto !important;
    display: flex !important;
    align-items: center !important;
    min-width: 0 !important;
    width: 100% !important;
  }

  /* Placeholder text styling for dropdowns */
  &&& .ui.selection.dropdown .default.text {
    color: rgba(191, 191, 191, 0.87) !important;
    font-weight: 700 !important;
  }

  /* Selected value text styling */
  &&& .ui.selection.dropdown > .text {
    color: ${props => props.theme.blue} !important;
  }

  /* Dropdown arrow icon positioning */
  &&& .ui.selection.dropdown > .dropdown.icon {
    padding: 0.5em !important;
    top: 50% !important;
    transform: translateY(-50%) !important;
    right: 0.5em !important;
    margin: 0 !important;
  }

  /* Dropdown menu styling */
  &&& .ui.selection.dropdown .menu {
    font-size: 0.5em !important;
    border-color: ${props => props.theme.green} !important;
    max-height: 200px !important;
  }

  &&& .ui.selection.dropdown .menu > .item {
    font-size: 1em !important;
    padding: 0.75em 1em !important;
    color: ${props => props.theme.blue} !important;
  }

  &&& .ui.selection.dropdown .menu > .item:hover {
    background-color: rgba(134, 198, 78, 0.1) !important;
  }

  /* ========== ERROR STATE STYLING ========== */
  &&& .ui.red {
    color: red;
    font-family: 'Roboto', 'sans-serif';
    font-size: 1.5em;
    font-weight: bold;
    border: none;
  }

  /* Override error state background for dropdowns */
  &&& .field.error .ui.selection.dropdown {
    background-color: ${props => props.theme.white} !important;
    border-color: ${props => props.theme.green} !important;
  }

  /* Error label positioning - below the field */
  &&& .ui.pointing.prompt.label {
    display: block !important;
    margin-top: 0.5em !important;
    margin-left: 50px !important;
    width: auto !important;
    background-color: #fff6f6 !important;
    border: 1px solid #e0b4b4 !important;
    color: #9f3a38 !important;
    border-radius: 4px !important;
  }

  /* Remove default Semantic UI error styling for text inputs */
  &&& .field.error .ui.labeled.input > input {
    background-color: ${props => props.theme.white};
    border-color: ${props => props.theme.green};
  }
`;

const UpdateStudent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const student = useSelector(state => selectStudentById(state, id));

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
    setFocus,
    reset,
  } = useForm({
    defaultValues: {
      fullName: '',
      school: '',
      teacher: '',
      gradeLevel: '',
      ellStatus: '',
      compositeLevel: '',
      designation: '',
    },
    mode: 'onBlur',
  });

  useEffect(() => {
    // Fetch student data if not already in store
    if (!student) {
      dispatch(fetchStudent(id))
        .unwrap()
        .catch(error => {
          console.error('Error fetching student:', error);
          if (error === 'Not authenticated') {
            navigate('/signin');
          }
        });
    } else {
      // Reset form with student data
      reset(student);
    }
  }, [id, student, dispatch, navigate, reset]);

  useEffect(() => {
    // Focus on first field with error
    const firstErrorField = Object.keys(errors)[0];
    if (firstErrorField) {
      setFocus(firstErrorField);
    }
  }, [errors, setFocus]);

  const onSubmit = async formData => {
    try {
      const result = await dispatch(
        updateStudent({ id, ...formData })
      ).unwrap();

      // Show success message
      dispatch(
        showModal({
          modalType: 'SUCCESS_MODAL',
          modalProps: {
            open: true,
            closeOnEscape: true,
            closeOnDimmerClick: true,
            children: (
              <div
                style={{
                  padding: '2rem',
                  textAlign: 'center',
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  fontFamily: 'Roboto, sans-serif',
                  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
                  maxWidth: '400px',
                  margin: '0 auto',
                }}
              >
                <div style={{ marginBottom: '1.5rem' }}>
                  <i
                    className="icon check circle"
                    style={{
                      fontSize: '3rem',
                      color: '#27ae60',
                      marginBottom: '1rem',
                      display: 'block',
                    }}
                  />
                  <h3
                    style={{
                      fontSize: '1.5rem',
                      fontWeight: '600',
                      color: '#2c3e50',
                      margin: '0 0 0.5rem 0',
                    }}
                  >
                    Student Updated
                  </h3>
                  <p
                    style={{
                      fontSize: '1rem',
                      color: '#7f8c8d',
                      lineHeight: '1.5',
                      margin: '0',
                    }}
                  >
                    {result.fullName || student?.fullName || 'The student'}'s
                    information has been successfully updated.
                  </p>
                </div>
                <button
                  onClick={() => dispatch(hideModal())}
                  style={{
                    backgroundColor: '#27ae60',
                    borderColor: '#27ae60',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    padding: '0.75rem 1.5rem',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    fontFamily: 'Roboto, sans-serif',
                  }}
                >
                  OK
                </button>
              </div>
            ),
          },
        })
      );

      // Auto-close success modal after 2 seconds and navigate
      setTimeout(() => {
        dispatch(hideModal());
        navigate('/students');
      }, 2000);
    } catch (error) {
      console.error('Error updating student:', error);
      if (error === 'Not authenticated') {
        navigate('/signin');
      }
    }
  };

  return (
    <Grid textAlign="center" style={{ width: 'auto' }}>
      <Grid.Row centered columns={1}>
        <StyledForm onSubmit={handleSubmit(onSubmit)}>
          <LabeledFormInput
            name="fullName"
            control={control}
            rules={validationRules.required}
            label={{
              content: <Icon color="green" name="student" size="large" />,
            }}
            labelPosition="left"
            placeholder="Enter Full Student Name"
          />

          <LabeledFormInput
            name="school"
            control={control}
            label={{
              content: (
                <Icon color="blue" name="building outline" size="large" />
              ),
            }}
            labelPosition="left"
            placeholder="Enter School"
          />

          <LabeledFormInput
            name="teacher"
            control={control}
            label={{
              content: <Icon color="orange" name="apple" size="large" />,
            }}
            labelPosition="left"
            placeholder="Enter Teacher"
          />

          <LabeledFormInput
            name="gradeLevel"
            control={control}
            label={{
              content: <Icon color="green" name="chart line" size="large" />,
            }}
            labelPosition="left"
            placeholder="Enter Grade Level"
          />

          <LabeledFormSelect
            name="ellStatus"
            control={control}
            label={<Icon color="orange" name="world" size="large" />}
            placeholder="Select ELL Status"
            options={VALID_ELL_STATUS}
          />

          <LabeledFormSelect
            name="compositeLevel"
            control={control}
            label={<Icon color="green" name="percent" size="large" />}
            placeholder="Select Composite Level"
            options={VALID_COMPOSITE_LEVELS}
          />

          <LabeledFormSelect
            name="designation"
            control={control}
            label={<Icon color="blue" name="universal access" size="large" />}
            placeholder="Select Designation"
            options={VALID_DESIGNATIONS}
          />

          <Button
            disabled={!isDirty || isSubmitting}
            loading={isSubmitting}
            type="submit"
          >
            Save Student
          </Button>
        </StyledForm>
      </Grid.Row>
      <Grid.Row centered>
        <Grid.Column textAlign="center">
          <DeleteStudent id={id} />
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

export default UpdateStudent;
