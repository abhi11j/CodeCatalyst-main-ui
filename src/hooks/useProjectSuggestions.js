import { useState } from 'react';

const useProjectSuggestions = () => {
  const [target, setTarget] = useState('');
  const [suggestionBy, setSuggestionBy] = useState('');
  const [tableData, setTableData] = useState([]);
  const [responseMessage, setResponseMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [implementingRows, setImplementingRows] = useState([]);
  const [bulkImplementing, setBulkImplementing] = useState(false);

  const isValidTarget = (value) => {
    return /^[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+$/.test(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!target) {
      alert('Target is mandatory');
      return;
    }

    if (!isValidTarget(target)) {
      alert('Target format must be like abhi11j/SampleWebApp');
      return;
    }

    if (!suggestionBy) {
      alert('Please select suggestion type');
      return;
    }

    setLoading(true);
    const payload = {
      target: target,
      suggestion_by: Number(suggestionBy),
    };

    try {
      const response = await fetch('http://localhost:5000/api/scan-repos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success) {
        const rows = data.suggestions.map((s, index) => ({
          id: index,
          title: s.title,
          source: s.source,
          priority: s.priority,
          detail: s.detail,
          status: 'Pending',
        }));

        setTableData(rows);
        setSelectedRows([]);
      } else {
        alert(data.message || 'Scan failed');
      }
    } catch {
      alert('Backend not connected');
    } finally {
      setLoading(false);
    }
  };

  const handleImplement = async (index) => {
    setImplementingRows(prev => [...prev, index]);

    const row = tableData[index];

    const payload = {
      target: target,
      suggestions: [
        {
          title: row.title,
          source: row.source,
          priority: row.priority,
          detail: row.detail,
        },
      ],
    };

    try {
      const response = await fetch(
        'http://100.79.233.254:5000/api/apply-suggestions',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();
      const updatedData = [...tableData];

      if (result.success === true) {
        const message = `${result.message || ''}`.trim(); // ${result.changed_files || ''}
        updatedData[index].status = message;
        setResponseMessage(message);
      } else {
        updatedData[index].status = 'Failed';
        setResponseMessage('Implementation failed');
      }

      setTableData(updatedData);
    } catch {
      const updatedData = [...tableData];
      updatedData[index].status = 'Failed';
      setTableData(updatedData);
      setResponseMessage('Server error');
    } finally {
      setImplementingRows(prev => prev.filter(i => i !== index));
    }
  };

  const handleImplementSelected = async () => {
    if (selectedRows.length === 0) {
      alert('Please select at least one suggestion to implement');
      return;
    }

    setBulkImplementing(true);
    const selectedSuggestions = selectedRows.map(index => tableData[index]);

    const payload = {
      target: target,
      suggestions: selectedSuggestions.map(s => ({
        title: s.title,
        source: s.source,
        priority: s.priority,
        detail: s.detail,
      })),
    };

    try {
      const response = await fetch(
        'http://100.79.233.254:5000/api/apply-suggestions',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();
      const updatedData = [...tableData];

      selectedRows.forEach(index => {
        if (result.success === true) {
          const message = `${result.changed_files || ''} ${result.message || ''}`.trim();
          updatedData[index].status = message;
        } else {
          updatedData[index].status = 'Failed';
        }
      });

      setTableData(updatedData);
      setSelectedRows([]);
      const message = result.success ? `${result.changed_files || ''} ${result.message || ''}`.trim() : 'Implementation failed';
      setResponseMessage(message);
    } catch {
      const updatedData = [...tableData];
      selectedRows.forEach(index => {
        updatedData[index].status = 'Failed';
      });
      setTableData(updatedData);
      setSelectedRows([]);
      setResponseMessage('Server error');
    } finally {
      setBulkImplementing(false);
    }
  };

  const handleRowSelect = (index, checked) => {
    if (checked) {
      setSelectedRows(prev => [...prev, index]);
    } else {
      setSelectedRows(prev => prev.filter(i => i !== index));
    }
  };

  return {
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
  };
};

export default useProjectSuggestions;