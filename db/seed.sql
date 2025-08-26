-- SQLite Database Initialization with Demo Data
-- Run after schema.sql to populate the database with sample projects

-- Insert demo projects
INSERT INTO projects (
    id, title, description, image_url, target, raised, 
    start_date, end_date, status, created_at, updated_at
) VALUES 
(
    'clean-water-init-001', 
    'Clean Water Initiative', 
    'Providing clean drinking water to rural communities through well construction and filtration systems.',
    'https://images.unsplash.com/photo-1516937941344-00b4e0337589?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    25000,
    8750,
    datetime('now'),
    datetime('now', '+90 days'),
    'active',
    datetime('now'),
    datetime('now')
),
(
    'education-scholar-002',
    'Educational Scholarships',
    'Providing academic scholarships for talented students from disadvantaged backgrounds to pursue higher education.',
    'https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    15000,
    6200,
    datetime('now'),
    datetime('now', '+60 days'),
    'active',
    datetime('now'),
    datetime('now')
),
(
    'healthcare-outreach-003',
    'Healthcare Outreach',
    'Mobile healthcare services bringing medical care to remote villages and providing essential medical supplies.',
    'https://images.unsplash.com/photo-1584982751601-97dcc096659c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1172&q=80',
    30000,
    12800,
    datetime('now'),
    datetime('now', '+120 days'),
    'active',
    datetime('now'),
    datetime('now')
);
