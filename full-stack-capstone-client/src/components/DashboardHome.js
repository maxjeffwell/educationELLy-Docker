import React from 'react';
import { Container, Header, Segment, Grid, Icon } from 'semantic-ui-react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import LazyImage from './LazyImage';
import claptrap_vector from '../logo/claptrap_vector.png';

const StyledContainer = styled(Container)`
  &&& {
    margin-top: 20px;
    margin-bottom: 20px;
  }
`;

const StyledHeader = styled(Header)`
  &&& {
    color: ${props => props.theme.blue};
    font-family: 'Roboto', 'sans-serif';
    margin-bottom: 25px;
  }
`;

const StyledSegment = styled(Segment)`
  &&& {
    border-top: 4px solid ${props => props.theme.orange};
    border-radius: 5px;
    background: ${props => props.theme.white};
    padding: 30px;
    height: 100%;
    transition: transform 0.2s;
    
    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 5px 15px rgba(0,0,0,0.1);
    }
  }
`;

const ActionLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  
  &:hover {
    text-decoration: none;
    color: inherit;
  }
`;

const DashboardHome = () => {
    return (
        <StyledContainer>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                <div style={{ maxWidth: '200px', margin: '0 auto 20px auto' }}>
                    <LazyImage src={claptrap_vector} alt="Claptrap Logo" />
                </div>
                <StyledHeader as="h1">Welcome to Your Dashboard</StyledHeader>
                <p style={{ fontSize: '1.2em' }}>
                    Manage your English Language Learning students, track progress, and organize your teaching workflows.
                </p>
            </div>

            <Grid stackable columns={2}>
                <Grid.Column>
                    <ActionLink to="/students">
                        <StyledSegment>
                            <Header as="h3" icon textAlign="center">
                                <Icon name="users" color="blue" />
                                <Header.Content>View Students</Header.Content>
                            </Header>
                            <p style={{ textAlign: 'center' }}>
                                Access your complete list of students. View profiles, track progress, and manage ELL status.
                            </p>
                        </StyledSegment>
                    </ActionLink>
                </Grid.Column>

                <Grid.Column>
                    <ActionLink to="/students/new">
                        <StyledSegment>
                            <Header as="h3" icon textAlign="center">
                                <Icon name="add user" color="green" />
                                <Header.Content>Add New Student</Header.Content>
                            </Header>
                            <p style={{ textAlign: 'center' }}>
                                Register a new student to your ELL program. Input demographics, initial levels, and assignments.
                            </p>
                        </StyledSegment>
                    </ActionLink>
                </Grid.Column>
            </Grid>
        </StyledContainer>
    );
};

export default DashboardHome;
