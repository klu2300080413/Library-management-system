import React, { useState, useEffect } from 'react';
import { Form, Button, Alert, Card, Row, Col } from 'react-bootstrap';

const IssueBooks = () => {
  const [books, setBooks] = useState([]);
  const [readers, setReaders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [formData, setFormData] = useState({
    readerId: '',
    bookId: '',
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: ''
  });

  useEffect(() => {
    fetchBooks();
    fetchReaders();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await fetch('/api/books/available');
      const data = await response.json();
      setBooks(data);
    } catch (error) {
      setError('Failed to fetch available books');
    }
  };

  const fetchReaders = async () => {
    try {
      const response = await fetch('/api/readers');
      const data = await response.json();
      setReaders(data);
    } catch (error) {
      setError('Failed to fetch readers');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('/api/issues', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to issue book');

      setSuccess('Book issued successfully!');
      setFormData({
        readerId: '',
        bookId: '',
        issueDate: new Date().toISOString().split('T')[0],
        dueDate: ''
      });
      fetchBooks(); // Refresh available books list
    } catch (error) {
      setError('Failed to issue book. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const calculateDueDate = (issueDate) => {
    const date = new Date(issueDate);
    date.setDate(date.getDate() + 14); // 2 weeks from issue date
    return date.toISOString().split('T')[0];
  };

  const handleIssueDateChange = (e) => {
    const issueDate = e.target.value;
    setFormData({
      ...formData,
      issueDate,
      dueDate: calculateDueDate(issueDate)
    });
  };

  return (
    <div className="container mt-4">
      <h2>Issue Books</h2>
      
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <Row>
        <Col md={8}>
          <Card>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Select Reader</Form.Label>
                  <Form.Select
                    value={formData.readerId}
                    onChange={(e) => setFormData({...formData, readerId: e.target.value})}
                    required
                  >
                    <option value="">Choose a reader...</option>
                    {readers.map(reader => (
                      <option key={reader.id} value={reader.id}>
                        {reader.name} - ID: {reader.id}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Select Book</Form.Label>
                  <Form.Select
                    value={formData.bookId}
                    onChange={(e) => setFormData({...formData, bookId: e.target.value})}
                    required
                  >
                    <option value="">Choose a book...</option>
                    {books.map(book => (
                      <option key={book.id} value={book.id}>
                        {book.title} - ISBN: {book.isbn}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Issue Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={formData.issueDate}
                    onChange={handleIssueDateChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Due Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                    required
                  />
                </Form.Group>

                <Button 
                  type="submit" 
                  variant="primary" 
                  disabled={loading}
                  className="w-100"
                >
                  {loading ? 'Processing...' : 'Issue Book'}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Issue Guidelines</h5>
            </Card.Header>
            <Card.Body>
              <ul className="list-unstyled">
                <li>✓ Maximum 3 books per reader</li>
                <li>✓ Standard loan period: 14 days</li>
                <li>✓ Valid reader ID required</li>
                <li>✓ No pending fines allowed</li>
              </ul>
              <hr />
              <small className="text-muted">
                Note: Late returns will incur fines as per library policy
              </small>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default IssueBooks;
  