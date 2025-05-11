import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Alert, Table, Modal, Badge } from 'react-bootstrap';

const Returns = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchActiveLoans();
  }, []);

  const fetchActiveLoans = async () => {
    try {
      const response = await fetch('/api/loans/active');
      const data = await response.json();
      setLoans(data);
      setError(null);
    } catch (error) {
      setError('Failed to fetch active loans');
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = async (loanId) => {
    try {
      const response = await fetch(`/api/loans/${loanId}/return`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) throw new Error('Return processing failed');

      const data = await response.json();
      setShowModal(false);
      fetchActiveLoans();

      if (data.fine > 0) {
        setSelectedLoan({ ...data, loanId });
        setShowModal(true);
      }
    } catch (error) {
      setError('Failed to process return');
    }
  };

  const calculateDaysOverdue = (dueDate) => {
    const due = new Date(dueDate);
    const today = new Date();
    const diff = today - due;
    return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
  };

  const filteredLoans = loans.filter(loan =>
    loan.bookTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    loan.readerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mt-4">
      <h2>Return Books</h2>
      
      {error && <Alert variant="danger">{error}</Alert>}

      <Card className="mb-4">
        <Card.Body>
          <Form.Control
            type="search"
            placeholder="Search by book title or reader name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-3"
          />

          {loading ? (
            <div className="text-center">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <Table responsive hover>
              <thead>
                <tr>
                  <th>Book Title</th>
                  <th>Reader</th>
                  <th>Issue Date</th>
                  <th>Due Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLoans.map((loan) => {
                  const daysOverdue = calculateDaysOverdue(loan.dueDate);
                  return (
                    <tr key={loan.id}>
                      <td>{loan.bookTitle}</td>
                      <td>{loan.readerName}</td>
                      <td>{new Date(loan.issueDate).toLocaleDateString()}</td>
                      <td>{new Date(loan.dueDate).toLocaleDateString()}</td>
                      <td>
                        {daysOverdue > 0 ? (
                          <Badge bg="danger">
                            {daysOverdue} days overdue
                          </Badge>
                        ) : (
                          <Badge bg="success">On time</Badge>
                        )}
                      </td>
                      <td>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => {
                            setSelectedLoan(loan);
                            setShowModal(true);
                          }}
                        >
                          Process Return
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Process Book Return</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedLoan && (
            <>
              <p><strong>Book:</strong> {selectedLoan.bookTitle}</p>
              <p><strong>Reader:</strong> {selectedLoan.readerName}</p>
              <p><strong>Due Date:</strong> {new Date(selectedLoan.dueDate).toLocaleDateString()}</p>
              
              {selectedLoan.fine > 0 && (
                <Alert variant="warning">
                  <h6>Late Return Fine</h6>
                  <p className="mb-0">Fine Amount: ${selectedLoan.fine}</p>
                </Alert>
              )}

              <p className="mb-0">Are you sure you want to process this return?</p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => handleReturn(selectedLoan.id)}
          >
            Confirm Return
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Returns;
  