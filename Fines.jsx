import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Row, Col, Badge, Alert, Modal } from 'react-bootstrap';

const Fines = () => {
  const [fines, setFines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedFine, setSelectedFine] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchFines();
  }, []);

  const fetchFines = async () => {
    try {
      const response = await fetch('/api/fines');
      const data = await response.json();
      setFines(data);
      setError(null);
    } catch (error) {
      setError('Failed to fetch fines data');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (fineId) => {
    try {
      const response = await fetch(`/api/fines/${fineId}/pay`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) throw new Error('Payment processing failed');
      
      fetchFines();
      setShowPaymentModal(false);
      setError(null);
    } catch (error) {
      setError('Failed to process payment');
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredFines = fines.filter(fine => 
    fine.readerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    fine.bookTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getFineStatus = (status) => {
    switch (status) {
      case 'PENDING':
        return <Badge bg="warning">Pending</Badge>;
      case 'PAID':
        return <Badge bg="success">Paid</Badge>;
      case 'OVERDUE':
        return <Badge bg="danger">Overdue</Badge>;
      default:
        return <Badge bg="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="container mt-4">
      <h2>Manage Fines</h2>
      
      {error && <Alert variant="danger">{error}</Alert>}

      <Row className="mb-4">
        <Col md={6}>
          <Form.Control
            type="search"
            placeholder="Search by reader name or book title..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </Col>
        <Col md={6} className="text-end">
          <Button 
            variant="success"
            onClick={() => fetchFines()}
          >
            Refresh Fines
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
              <th>Reader Name</th>
              <th>Book Title</th>
              <th>Due Date</th>
              <th>Return Date</th>
              <th>Fine Amount</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredFines.map((fine) => (
              <tr key={fine.id}>
                <td>{fine.readerName}</td>
                <td>{fine.bookTitle}</td>
                <td>{new Date(fine.dueDate).toLocaleDateString()}</td>
                <td>
                  {fine.returnDate 
                    ? new Date(fine.returnDate).toLocaleDateString() 
                    : 'Not Returned'}
                </td>
                <td>${fine.amount.toFixed(2)}</td>
                <td>{getFineStatus(fine.status)}</td>
                <td>
                  {fine.status !== 'PAID' && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => {
                        setSelectedFine(fine);
                        setShowPaymentModal(true);
                      }}
                    >
                      Process Payment
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <Modal show={showPaymentModal} onHide={() => setShowPaymentModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Process Fine Payment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedFine && (
            <>
              <p><strong>Reader:</strong> {selectedFine.readerName}</p>
              <p><strong>Book:</strong> {selectedFine.bookTitle}</p>
              <p><strong>Fine Amount:</strong> ${selectedFine.amount.toFixed(2)}</p>
              <p>Are you sure you want to process this payment?</p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPaymentModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={() => handlePayment(selectedFine.id)}
          >
            Confirm Payment
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Fines;
  