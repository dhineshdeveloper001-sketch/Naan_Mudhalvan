import express from 'express';
import Employee from '../models/Employee.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// GET /api/tasks — Aggregate all tasks across employees
router.get('/', authenticate, async (req, res) => {
  try {
    const { department, status } = req.query;
    const employees = await Employee.find();

    let tasks = employees.flatMap(emp =>
      emp.tasks.map(task => ({
        ...task.toJSON(),
        employeeId:        emp._id,
        employeeName:      emp.name,
        employeeDisplayId: emp.displayId,
      }))
    );

    if (department) tasks = tasks.filter(t => t.department === department);
    if (status)     tasks = tasks.filter(t => t.status === status);

    res.json(tasks);
  } catch { res.status(500).json({ error: 'Failed to fetch tasks' }); }
});

export default router;
