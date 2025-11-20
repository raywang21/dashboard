// Workflow Builder Component
// 可视化工作流配置模块 - 纯函数版本

// Workflow Builder Component - 纯函数，无内部状态
function WorkflowBuilder({ data = {} }) {
  const { useState, useEffect, useRef, useCallback } = React;
  const { 
    Card,
    CardContent,
    Typography,
    Button,
    Box,
    Grid,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    TextField,
    IconButton,
    Divider,
    Chip,
    Drawer,
    Paper,
    Fab,
    Menu,
    MenuItem,
    Toolbar,
    AppBar
  } = window.MaterialUI;

  // 从props获取数据，如果没有则使用默认数据
  const [workflows, setWorkflows] = useState(data.workflows || []);
  const [currentWorkflow, setCurrentWorkflow] = useState(data.currentWorkflow || null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [canvasScale, setCanvasScale] = useState(1);
  const [canvasOffset, setCanvasOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [nodes, setNodes] = useState(currentWorkflow?.nodes || []);
  const [connections, setConnections] = useState(currentWorkflow?.connections || []);
  const [nodeLibraryOpen, setNodeLibraryOpen] = useState(true);
  const [propertyPanelOpen, setPropertyPanelOpen] = useState(true);
  const [workflowName, setWorkflowName] = useState(currentWorkflow?.name || '新工作流');

  // 画布引用
  const canvasRef = useRef(null);
  const svgRef = useRef(null);

  // 数据桥接函数
  const updateModuleData = data.updateModuleData || (() => {});
  const getModuleData = data.getModuleData || (() => ({}));

  // 节点类型定义
  const nodeTypes = {
    'data-source': {
      title: '数据源',
      icon: 'database',
      color: '#4CAF50',
      description: '从各种数据源获取数据'
    },
    'transform': {
      title: '数据处理',
      icon: 'transform',
      color: '#2196F3',
      description: '对数据进行转换、过滤、聚合'
    },
    'condition': {
      title: '条件分支',
      icon: 'call_split',
      color: '#FF9800',
      description: '根据条件执行不同分支'
    },
    'output': {
      title: '输出',
      icon: 'output',
      color: '#9C27B0',
      description: '将结果输出到目标系统'
    },
    'control': {
      title: '控制',
      icon: 'settings',
      color: '#607D8B',
      description: '控制工作流执行逻辑'
    }
  };

  // 生成唯一节点ID
  const generateNodeId = useCallback(() => {
    return `node_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  // 添加节点到画布
  const addNodeToCanvas = useCallback((nodeType, position) => {
    const newNode = {
      id: generateNodeId(),
      type: nodeType,
      position: position,
      config: getDefaultNodeConfig(nodeType),
      status: 'idle'
    };
    
    const updatedNodes = [...nodes, newNode];
    setNodes(updatedNodes);
    
    // 更新当前工作流
    const updatedWorkflow = {
      ...currentWorkflow,
      nodes: updatedNodes,
      lastModified: new Date().toISOString()
    };
    setCurrentWorkflow(updatedWorkflow);
    
    // 同步到ClojureScript
    updateModuleData('workflow', {
      currentWorkflow: updatedWorkflow
    });
  }, [nodes, currentWorkflow, generateNodeId, updateModuleData]);

  // 获取节点默认配置
  const getDefaultNodeConfig = (nodeType) => {
    const configs = {
      'data-source': {
        sourceType: 'database',
        connection: {},
        query: '',
        refreshInterval: 3600
      },
      'transform': {
        operation: 'filter',
        expression: '',
        outputFormat: 'json'
      },
      'condition': {
        condition: '',
        trueBranch: '',
        falseBranch: ''
      },
      'output': {
        destination: 'file',
        format: 'json',
        template: ''
      },
      'control': {
        delay: 0,
        retryCount: 3,
        errorHandling: 'stop'
      }
    };
    return configs[nodeType] || {};
  };

  // 处理节点拖拽
  const handleNodeDragStart = useCallback((e, nodeType) => {
    e.dataTransfer.setData('nodeType', nodeType);
    e.dataTransfer.effectAllowed = 'copy';
  }, []);

  // 处理画布放置
  const handleCanvasDrop = useCallback((e) => {
    e.preventDefault();
    const nodeType = e.dataTransfer.getData('nodeType');
    
    if (nodeType) {
      const rect = canvasRef.current.getBoundingClientRect();
      const position = {
        x: (e.clientX - rect.left - canvasOffset.x) / canvasScale,
        y: (e.clientY - rect.top - canvasOffset.y) / canvasScale
      };
      addNodeToCanvas(nodeType, position);
    }
  }, [canvasOffset, canvasScale, addNodeToCanvas]);

  // 处理画布拖拽
  const handleCanvasDragOver = useCallback((e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  }, []);

  // 节点库组件
  const NodeLibrary = () => {
    return React.createElement(Box, { sx: { width: 280, borderRight: '1px solid #e0e0e0' } },
      React.createElement(Box, { sx: { p: 2, borderBottom: '1px solid #e0e0e0' } },
        React.createElement(Typography, { variant: 'h6' }, '节点库'),
        React.createElement(TextField, {
          fullWidth: true,
          size: 'small',
          placeholder: '搜索节点...',
          sx: { mt: 1 }
        })
      ),
      React.createElement(List, { sx: { p: 1 } },
        Object.entries(nodeTypes).map(([type, info]) =>
          React.createElement(ListItem, {
            key: type,
            draggable: true,
            onDragStart: (e) => handleNodeDragStart(e, type),
            sx: {
              border: '1px solid #e0e0e0',
              borderRadius: 1,
              mb: 1,
              cursor: 'grab',
              '&:hover': {
                backgroundColor: '#f5f5f5'
              }
            }
          },
            React.createElement(ListItemIcon, null,
              React.createElement('span', {
                className: 'material-icons',
                style: { color: info.color }
              }, info.icon)
            ),
            React.createElement(ListItemText, {
              primary: info.title,
              secondary: info.description
            })
          )
        )
      )
    );
  };

  // 节点组件
  const WorkflowNode = ({ node }) => {
    const nodeType = nodeTypes[node.type];
    const isSelected = selectedNode?.id === node.id;
    
    return React.createElement(Box, {
      sx: {
        position: 'absolute',
        left: node.position.x,
        top: node.position.y,
        width: 200,
        minHeight: 80,
        backgroundColor: 'white',
        border: `2px solid ${nodeType.color}`,
        borderRadius: 2,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        cursor: 'move',
        userSelect: 'none',
        transform: `scale(${canvasScale})`,
        transformOrigin: 'top left',
        opacity: node.status === 'disabled' ? 0.6 : 1,
        ...(isSelected && {
          boxShadow: `0 0 0 2px ${nodeType.color}`
        })
      },
      onClick: () => setSelectedNode(node),
      onMouseDown: (e) => handleNodeMouseDown(e, node)
    },
      React.createElement(Box, { sx: { p: 2 } },
        React.createElement(Box, { sx: { display: 'flex', alignItems: 'center', mb: 1 } },
          React.createElement('span', {
            className: 'material-icons',
            sx: { color: nodeType.color, mr: 1, fontSize: 20 }
          }, nodeType.icon),
          React.createElement(Typography, { variant: 'body2', fontWeight: 'bold' }, nodeType.title)
        ),
        React.createElement(Typography, { variant: 'caption', color: 'text.secondary' },
          `${node.type} - ${node.status}`
        )
      ),
      // 连接点
      React.createElement(Box, {
        sx: {
          position: 'absolute',
          left: -8,
          top: '50%',
          width: 16,
          height: 16,
          backgroundColor: '#2196F3',
          borderRadius: '50%',
          cursor: 'crosshair'
        },
        className: 'connection-point input'
      }),
      React.createElement(Box, {
        sx: {
          position: 'absolute',
          right: -8,
          top: '50%',
          width: 16,
          height: 16,
          backgroundColor: '#4CAF50',
          borderRadius: '50%',
          cursor: 'crosshair'
        },
        className: 'connection-point output'
      })
    );
  };

  // 处理节点鼠标按下事件
  const handleNodeMouseDown = useCallback((e, node) => {
    e.stopPropagation();
    const startX = e.clientX - node.position.x * canvasScale;
    const startY = e.clientY - node.position.y * canvasScale;
    
    const handleMouseMove = (moveEvent) => {
      const newPosition = {
        x: (moveEvent.clientX - startX) / canvasScale,
        y: (moveEvent.clientY - startY) / canvasScale
      };
      
      const updatedNodes = nodes.map(n => 
        n.id === node.id ? { ...n, position: newPosition } : n
      );
      setNodes(updatedNodes);
    };
    
    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      
      // 更新工作流
      const updatedWorkflow = {
        ...currentWorkflow,
        nodes: nodes,
        lastModified: new Date().toISOString()
      };
      setCurrentWorkflow(updatedWorkflow);
      updateModuleData('workflow', {
        currentWorkflow: updatedWorkflow
      });
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [nodes, currentWorkflow, canvasScale, updateModuleData]);

  // 工作流画布组件
  const WorkflowCanvas = () => {
    return React.createElement(Box, {
      ref: canvasRef,
      sx: {
        flex: 1,
        position: 'relative',
        backgroundColor: '#f5f5f5',
        backgroundImage: `
          linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
        `,
        backgroundSize: `${20 * canvasScale}px ${20 * canvasScale}px`,
        overflow: 'hidden',
        cursor: isDragging ? 'grabbing' : 'grab'
      },
      onDrop: handleCanvasDrop,
      onDragOver: handleCanvasDragOver,
      onMouseDown: handleCanvasMouseDown
    },
      // SVG连接线容器
      React.createElement('svg', {
        ref: svgRef,
        style: {
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none'
        }
      },
        // 这里将渲染连接线
      ),
      // 渲染节点
      nodes.map(node => 
        React.createElement(WorkflowNode, { 
          key: node.id, 
          node: node 
        })
      )
    );
  };

  // 处理画布拖拽
  const handleCanvasMouseDown = useCallback((e) => {
    if (e.target === canvasRef.current) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - canvasOffset.x, y: e.clientY - canvasOffset.y });
    }
  }, [canvasOffset]);

  // 属性面板组件
  const PropertyPanel = () => {
    if (!selectedNode) {
      return React.createElement(Box, { sx: { width: 300, borderLeft: '1px solid #e0e0e0', p: 2 } },
        React.createElement(Typography, { variant: 'h6', gutterBottom: true }, '属性面板'),
        React.createElement(Typography, { variant: 'body2', color: 'text.secondary' },
          '请选择一个节点来查看和编辑其属性'
        )
      );
    }

    const nodeType = nodeTypes[selectedNode.type];
    
    return React.createElement(Box, { sx: { width: 300, borderLeft: '1px solid #e0e0e0', p: 2 } },
      React.createElement(Box, { sx: { display: 'flex', alignItems: 'center', mb: 2 } },
        React.createElement('span', {
          className: 'material-icons',
          sx: { color: nodeType.color, mr: 1 }
        }, nodeType.icon),
        React.createElement(Typography, { variant: 'h6' }, nodeType.title)
      ),
      
      React.createElement(Typography, { variant: 'subtitle2', gutterBottom: true }, '基本信息'),
      React.createElement(TextField, {
        fullWidth: true,
        label: '节点ID',
        value: selectedNode.id,
        disabled: true,
        sx: { mb: 2 }
      }),
      React.createElement(TextField, {
        fullWidth: true,
        label: '节点类型',
        value: selectedNode.type,
        disabled: true,
        sx: { mb: 2 }
      }),
      
      React.createElement(Typography, { variant: 'subtitle2', gutterBottom: true, mt: 2 }, '配置参数'),
      // 这里将根据节点类型显示不同的配置字段
      React.createElement(TextField, {
        fullWidth: true,
        label: '描述',
        multiline: true,
        rows: 3,
        value: selectedNode.config?.description || '',
        onChange: (e) => handleNodeConfigChange('description', e.target.value),
        sx: { mb: 2 }
      })
    );
  };

  // 处理节点配置变化
  const handleNodeConfigChange = useCallback((key, value) => {
    if (!selectedNode) return;
    
    const updatedNodes = nodes.map(node =>
      node.id === selectedNode.id
        ? { ...node, config: { ...node.config, [key]: value } }
        : node
    );
    setNodes(updatedNodes);
    
    const updatedNode = updatedNodes.find(n => n.id === selectedNode.id);
    setSelectedNode(updatedNode);
    
    // 更新工作流
    const updatedWorkflow = {
      ...currentWorkflow,
      nodes: updatedNodes,
      lastModified: new Date().toISOString()
    };
    setCurrentWorkflow(updatedWorkflow);
    updateModuleData('workflow', {
      currentWorkflow: updatedWorkflow
    });
  }, [selectedNode, nodes, currentWorkflow, updateModuleData]);

  // 工具栏组件
  const WorkflowToolbar = () => {
    return React.createElement(AppBar, { position: 'static', color: 'default', elevation: 1 },
      React.createElement(Toolbar, null,
        React.createElement(Button, {
          variant: 'contained',
          startIcon: React.createElement('span', { className: 'material-icons' }, 'add'),
          onClick: handleNewWorkflow,
          sx: { mr: 2 }
        }, '新建'),
        React.createElement(Button, {
          variant: 'outlined',
          startIcon: React.createElement('span', { className: 'material-icons' }, 'save'),
          onClick: handleSaveWorkflow,
          sx: { mr: 2 }
        }, '保存'),
        React.createElement(Button, {
          variant: 'outlined',
          startIcon: React.createElement('span', { className: 'material-icons' }, 'play_arrow'),
          onClick: handleRunWorkflow,
          sx: { mr: 2 }
        }, '运行'),
        React.createElement(Button, {
          variant: 'outlined',
          startIcon: React.createElement('span', { className: 'material-icons' }, 'bug_report'),
          onClick: handleDebugWorkflow,
          sx: { mr: 2 }
        }, '调试'),
        React.createElement(Box, { sx: { flexGrow: 1 } }),
        React.createElement(Typography, { variant: 'h6' }, workflowName)
      )
    );
  };

  // 处理新建工作流
  const handleNewWorkflow = useCallback(() => {
    const newWorkflow = {
      id: generateNodeId(),
      name: `工作流_${Date.now()}`,
      description: '',
      nodes: [],
      connections: [],
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString()
    };
    
    setCurrentWorkflow(newWorkflow);
    setNodes([]);
    setConnections([]);
    setWorkflowName(newWorkflow.name);
    setSelectedNode(null);
  }, [generateNodeId]);

  // 处理保存工作流
  const handleSaveWorkflow = useCallback(() => {
    if (!currentWorkflow) return;
    
    const workflowToSave = {
      ...currentWorkflow,
      name: workflowName,
      nodes: nodes,
      connections: connections,
      lastModified: new Date().toISOString()
    };
    
    // 这里应该调用保存API
    console.log('保存工作流:', workflowToSave);
    
    // 同步到ClojureScript
    updateModuleData('workflow', {
      currentWorkflow: workflowToSave,
      workflows: [...workflows, workflowToSave]
    });
  }, [currentWorkflow, workflowName, nodes, connections, workflows, updateModuleData]);

  // 处理运行工作流
  const handleRunWorkflow = useCallback(() => {
    if (!currentWorkflow) return;
    console.log('运行工作流:', currentWorkflow);
    // 这里将实现工作流执行逻辑
  }, [currentWorkflow]);

  // 处理调试工作流
  const handleDebugWorkflow = useCallback(() => {
    if (!currentWorkflow) return;
    console.log('调试工作流:', currentWorkflow);
    // 这里将实现工作流调试逻辑
  }, [currentWorkflow]);

  return React.createElement(Box, { sx: { height: '100vh', display: 'flex', flexDirection: 'column' } },
    // 工具栏
    React.createElement(WorkflowToolbar),
    
    // 主内容区
    React.createElement(Box, { sx: { flex: 1, display: 'flex' } },
      // 左侧节点库
      nodeLibraryOpen && React.createElement(NodeLibrary),
      
      // 中间画布
      React.createElement(WorkflowCanvas),
      
      // 右侧属性面板
      propertyPanelOpen && React.createElement(PropertyPanel)
    ),
    
    // 浮动操作按钮
    React.createElement(Fab, {
      color: 'primary',
      sx: {
        position: 'fixed',
        bottom: 16,
        left: 16
      },
      onClick: () => setNodeLibraryOpen(!nodeLibraryOpen)
    },
      React.createElement('span', { className: 'material-icons' }, 'menu')
    )
  );
}

// Export for use in dashboard
window.WorkflowBuilder = WorkflowBuilder;
