import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { WorkflowProvider, useWorkflow } from './WorkflowContext';
import React from 'react';

describe('Workflow Simulation Environment', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it('initializes with default state', () => {
    const { result } = renderHook(() => useWorkflow(), { wrapper: WorkflowProvider });
    
    expect(result.current.activeView).toBe('home');
    expect(result.current.employees.length).toBe(1);
    expect(result.current.employees[0].name).toBe('Sarah Chen');
    expect(result.current.logs.length).toBe(2);
  });

  it('triggerOnboarding creates a new employee and generates parallel tasks', () => {
    const { result } = renderHook(() => useWorkflow(), { wrapper: WorkflowProvider });

    act(() => {
      result.current.triggerOnboarding('Test User', 'Developer', 'Engineering');
    });

    // Check employee was added
    expect(result.current.employees.length).toBe(2);
    const newestEmp = result.current.employees[0];
    
    expect(newestEmp.name).toBe('Test User');
    expect(newestEmp.role).toBe('Developer');
    expect(newestEmp.status).toBe('hired');
    expect(newestEmp.stage).toBe('onboarding');

    // Check parallel tasks were generated correctly for IT, Security, and Facilities
    expect(newestEmp.tasks.length).toBe(4);
    
    const taskDeptSet = new Set(newestEmp.tasks.map(t => t.department));
    expect(taskDeptSet.has('IT')).toBe(true);
    expect(taskDeptSet.has('Security')).toBe(true);
    expect(taskDeptSet.has('Facilities')).toBe(true);
  });

  it('updateTaskStatus updates the specific task status properly', () => {
    const { result } = renderHook(() => useWorkflow(), { wrapper: WorkflowProvider });

    // The first employee is Sarah Chen, she has task T1
    act(() => {
      result.current.updateTaskStatus('EMP001', 'T1', 'in-progress');
    });

    const updatedTask = result.current.employees.find(e => e.id === 'EMP001')?.tasks.find(t => t.id === 'T1');
    expect(updatedTask?.status).toBe('in-progress');
  });

  it('runSimulation correctly executes a sequence of simulated events', () => {
    const { result } = renderHook(() => useWorkflow(), { wrapper: WorkflowProvider });

    act(() => {
      result.current.runSimulation();
    });

    // Fast forward enough for all setTimeout calls inside runSimulation
    act(() => {
      vi.advanceTimersByTime(4000);
    });

    // Checking if the simulated employee was added
    const simEmp = result.current.employees.find(e => e.name === 'Simulation User');
    expect(simEmp).toBeDefined();
    
    // Checking if the logs hold the sequence of events
    const logMessages = result.current.logs.map(l => l.message);
    expect(logMessages).toContain('Slack: Notification sent to #general');
    expect(logMessages).toContain('Active Directory: Provisions started for Simulation User');
    expect(logMessages).toContain('Manual Simulation Triggered');
  });
});
