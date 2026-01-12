// textNode.js

import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { BaseNode } from './BaseNode';
import { useStore } from '../store';
import { useReactFlow } from 'reactflow';

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
  const reactFlowInstance = useReactFlow();
  const textareaRef = useRef(null);
  const measureRef = useRef(null);
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

  // Measure text content and calculate dimensions
  const measureContent = useCallback(() => {
    if (!textareaRef.current || !measureRef.current) return;

    const textarea = textareaRef.current;
    const measureDiv = measureRef.current;

    // Reset textarea height to get accurate scrollHeight
    textarea.style.height = 'auto';
    
    // Measure height using scrollHeight
    const scrollHeight = textarea.scrollHeight;
    
    // Measure width using hidden div with same styling
    // For width, we want to measure the longest line
    // Split text into lines and measure each line
    const lines = (currText || ' ').split('\n');
    let maxLineWidth = 0;
    
    // Measure each line to find the longest
    lines.forEach((line) => {
      measureDiv.textContent = line || ' '; // Empty line should still have space
      measureDiv.style.width = 'auto';
      measureDiv.style.whiteSpace = 'nowrap'; // Don't wrap for width measurement
      const lineWidth = measureDiv.offsetWidth;
      maxLineWidth = Math.max(maxLineWidth, lineWidth);
    });
    
    // Calculate dimensions with proper padding
    // Width: base on longest line, with min/max constraints
    const contentWidth = Math.max(maxLineWidth + 40, 200); // 40px for padding
    const newWidth = Math.min(Math.max(contentWidth, 200), 600); // Min 200px, Max 600px
    
    // Height: base on scrollHeight with padding for header, label, and variables display
    const headerHeight = 40; // BaseNode header
    const labelHeight = 20; // Label text
    const variablesHeight = variables.length > 0 ? 24 : 0; // Variables display
    const padding = 24; // Content padding
    const textareaPadding = 12; // Textarea internal padding
    
    const contentHeight = scrollHeight + textareaPadding;
    const newHeight = Math.max(
      headerHeight + labelHeight + contentHeight + variablesHeight + padding,
      120 // Minimum height
    );
    
    setDimensions({ width: newWidth, height: newHeight });
    
    // Update textarea height to match content
    textarea.style.height = `${scrollHeight}px`;
    
    // Notify ReactFlow to recalculate node dimensions if available
    // Use setTimeout to ensure DOM has updated
    setTimeout(() => {
      if (reactFlowInstance && reactFlowInstance.updateNodeDimensions) {
        reactFlowInstance.updateNodeDimensions(id);
      }
    }, 0);
  }, [currText, variables.length, id, reactFlowInstance]);

  // Recalculate dimensions when text or variables change
  useEffect(() => {
    measureContent();
  }, [measureContent]);

  // Also measure on window resize
  useEffect(() => {
    const handleResize = () => {
      measureContent();
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [measureContent]);

  const handleTextChange = (e) => {
    setCurrText(e.target.value);
  };

  return (
    <>
      {/* Hidden div for measuring text width */}
      <div
        ref={measureRef}
        style={{
          position: 'absolute',
          visibility: 'hidden',
          height: 'auto',
          width: 'auto',
          whiteSpace: 'pre-wrap',
          wordWrap: 'break-word',
          fontSize: '13px',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
          padding: '6px 8px',
          border: '1px solid #cbd5e1',
          boxSizing: 'border-box',
          maxWidth: '600px',
          pointerEvents: 'none',
        }}
      />
      
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
          height: dimensions.height,
          transition: 'width 0.2s ease, height 0.2s ease'
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
              boxSizing: 'border-box',
              overflow: 'hidden',
              lineHeight: '1.5',
              transition: 'height 0.1s ease'
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
    </>
  );
}
