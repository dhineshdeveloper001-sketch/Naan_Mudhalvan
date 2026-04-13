import express from 'express';
import Employee from '../models/Employee.js';
import Log from '../models/Log.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/roles.js';

const router = express.Router();

// ─── Workflow task factories ──────────────────────────────────────────────────
const onboardingTasks = () => [
  { title: 'Laptop Provisioning',  department: 'IT',         status: 'pending', assignee: 'IT Fleet' },
  { title: 'Email Account Setup',  department: 'IT',         status: 'pending', assignee: 'SysAdmin' },
  { title: 'Access Badge Creation',department: 'Security',   status: 'pending', assignee: 'Security Desk' },
  { title: 'Desk Allocation',      department: 'Facilities', status: 'pending', assignee: 'Ops Team' },
];

const promotionTasks = () => [
  { title: 'Update Role Permissions',   department: 'IT',       status: 'pending', assignee: 'SysAdmin' },
  { title: 'Update Badge Access Level', department: 'Security', status: 'pending', assignee: 'Security Desk' },
  { title: 'Notify Department Heads',   department: 'HR',       status: 'pending', assignee: 'HR Team' },
];

const offboardingTasks = () => [
  { title: 'Revoke System Access',  department: 'IT',         status: 'pending', assignee: 'SysAdmin' },
  { title: 'Disable Access Badge',  department: 'Security',   status: 'pending', assignee: 'Security Desk' },
  { title: 'Release Workspace',     department: 'Facilities', status: 'pending', assignee: 'Ops Team' },
  { title: 'Process Final Payroll', department: 'HR',         status: 'pending', assignee: 'HR Team' },
];

const log = async (message, type, employeeId = null, by = 'system') => {
  try { await Log.create({ message, type, employeeId, triggeredBy: by }); }
  catch (e) { console.error('Log failed:', e.message); }
};

// GET /api/employees
router.get('/', authenticate, async (req, res) => {
  try {
    const employees = await Employee.find().sort({ createdAt: -1 });
    res.json(employees);
  } catch { res.status(500).json({ error: 'Failed to fetch employees' }); }
});

// GET /api/employees/:id
router.get('/:id', authenticate, async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).json({ error: 'Employee not found' });
    res.json(employee);
  } catch { res.status(500).json({ error: 'Failed to fetch employee' }); }
});

// POST /api/employees — Create + trigger onboarding workflow
router.post('/', authenticate, requireRole('hr', 'admin'), async (req, res) => {
  try {
    const { name, role, department, status = 'hired' } = req.body;
    if (!name || !role || !department) {
      return res.status(400).json({ error: 'name, role, and department are required' });
    }
    const employee = await Employee.create({
      name, role, department, status, stage: 'onboarding',
      tasks: status === 'hired' ? onboardingTasks() : [],
    });
    await log(`New Hire Detected: ${name} (${role})`, 'info', employee._id, req.user.email);
    await log(`Onboarding Workflow Triggered for ${employee.displayId}`, 'success', employee._id, 'system');
    res.status(201).json(employee);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create employee' });
  }
});

// PUT /api/employees/:id — Update + trigger lifecycle automation
router.put('/:id', authenticate, requireRole('hr', 'admin'), async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).json({ error: 'Employee not found' });

    const prevStatus = employee.status;
    const { status, role: newRole, ...rest } = req.body;

    Object.assign(employee, rest);
    if (newRole) employee.role = newRole;
    if (status) employee.status = status;

    // ── Workflow automation ───────────────────────────────────────────────
    if (status && status !== prevStatus) {
      if (status === 'promoted') {
        employee.stage = 'active';
        employee.previousRole = prevStatus;
        employee.tasks.push(...promotionTasks());
        await log(`Employee Promoted: ${employee.name} → ${newRole || employee.role}`, 'success', employee._id, req.user.email);
        await log(`Promotion Workflow: Permission update tasks created`, 'info', employee._id, 'system');
      } else if (status === 'terminated') {
        employee.stage = 'offboarding';
        employee.tasks.push(...offboardingTasks());
        await log(`Termination Initiated: ${employee.name}`, 'warning', employee._id, req.user.email);
        await log(`Offboarding Workflow: Access revocation tasks created`, 'warning', employee._id, 'system');
      } else if (status === 'active') {
        employee.stage = 'active';
        await log(`Employee Activated: ${employee.name}`, 'success', employee._id, req.user.email);
      }
    }

    await employee.save();
    res.json(employee);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update employee' });
  }
});

// PATCH /api/employees/:id/tasks/:taskId — Update task status
router.patch('/:id/tasks/:taskId', authenticate, async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) return res.status(400).json({ error: 'status is required' });

    const employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).json({ error: 'Employee not found' });

    const task = employee.tasks.id(req.params.taskId);
    if (!task) return res.status(404).json({ error: 'Task not found' });

    task.status = status;
    await employee.save();
    await log(`Task "${task.title}" → ${status} (${employee.name})`, 'info', employee._id, req.user.email);
    res.json(employee);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// DELETE /api/employees/:id
router.delete('/:id', authenticate, requireRole('admin'), async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);
    if (!employee) return res.status(404).json({ error: 'Employee not found' });
    await log(`Employee Record Deleted: ${employee.name} (${employee.displayId})`, 'warning', null, req.user.email);
    res.json({ message: 'Employee deleted' });
  } catch { res.status(500).json({ error: 'Failed to delete employee' }); }
});

export default router;
