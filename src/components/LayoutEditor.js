import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { FaPlus, FaTrash, FaCog, FaSave } from 'react-icons/fa';

const LayoutEditor = ({ buttons, onSaveLayout, onClose }) => {
  const [layoutButtons, setLayoutButtons] = useState(() => {
    if (Array.isArray(buttons) && buttons.length > 0) {
      return buttons.map(btn => ({
        id: btn.id || `btn-${Date.now()}-${Math.random()}`,
        label: btn.label,
        name: btn.name || '',
        action: btn.action || 'handleClick',
        size: btn.size || 'normal',
        variant: btn.variant || 'outline-primary'
      }));
    }
    return [];
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingButton, setEditingButton] = useState(null);
  const [newButton, setNewButton] = useState({
    label: '',
    name: '',
    action: 'handleClick',
    size: 'normal',
    variant: 'outline-primary'
  });

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(layoutButtons);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setLayoutButtons(items);
  };

  const handleAddButton = () => {
    const button = {
      id: `btn-${Date.now()}`,
      ...newButton
    };
    setLayoutButtons([...layoutButtons, button]);
    setShowAddModal(false);
    setNewButton({
      label: '',
      name: '',
      action: 'handleClick',
      size: 'normal',
      variant: 'outline-primary'
    });
  };

  const handleDeleteButton = (id) => {
    setLayoutButtons(layoutButtons.filter(btn => btn.id !== id));
  };

  const handleEditButton = (button) => {
    setEditingButton(button);
    setNewButton({
      label: button.label,
      name: button.name || '',
      action: button.action || 'handleClick',
      size: button.size || 'normal',
      variant: button.variant || 'outline-primary'
    });
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    setLayoutButtons(layoutButtons.map(btn =>
      btn.id === editingButton.id ? { ...btn, ...newButton } : btn
    ));
    setShowEditModal(false);
    setEditingButton(null);
  };

  const handleSave = () => {
    onSaveLayout(layoutButtons);
  };



  return (
    <div className="layout-editor-container">
      <div className="layout-editor-header">
        <h3>布局编辑器</h3>
        <div className="header-actions">
          <Button
            variant="success"
            onClick={() => setShowAddModal(true)}
          >
            <FaPlus /> 添加按钮
          </Button>
          <Button
            variant="primary"
            onClick={handleSave}
          >
            <FaSave /> 保存布局
          </Button>
          <Button
            variant="secondary"
            onClick={onClose}
          >
            关闭编辑器
          </Button>
        </div>
      </div>

      <div className="layout-editor-content">
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="buttons">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="button-grid"
                style={{ minHeight: '400px' }}
              >
                {layoutButtons.map((button, index) => (
                  <Draggable key={button.id} draggableId={button.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`button-item ${snapshot.isDragging ? 'dragging' : ''}`}
                      >
                        <Button
                          variant={button.variant}
                          size={button.size === 'large' ? 'lg' : button.size === 'small' ? 'sm' : 'md'}
                          className="editor-button"
                        >
                          {button.label}
                        </Button>
                        <div className="button-actions">
                          <Button
                            variant="warning"
                            size="sm"
                            onClick={() => handleEditButton(button)}
                            className="action-btn"
                          >
                            <FaCog />
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleDeleteButton(button.id)}
                            className="action-btn"
                          >
                            <FaTrash />
                          </Button>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>

      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>添加新按钮</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formLabel">
              <Form.Label>按钮显示文字</Form.Label>
              <Form.Control
                type="text"
                value={newButton.label}
                onChange={(e) => setNewButton({...newButton, label: e.target.value})}
                placeholder="例如：7"
              />
            </Form.Group>
            <Form.Group controlId="formName">
              <Form.Label>按钮值（点击时插入的内容）</Form.Label>
              <Form.Control
                type="text"
                value={newButton.name}
                onChange={(e) => setNewButton({...newButton, name: e.target.value})}
                placeholder="例如：7"
              />
            </Form.Group>
            <Form.Group controlId="formAction">
              <Form.Label>操作类型</Form.Label>
              <Form.Control
                as="select"
                value={newButton.action}
                onChange={(e) => setNewButton({...newButton, action: e.target.value})}
              >
                <option value="handleClick">插入内容</option>
                <option value="calculate">计算</option>
                <option value="clear">清空</option>
                <option value="del">删除</option>
                <option value="sin">正弦</option>
                <option value="cos">余弦</option>
                <option value="tan">正切</option>
                <option value="squareroot">平方根</option>
                <option value="inversion">倒数</option>
                <option value="factorial">阶乘</option>
                <option value="numberLog">自然对数</option>
                <option value="numberLog10">常用对数</option>
                <option value="exponent">e的幂</option>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formSize">
              <Form.Label>按钮大小</Form.Label>
              <Form.Control
                as="select"
                value={newButton.size}
                onChange={(e) => setNewButton({...newButton, size: e.target.value})}
              >
                <option value="normal">正常</option>
                <option value="large">大</option>
                <option value="small">小</option>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formVariant">
              <Form.Label>按钮样式</Form.Label>
              <Form.Control
                as="select"
                value={newButton.variant}
                onChange={(e) => setNewButton({...newButton, variant: e.target.value})}
              >
                <option value="outline-primary">蓝色边框</option>
                <option value="outline-secondary">灰色边框</option>
                <option value="outline-success">绿色边框</option>
                <option value="outline-danger">红色边框</option>
                <option value="outline-warning">黄色边框</option>
                <option value="primary">蓝色实心</option>
                <option value="secondary">灰色实心</option>
                <option value="success">绿色实心</option>
                <option value="danger">红色实心</option>
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            取消
          </Button>
          <Button variant="primary" onClick={handleAddButton}>
            添加
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>编辑按钮</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="editLabel">
              <Form.Label>按钮显示文字</Form.Label>
              <Form.Control
                type="text"
                value={newButton.label}
                onChange={(e) => setNewButton({...newButton, label: e.target.value})}
              />
            </Form.Group>
            <Form.Group controlId="editName">
              <Form.Label>按钮值</Form.Label>
              <Form.Control
                type="text"
                value={newButton.name}
                onChange={(e) => setNewButton({...newButton, name: e.target.value})}
              />
            </Form.Group>
            <Form.Group controlId="editAction">
              <Form.Label>操作类型</Form.Label>
              <Form.Control
                as="select"
                value={newButton.action}
                onChange={(e) => setNewButton({...newButton, action: e.target.value})}
              >
                <option value="handleClick">插入内容</option>
                <option value="calculate">计算</option>
                <option value="clear">清空</option>
                <option value="del">删除</option>
                <option value="sin">正弦</option>
                <option value="cos">余弦</option>
                <option value="tan">正切</option>
                <option value="squareroot">平方根</option>
                <option value="inversion">倒数</option>
                <option value="factorial">阶乘</option>
                <option value="numberLog">自然对数</option>
                <option value="numberLog10">常用对数</option>
                <option value="exponent">e的幂</option>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="editSize">
              <Form.Label>按钮大小</Form.Label>
              <Form.Control
                as="select"
                value={newButton.size}
                onChange={(e) => setNewButton({...newButton, size: e.target.value})}
              >
                <option value="normal">正常</option>
                <option value="large">大</option>
                <option value="small">小</option>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="editVariant">
              <Form.Label>按钮样式</Form.Label>
              <Form.Control
                as="select"
                value={newButton.variant}
                onChange={(e) => setNewButton({...newButton, variant: e.target.value})}
              >
                <option value="outline-primary">蓝色边框</option>
                <option value="outline-secondary">灰色边框</option>
                <option value="outline-success">绿色边框</option>
                <option value="outline-danger">红色边框</option>
                <option value="outline-warning">黄色边框</option>
                <option value="primary">蓝色实心</option>
                <option value="secondary">灰色实心</option>
                <option value="success">绿色实心</option>
                <option value="danger">红色实心</option>
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            取消
          </Button>
          <Button variant="primary" onClick={handleSaveEdit}>
            保存
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default LayoutEditor;
