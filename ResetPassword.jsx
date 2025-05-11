import { useState, useEffect } from 'react';
import { Form, Button, Card, Alert, Container, Row, Col } from 'react-bootstrap';
import { useNavigate, useSearchParams } from 'react-router-dom';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [tokenValid, setTokenValid] = useState(false);

  useEffect(() => {
    validateResetToken();
  }, []);

  const validateResetToken = async () => {
    const token = searchParams.get('token');
    if (!token) {
      setError('Invalid reset token');
      return;
    }

    try {
      const response = await fetch(`/api/auth/validate-reset-token?token=${token}`);
      if (!response.ok) throw new Error('Invalid or expired token');
      setTokenValid(true);
    } catch (error) {
      setError('Invalid or expired reset token');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: searchParams.get('token'),
          password: formData.password,
        }),
      });

      if (!response.ok) throw new Error('Failed to reset password');

      navigate('/login', { state: { message: 'Password reset successful' } });
    } catch (error) {
      setError('Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!tokenValid) {
    return (
      <Container>
        <Row className="justify-content-center align-items-center min-vh-100">
          <Col md={6} lg={5}>
            <Alert variant="danger">
              {error}
              <div className="mt-3">
                <Button variant="primary" onClick={() => navigate('/forgot-password')}>
                  Request New Reset Link
                </Button>
              </div>
            </Alert>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container>
      <Row className="justify-content-center align-items-center min-vh-100">
        <Col md={6} lg={5}>
          <Card className="shadow-sm">
            <Card.Body className="p-5">
              <div className="text-center mb-4">
                <h2 className="fw-bold">Reset Password</h2>
                <p className="text-muted">Enter your new password</p>
              </div>

              {error && (
                <Alert variant="danger" className="mb-4">
                  {error}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>New Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({
                      ...formData,
                      password: e.target.value
                    })}
                    placeholder="Enter new password"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({
                      ...formData,
                      confirmPassword: e.target.value
                    })}
                    placeholder="Confirm new password"
                    required
                  />
                </Form.Group>

                <div className="d-grid">
                  <Button
                    variant="primary"
                    type="submit"
                    disabled={loading}
                    className="py-2"
                  >
                    {loading ? 'Resetting...' : 'Reset Password'}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ResetPassword;