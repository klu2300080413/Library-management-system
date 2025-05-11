import React, { useState, useEffect } from 'react';
import { Button, Form, Modal, Table, Row, Col, Alert, Spinner } from 'react-bootstrap';

const Books = () => {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    isbn: '',
    title: '',
    category: '',
    edition: '',
    price: '',
    publisher: ''
  });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/books');
      const data = await res.json();
      setBooks(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch books.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => setSearchTerm(e.target.value);

  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.isbn.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openModal = (book = null) => {
    if (book) {
      setFormData(book);
      setEditId(book.id);
    } else {
      setFormData({
        isbn: '',
        title: '',
        category: '',
        edition: '',
        price: '',
        publisher: ''
      });
      setEditId(null);
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData({
      isbn: '',
      title: '',
      category: '',
      edition: '',
      price: '',
      publisher: ''
    });
    setEditId(null);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = editId ? `/api/books/${editId}` : '/api/books';
    const method = editId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!res.ok) throw new Error('Failed to save book');

      fetchBooks();
      closeModal();
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this book?')) return;

    try {
      const res = await fetch(`/api/books/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete book');

      fetchBooks();
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Books Management</h2>
      {error && <Alert variant="danger">{error}</Alert>}

      <Row className="mb-3">
        <Col md={6}>
          <Form.Control
            type="text"
            placeholder="Search by title, ISBN, or category"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </Col>
        <Col md={6} className="text-end">
          <Button variant="primary" onClick={() => openModal()}>
            Add New Book
          </Button>
        </Col>
      </Row>

      {loading ? (
        <div className="text-center mt-4">
          <Spinner animation="border" />
          <p className="mt-2">Loading books...</p>
        </div>
      ) : filteredBooks.length === 0 ? (
        <p className="text-center mt-4">No books found.</p>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>ISBN</th>
              <th>Title</th>
              <th>Category</th>
              <th>Edition</th>
              <th>Price</th>
              <th>Publisher</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBooks.map((book) => (
              <tr key={book.id}>
                <td>{book.isbn}</td>
                <td>{book.title}</td>
                <td>{book.category}</td>
                <td>{book.edition}</td>
                <td>${book.price}</td>
                <td>{book.publisher}</td>
                <td>
                  <Button variant="info" size="sm" className="me-2" onClick={() => openModal(book)}>
                    Edit
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => handleDelete(book.id)}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Modal Form */}
      <Modal show={showModal} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>{editId ? 'Edit Book' : 'Add New Book'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            {['isbn', 'title', 'category', 'edition', 'price', 'publisher'].map((field) => (
              <Form.Group className="mb-3" key={field}>
                <Form.Label>{field.charAt(0).toUpperCase() + field.slice(1)}</Form.Label>
                <Form.Control
                  type={field === 'price' ? 'number' : 'text'}
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  required={field !== 'edition'} // optional
                />
              </Form.Group>
            ))}
            <div className="text-end">
              <Button variant="secondary" className="me-2" onClick={closeModal}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                {editId ? 'Update' : 'Save'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Books;
