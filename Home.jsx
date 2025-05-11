import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaBook, FaUsers, FaExchangeAlt, FaMoneyBill } from 'react-icons/fa';

const Home = () => {
  const [stats, setStats] = useState({
    totalBooks: 0,
    availableBooks: 0,
    totalReaders: 0,
    activeLoans: 0,
    pendingFines: 0
  });

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch('/api/dashboard/stats');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
    }
  };

  const DashboardCard = ({ title, value, icon, color, link }) => (
    <Card className="mb-4 h-100">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <Card.Title className="text-muted">{title}</Card.Title>
            <h2 className="mb-0">{value}</h2>
          </div>
          <div style={{ color: color, fontSize: '2rem' }}>
            {icon}
          </div>
        </div>
        <Link to={link}>
          <Button variant="link" className="p-0 mt-3">View Details →</Button>
        </Link>
      </Card.Body>
    </Card>
  );

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1>Library Management System</h1>
          <p className="text-muted">Dashboard Overview</p>
        </div>
        <Button 
          variant="outline-primary"
          onClick={fetchDashboardStats}
        >
          Refresh Stats
        </Button>
      </div>

      <Row>
        <Col md={6} lg={3}>
          <DashboardCard
            title="Total Books"
            value={stats.totalBooks}
            icon={<FaBook />}
            color="#007bff"
            link="/books"
          />
        </Col>
        <Col md={6} lg={3}>
          <DashboardCard
            title="Registered Readers"
            value={stats.totalReaders}
            icon={<FaUsers />}
            color="#28a745"
            link="/readers"
          />
        </Col>
        <Col md={6} lg={3}>
          <DashboardCard
            title="Active Loans"
            value={stats.activeLoans}
            icon={<FaExchangeAlt />}
            color="#ffc107"
            link="/loans"
          />
        </Col>
        <Col md={6} lg={3}>
          <DashboardCard
            title="Pending Fines"
            value={`$${stats.pendingFines}`}
            icon={<FaMoneyBill />}
            color="#dc3545"
            link="/fines"
          />
        </Col>
      </Row>

      <Row className="mt-4">
        <Col md={6}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Quick Actions</h5>
            </Card.Header>
            <Card.Body>
              <div className="d-grid gap-2">
                <Link to="/books/add">
                  <Button variant="outline-primary" className="w-100">
                    Add New Book
                  </Button>
                </Link>
                <Link to="/loans/new">
                  <Button variant="outline-success" className="w-100">
                    Issue Book
                  </Button>
                </Link>
                <Link to="/returns">
                  <Button variant="outline-info" className="w-100">
                    Return Book
                  </Button>
                </Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">System Status</h5>
            </Card.Header>
            <Card.Body>
              <div className="mb-3">
                <h6>Available Books</h6>
                <div className="progress">
                  <div 
                    className="progress-bar" 
                    role="progressbar"
                    style={{ 
                      width: `${(stats.availableBooks / stats.totalBooks) * 100}%` 
                    }}
                    aria-valuenow={stats.availableBooks}
                    aria-valuemin="0"
                    aria-valuemax={stats.totalBooks}
                  >
                    {stats.availableBooks} / {stats.totalBooks}
                  </div>
                </div>
              </div>
              <div>
                <p className="mb-1">
                  <strong>Last System Update:</strong> {new Date().toLocaleDateString()}
                </p>
                <p className="mb-0">
                  <strong>System Status:</strong>{' '}
                  <span className="text-success">●</span> Operational
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Home;
  