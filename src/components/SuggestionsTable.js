import React from 'react';
import PropTypes from 'prop-types';
import styles from '../styles/App.module.css';

const SuggestionsTable = ({ tableData, onImplement, selectedRows, onRowSelect, implementingRows }) => {
//   if (tableData.length === 0) return null;

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.th}>Select</th>
            <th className={styles.th}>Title</th>
            <th className={styles.th}>Source</th>
            <th className={styles.th}>Priority</th>
            <th className={styles.th}>Detail</th>
            <th className={styles.th}>Status</th>
            <th className={styles.th}>Action</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((row, i) => (
            <tr key={i} onClick={() => onRowSelect(i, !selectedRows.includes(i))}>
              <td className={styles.td}>
                <input
                  type="checkbox"
                  checked={selectedRows.includes(i)}
                  onChange={(e) => {
                    e.stopPropagation();
                    onRowSelect(i, e.target.checked);
                  }}
                  onClick={(e) => e.stopPropagation()}
                />
              </td>
              <td className={styles.td}>{row.title}</td>
              <td className={styles.td}>{row.source}</td>
              <td className={styles.td}>{row.priority}</td>
              <td className={styles.td}>{row.detail}</td>
              <td className={styles.td}>{row.status}</td>
              <td className={styles.td}>
                <button className={styles.implementButton}
                  onClick={(e) => {
                    e.stopPropagation();
                    onImplement(i);
                  }}
                  disabled={row.status === 'Success' || implementingRows.includes(i)}
                >
                  {implementingRows.includes(i) ? (
                    <>
                      <span className={styles.spinner}></span>
                      {/* Implementing... */}
                    </>
                  ) : (
                    'Implement'
                  )}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

SuggestionsTable.propTypes = {
  tableData: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      source: PropTypes.string.isRequired,
      priority: PropTypes.string.isRequired,
      detail: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
    })
  ).isRequired,
  onImplement: PropTypes.func.isRequired,
  selectedRows: PropTypes.arrayOf(PropTypes.number).isRequired,
  onRowSelect: PropTypes.func.isRequired,
  implementingRows: PropTypes.arrayOf(PropTypes.number).isRequired,
};

export default SuggestionsTable;