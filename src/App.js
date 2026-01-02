import React from 'react';
import useProjectSuggestions from './hooks/useProjectSuggestions';
import ProjectForm from './components/ProjectForm';
import SuggestionsTable from './components/SuggestionsTable';
import styles from './styles/App.module.css';

const App = () => {
  const {
    target,
    setTarget,
    suggestionBy,
    setSuggestionBy,
    tableData,
    responseMessage,
    loading,
    selectedRows,
    implementingRows,
    bulkImplementing,
    handleSubmit,
    handleImplement,
    handleImplementSelected,
    handleRowSelect,
  } = useProjectSuggestions();

  return (
    <div className={styles.page}>
      {loading && (
        <div className={styles.overlay}>
          <div className={styles.spinner}></div>
        </div>
      )}
      <div className={styles.card}>
        <h2 className={styles.title}>Project Improvement Hub</h2>

        <div className={styles.container}>
          <ProjectForm
            target={target}
            setTarget={setTarget}
            suggestionBy={suggestionBy}
            setSuggestionBy={setSuggestionBy}
            onSubmit={handleSubmit}
            loading={loading}
          />

          <SuggestionsTable
            tableData={tableData}
            onImplement={handleImplement}
            selectedRows={selectedRows}
            onRowSelect={handleRowSelect}
            implementingRows={implementingRows}
          />

          {tableData.length > 0 && (
            <button
              className={styles.implementButton}
              onClick={handleImplementSelected}
              disabled={selectedRows.length === 0 || bulkImplementing}
            >
              {bulkImplementing ? (
                <>
                  <span className={styles.spinner}></span>
                  {/* Implementing... */}
                </>
              ) : (
                'Implement All Selected'
              )}
            </button>
          )}

          {/* {console.log('responseMessage:', responseMessage)} */}

          {/* {responseMessage && (
            <p className={styles.responseMessage}>
              {responseMessage}
            </p>
          )} */}
        </div>
      </div>
    </div>
  );
};

export default App;
