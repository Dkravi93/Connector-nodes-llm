// submit.js

import { useState } from 'react';
import { useStore } from './store';
import { shallow } from 'zustand/shallow';

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
});

export const SubmitButton = () => {
  const { nodes, edges } = useStore(selector, shallow);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    
    try {
      // Prepare pipeline data - extract only id, source, and target for edges
      const pipelineData = {
        nodes: nodes.map(node => ({ id: node.id })),
        edges: edges.map(edge => ({
          source: edge.source,
          target: edge.target
        }))
      };

      // Send to backend
      const formData = new FormData();
      formData.append('pipeline', JSON.stringify(pipelineData));

      const response = await fetch('http://localhost:8000/pipelines/parse', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      // Display alert with results
      const message = `Pipeline Analysis Results:\n\n` +
        `Number of Nodes: ${result.num_nodes}\n` +
        `Number of Edges: ${result.num_edges}\n` +
        `Is DAG: ${result.is_dag ? 'Yes ✓' : 'No ✗'}`;

      alert(message);
    } catch (error) {
      console.error('Error submitting pipeline:', error);
      alert(`Error submitting pipeline: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      backgroundColor: '#f8fafc',
      borderTop: '1px solid #e2e8f0'
    }}>
      <button
        onClick={handleSubmit}
        disabled={isLoading}
        style={{
          padding: '12px 32px',
          fontSize: '16px',
          fontWeight: '600',
          color: '#ffffff',
          backgroundColor: isLoading ? '#94a3b8' : '#3b82f6',
          border: 'none',
          borderRadius: '8px',
          cursor: isLoading ? 'not-allowed' : 'pointer',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          transition: 'all 0.2s ease',
          minWidth: '120px'
        }}
        onMouseEnter={(e) => {
          if (!isLoading) {
            e.currentTarget.style.backgroundColor = '#2563eb';
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 8px -1px rgba(0, 0, 0, 0.15), 0 4px 6px -1px rgba(0, 0, 0, 0.1)';
          }
        }}
        onMouseLeave={(e) => {
          if (!isLoading) {
            e.currentTarget.style.backgroundColor = '#3b82f6';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
          }
        }}
      >
        {isLoading ? 'Submitting...' : 'Submit'}
      </button>
    </div>
  );
}
