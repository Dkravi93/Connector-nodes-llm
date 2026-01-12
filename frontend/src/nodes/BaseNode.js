// BaseNode.js
// Base abstraction for all node types to reduce code duplication

import React from 'react';
import { Handle, Position } from 'reactflow';

/**
 * BaseNode - A reusable component for creating ReactFlow nodes
 * 
 * @param {Object} props
 * @param {string} props.id - Unique node identifier
 * @param {Object} props.data - Node data object
 * @param {string} props.type - Node type (e.g., 'input', 'output', 'llm', 'text')
 * @param {string} props.title - Node title/header text
 * @param {React.ReactNode} props.children - Content to render inside the node
 * @param {Array} props.inputHandles - Array of input handle configurations
 * @param {Array} props.outputHandles - Array of output handle configurations
 * @param {Object} props.style - Custom styles for the node container
 * @param {Function} props.onUpdate - Callback function for updating node data
 */
export const BaseNode = ({ 
  id, 
  data, 
  type,
  title,
  children,
  inputHandles = [],
  outputHandles = [],
  style = {},
  onUpdate
}) => {
  const baseStyle = {
    minWidth: 200,
    minHeight: 80,
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    backgroundColor: '#ffffff',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    ...style
  };

  return (
    <div style={baseStyle} className={`node node-${type}`}>
      {/* Input Handles */}
      {inputHandles.map((handle, index) => (
        <Handle
          key={`input-${index}`}
          type="target"
          position={Position.Left}
          id={handle.id || `${id}-input-${index}`}
          style={{
            top: handle.top || `${((index + 1) * 100) / (inputHandles.length + 1)}%`,
            ...handle.style
          }}
        />
      ))}

      {/* Node Header */}
      {title && (
        <div style={{
          padding: '8px 12px',
          borderBottom: '1px solid #e2e8f0',
          backgroundColor: '#f8fafc',
          fontWeight: '600',
          fontSize: '14px',
          color: '#1e293b'
        }}>
          {title}
        </div>
      )}

      {/* Node Content */}
      <div style={{
        padding: '12px',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
      }}>
        {children}
      </div>

      {/* Output Handles */}
      {outputHandles.map((handle, index) => (
        <Handle
          key={`output-${index}`}
          type="source"
          position={Position.Right}
          id={handle.id || `${id}-output-${index}`}
          style={{
            top: handle.top || `${((index + 1) * 100) / (outputHandles.length + 1)}%`,
            ...handle.style
          }}
        />
      ))}
    </div>
  );
};

