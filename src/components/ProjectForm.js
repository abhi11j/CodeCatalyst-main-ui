import React from 'react';
import PropTypes from 'prop-types';
import styles from '../styles/App.module.css';

const ProjectForm = ({ target, setTarget, suggestionBy, setSuggestionBy, onSubmit, loading }) => {
  return (
    <form onSubmit={onSubmit}>
      <div className={styles.field}>
        <label>GitHub Project Repository</label>
        <input
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          placeholder="abhi11j/SampleWebApp"
          className={styles.input}
          disabled={loading}
        />
      </div>

      <div className={styles.field}>
        <label>Recommendation Source</label>
        <select
          value={suggestionBy}
          onChange={(e) => setSuggestionBy(e.target.value)}
          className={styles.input}
          disabled={loading}
        >
          <option value="">Select</option>
          <option value="1">GitHub Automated</option>
          <option value="2">GitHub + AI Assisted</option>
          <option value="3">AI Automated</option>
          <option value="4">Manual</option>
        </select>
      </div>

      <button type="submit" className={styles.button} disabled={loading}>
        {loading ? 'Searching...' : 'Search'}
      </button>
    </form>
  );
};

ProjectForm.propTypes = {
  target: PropTypes.string.isRequired,
  setTarget: PropTypes.func.isRequired,
  suggestionBy: PropTypes.string.isRequired,
  setSuggestionBy: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
};

export default ProjectForm;