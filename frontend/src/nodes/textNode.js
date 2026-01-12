// textNode.js

import { useState, useEffect, useMemo, useRef } from 'react';
import { BaseNode } from './BaseNode';
import { useStore } from '../store';

/**
 * Validates if a string is a valid JavaScript identifier
 */
const isValidJSIdentifier = (str) => {
  if (!str || str.length === 0) return false;
  const identifierRegex = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/;
  return identifierRegex.test(str);
};

/**
 * Extracts variable names from text containing {{ variableName }} patterns
 */
const extractVariables = (text) => {
  const regex = /\{\{\s*([^}]+)\s*\}\}/g;
  const variables = [];
  let match;
  
  while ((match = regex.exec(text)) !== null) {
    const varName = match[1].trim();
    if (isValidJSIdentifier(varName)) {
      variables.push(varName);
    }
  }
  
  // Remove duplicates and return
  return [...new Set(variables)];
};

export const TextNode = ({ id, data }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);
  const textareaRef = useRef(null);
  const [currText, setCurrText] = useState(data?.text || '{{input}}');
  const [dimensions, setDimensions] = useState({ width: 200, height: 120 });

  // Extract variables from the text
  const variables = useMemo(() => extractVariables(currText), [currText]);

  // Update store when text changes
  useEffect(() => {
    if (data?.text !== currText) {
      updateNodeField(id, 'text', currText);
    }
  }, [currText, id, updateNodeField, data?.text]);

  // Calculate dynamic dimensions based on text content
  useEffect(() => {
    if (textareaRef.current) {
      const textarea = textareaRef.current;
      // Reset height to get correct scrollHeight
      textarea.style.height = 'auto';
      
      const scrollHeight = textarea.scrollHeight;
      const scrollWidth = Math.max(textarea.scrollWidth, 200);
      
      // Set new dimensions with some padding
      const newWidth = Math.min(Math.max(scrollWidth + 20, 200), 400);
      const newHeight = Math.max(scrollHeight + 40, 120);
      
      setDimensions({ width: newWidth, height: newHeight });
    }
  }, [currText, variables.length]);

  const handleTextChange = (e) => {
    setCurrText(e.target.value);
  };

  return (
    <BaseNode
      id={id}
      data={data}
      type="text"
      title="Text"
      inputHandles={variables.map((varName, index) => ({
        id: `${id}-${varName}`,
        top: `${((index + 1) * 100) / (variables.length + 1)}%`
      }))}
      outputHandles={[{ id: `${id}-output` }]}
      style={{ 
        width: dimensions.width, 
        minHeight: dimensions.height 
      }}
    >
      <label style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '100%' }}>
        <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>Text:</span>
        <textarea
          ref={textareaRef}
          value={currText}
          onChange={handleTextChange}
          placeholder="Enter text with {{ variables }}"
          style={{
            padding: '6px 8px',
            border: '1px solid #cbd5e1',
            borderRadius: '4px',
            fontSize: '13px',
            fontFamily: 'inherit',
            resize: 'none',
            minHeight: '60px',
            width: '100%',
            boxSizing: 'border-box'
          }}
        />
      </label>
      {variables.length > 0 && (
        <div style={{ 
          fontSize: '11px', 
          color: '#64748b', 
          fontStyle: 'italic',
          marginTop: '4px'
        }}>
          Variables: {variables.join(', ')}
        </div>
      )}
    </BaseNode>
  );
}
