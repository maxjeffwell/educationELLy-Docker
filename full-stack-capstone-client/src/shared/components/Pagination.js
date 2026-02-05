import React from 'react';
import PropTypes from 'prop-types';
import { Menu, Icon } from 'semantic-ui-react';
import styled from 'styled-components';

const PaginationWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 2rem 0;
  gap: 1rem;
`;

const PageInfo = styled.span`
  color: #666;
  font-size: 0.9rem;
`;

const Pagination = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  loading,
}) => {
  if (totalPages <= 1) {
    return null;
  }

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const handlePageChange = newPage => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage) {
      onPageChange(newPage);
    }
  };

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      // Calculate range around current page
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);

      // Adjust if at edges
      if (currentPage <= 3) {
        end = 4;
      } else if (currentPage >= totalPages - 2) {
        start = totalPages - 3;
      }

      // Add ellipsis if needed before middle pages
      if (start > 2) {
        pages.push('...');
      }

      // Add middle pages
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      // Add ellipsis if needed after middle pages
      if (end < totalPages - 1) {
        pages.push('...');
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <PaginationWrapper>
      <PageInfo>
        Showing {startItem}-{endItem} of {totalItems} students
      </PageInfo>

      <Menu pagination size="small">
        <Menu.Item
          as="a"
          icon
          disabled={currentPage === 1 || loading}
          onClick={() => handlePageChange(1)}
          title="First page"
        >
          <Icon name="angle double left" />
        </Menu.Item>

        <Menu.Item
          as="a"
          icon
          disabled={currentPage === 1 || loading}
          onClick={() => handlePageChange(currentPage - 1)}
          title="Previous page"
        >
          <Icon name="angle left" />
        </Menu.Item>

        {getPageNumbers().map((page, index) =>
          page === '...' ? (
            <Menu.Item key={`ellipsis-${index}`} disabled>
              ...
            </Menu.Item>
          ) : (
            <Menu.Item
              key={page}
              as="a"
              active={page === currentPage}
              disabled={loading}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </Menu.Item>
          )
        )}

        <Menu.Item
          as="a"
          icon
          disabled={currentPage === totalPages || loading}
          onClick={() => handlePageChange(currentPage + 1)}
          title="Next page"
        >
          <Icon name="angle right" />
        </Menu.Item>

        <Menu.Item
          as="a"
          icon
          disabled={currentPage === totalPages || loading}
          onClick={() => handlePageChange(totalPages)}
          title="Last page"
        >
          <Icon name="angle double right" />
        </Menu.Item>
      </Menu>
    </PaginationWrapper>
  );
};

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  totalItems: PropTypes.number.isRequired,
  itemsPerPage: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};

Pagination.defaultProps = {
  loading: false,
};

export default Pagination;
