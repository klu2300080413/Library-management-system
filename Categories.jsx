import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Row, Col, Modal, Alert } from 'react-bootstrap';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [error, setError] = useState(null);
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: ''
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();
      setCategories(data);
      setError(null);
    } catch (error) {
      setError('Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  const handleAddEdit = (category = null) => {
    setSelectedCategory(category);
    setCategoryForm(category || { name: '', description: '' });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = selectedCategory 
        ? `/api/categories/${selectedCategory.id}` 
        : '/api/categories';
      const method = selectedCategory ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(categoryForm),
      });

      if (!response.ok) throw new Error('Failed to save category');
      
      fetchCategories();
      setShowModal(false);
      setError(null);
    } catch (error) {
      setError('Failed to save category');
    }
  };

  const handleDelete = async (categoryId) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    
    try {
      const response = await fetch(`/api/categories/${categoryId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete category');
      
      fetchCategories();
      setError(null);
    } catch (error) {
      setError('Failed to delete category');
    }
  };

  return (
    <div className="container mt-4">
      <h2>Manage Categories</h2>
      
      {error && <Alert variant="danger">{error}</Alert>}

      <Row className="mb-4">
        <Col className="text-end">
          <Button variant="primary" onClick={() => handleAddEdit()}>
            Add New Category
          </Button>
        </Col>
      </Row>

      {loading ? (
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Books Count</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.id}>
                <td>{category.name}</td>
                <td>{category.description}</td>
                <td>{category.booksCount || 0}</td>
                <td>
                  <Button 
                    variant="info" 
                    size="sm" 
                    className="me-2"
                    onClick={() => handleAddEdit(category)}
                  >
                    Edit
                  </Button>
                  <Button 
                    variant="danger" 
                    size="sm"
                    onClick={() => handleDelete(category.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedCategory ? 'Edit Category' : 'Add New Category'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Category Name</Form.Label>
              <Form.Control
                type="text"
                value={categoryForm.name}
                onChange={(e) => setCategoryForm({
                  ...categoryForm,
                  name: e.target.value
                })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={categoryForm.description}
                onChange={(e) => setCategoryForm({
                  ...categoryForm,
                  description: e.target.value
                })}
              />
            </Form.Group>
            <div className="text-end">
              <Button 
                variant="secondary" 
                className="me-2" 
                onClick={() => setShowModal(false)}
              >
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                {selectedCategory ? 'Update' : 'Save'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Categories;
  