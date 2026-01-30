import React from 'react';
import Card from 'react-bootstrap/Card';

const StatCard = ({ title, value, subtitle, icon, color = 'primary' }) => {
  return (
    <Card className="h-100 shadow-sm border-0">
      <Card.Body className="d-flex align-items-center">
        <div 
          className="rounded-circle d-flex align-items-center justify-content-center me-3"
          style={{ 
            width: '48px', 
            height: '48px', 
            backgroundColor: `var(--bs-${color}-bg, rgba(var(--bs-${color}-rgb, 13, 110, 253), 0.1))`,
            color: `var(--bs-${color}, #0d6efd)`
          }}
        >
          {icon}
        </div>
        <div>
          <h6 className="mb-0 text-muted small">{title}</h6>
          <h4 className="mb-0 fw-bold">{value}</h4>
          {subtitle && <small className="text-muted">{subtitle}</small>}
        </div>
      </Card.Body>
    </Card>
  );
};

export default StatCard;
