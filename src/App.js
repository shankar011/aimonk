import React, { useState } from 'react';
import './App.css';

const TagView = ({ tag, onAddChild, onToggle, onUpdateData, onRename }) => {
  const [newChildName, setNewChildName] = useState('');

  const handleAddChild = () => {
    onAddChild(tag);
    setNewChildName('');
  };

  return (

    <div className="tag">

      <div className="tag-header">
        <span className="toggle" onClick={() => onToggle(tag)}>
          {tag.collapsed ? '>' : 'v'}
        </span>
        {tag.editing ? (
          <input
            type="text"
            value={tag.name}
            onChange={(e) => onRename(tag, e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                onRename(tag, e.target.value, false);
              }
            }}
            autoFocus
          />
        ) : (
          <span className="tag-name" onClick={() => onRename(tag, tag.name, true)}>
            {tag.name}
          </span>
        )}
      </div>
      {!tag.collapsed && (
        <div className="tag-content">
          {tag.children &&
            tag.children.map((child, index) => (
              <TagView
                key={index}
                tag={child}
                onAddChild={onAddChild}
                onToggle={onToggle}
                onUpdateData={onUpdateData}
                onRename={onRename}
              />
            ))}
          {tag.data !== undefined && (
            <input
              type="text"
              value={tag.data}
              onChange={(e) => onUpdateData(tag, e.target.value)}
            />
          )}
          <button className='btn btn-warning' onClick={handleAddChild}>Add Child</button>
        </div>
      )}
      
    </div>
  );
};


const App = () => {
  const [tree, setTree] = useState({
    name: 'root',
    collapsed: false,
    children: [
      {
        name: 'child1',
        collapsed: false,
        children: [
          { name: 'child1-child1', data: 'c1-c1 Hello', collapsed: false },
          { name: 'child1-child2', data: 'c1-c2 JS', collapsed: false }
        ]
      },
      { name: 'child2', data: 'c2 World', collapsed: false }
    ]
  });

  const handleToggle = (tag) => {
    tag.collapsed = !tag.collapsed;
    setTree({ ...tree });
  };

  const handleAddChild = (parent) => {
    if (!parent.children) parent.children = [];
    parent.children.push({ name: 'New Child', data: 'Data', collapsed: false });
    setTree({ ...tree });
  };

  const handleUpdateData = (tag, newData) => {
    tag.data = newData;
    setTree({ ...tree });
  };

  const handleRename = (tag, newName, editing) => {
    tag.name = newName;
    tag.editing = editing;
    setTree({ ...tree });
  };

  const handleExport = () => {
    const modifiedTree = JSON.parse(JSON.stringify(tree)); // Clone the tree to avoid modifying the state
    updateExportedData(modifiedTree);
  };

  const updateExportedData = (modifiedTree) => {
    if (modifiedTree.data !== undefined) {
      modifiedTree.data = `Modified: ${modifiedTree.data}`;
    }
    if (modifiedTree.children) {
      modifiedTree.children.forEach(child => updateExportedData(child));
    }
  };

  const [exportedTree, setExportedTree] = useState('');

  return (
    <div className="app">
      <TagView
        tag={tree}
        onAddChild={handleAddChild}
        onToggle={handleToggle}
        onUpdateData={handleUpdateData}
        onRename={handleRename}
      />
      <button className='btn btn-primary' onClick={handleExport}>Export</button>
      <div className="exported-tree-container">
        <h2>Exported JSON Structure:</h2>
        <pre className="exported-tree">{JSON.stringify(tree, null, 2)}</pre>
      </div>
    </div>
  );
};

export default App;
