import React, { createContext, useContext, useState } from 'react';

const BAContext = createContext(null);

export const BAProvider = ({ children }) => {
  // 1. Projects List
  const [projectsList, setProjectsList] = useState([
    {
      id: 'proj-1',
      name: 'Customer Banking App Modernization',
      client: 'Elena Rostova (Apex Enterprise)',
      status: 'In Progress',
      progress: 72,
      ba: 'Dhaneesh Vijayanand',
      deadline: '18 Oct 2026',
      totalRequirements: 28,
      completedRequirements: 20,
      description: 'Next-generation omni-channel retail banking platform with biometrics, sub-second settlement, and micro-frontend architecture.'
    },
    {
      id: 'proj-2',
      name: 'AI Risk & Compliance Telemetry',
      client: 'Apex Global Financial',
      status: 'Under Review',
      progress: 88,
      ba: 'Dhaneesh Vijayanand',
      deadline: '24 Nov 2026',
      totalRequirements: 19,
      completedRequirements: 16,
      description: 'Automated AML transaction monitoring with real-time anomaly detection and audit trail reporting.'
    },
    {
      id: 'proj-3',
      name: 'Enterprise ERP Data Pipeline',
      client: 'Sterling Logistics Co.',
      status: 'Planning',
      progress: 30,
      ba: 'Dhaneesh Vijayanand',
      deadline: '15 Dec 2026',
      totalRequirements: 14,
      completedRequirements: 4,
      description: 'Cloud data pipeline connecting SAP, Salesforce, and bespoke warehouse telemetry hubs.'
    }
  ]);

  const [activeProject, setActiveProject] = useState(projectsList[0]);

  // 2. 10-Step BA Lifecycle Process Steps
  const [processSteps, setProcessSteps] = useState([
    {
      id: 1,
      step: '01',
      title: 'Project Initiation',
      phase: 'Discovery',
      status: 'completed',
      completion: 100,
      description: 'Establish project scope, preliminary business case, charter sign-off, and high-level stakeholder mapping.',
      deliverables: ['Project Charter', 'Preliminary Business Case', 'Scope Statement', 'Stakeholder Register'],
      activities: ['Conduct executive sponsor alignment meetings', 'Define strategic objectives and KPIs', 'Baseline project timeline']
    },
    {
      id: 2,
      step: '02',
      title: 'Stakeholder Analysis',
      phase: 'Discovery',
      status: 'completed',
      completion: 100,
      description: 'Identify power, influence, and interest levels across key personas and formulate engagement strategies.',
      deliverables: ['Stakeholder Matrix (Power/Interest)', 'RACI Chart', 'Communication Plan'],
      activities: ['Interview line-of-business leaders', 'Map regulatory requirements with Compliance officers', 'Establish feedback frequency']
    },
    {
      id: 3,
      step: '03',
      title: 'Requirement Gathering',
      phase: 'Elicitation',
      status: 'completed',
      completion: 100,
      description: 'Conduct workshops, surveys, interviews, and document analysis to extract functional and technical requirements.',
      deliverables: ['Elicitation Interview Transcripts', 'Current State Process Maps (As-Is)', 'User Journey Blueprints'],
      activities: ['Hold 6 interactive user workshops', 'Observe teller branch operations', 'Extract legacy system data contracts']
    },
    {
      id: 4,
      step: '04',
      title: 'Requirement Analysis',
      phase: 'Analysis',
      status: 'completed',
      completion: 100,
      description: 'Deconstruct, prioritize, and model requirements using MoSCoW, BPMN diagrams, and domain data models.',
      deliverables: ['Future State Process Maps (To-Be)', 'Data Flow Diagrams (DFD)', 'Gap Analysis Report'],
      activities: ['Identify functional conflicts across departments', 'Prioritize backlog items with product owners', 'Validate feasibility with Lead Architect']
    },
    {
      id: 5,
      step: '05',
      title: 'Documentation',
      phase: 'Specification',
      status: 'completed',
      completion: 100,
      description: 'Author rigorous Business Requirements Document (BRD), Software Requirements Specification (SRS), and User Stories.',
      deliverables: ['Business Requirements Document (BRD v2.4)', 'Software Requirements Spec (SRS)', 'Epics & User Story Backlog'],
      activities: ['Draft formal acceptance criteria using Gherkin syntax', 'Map non-functional SLA targets', 'Archive traceability matrix']
    },
    {
      id: 6,
      step: '06',
      title: 'Validation',
      phase: 'Sign-off',
      status: 'completed',
      completion: 100,
      description: 'Review specifications with stakeholders and technical leadership to obtain sign-offs and baselines.',
      deliverables: ['Signed Requirements Sign-off Sheet', 'Traceability Matrix Baseline', 'Design Prototype Approval'],
      activities: ['Facilitate formal walkthrough with Steering Committee', 'Resolve review comments', 'Freeze scope for Sprint 1-4']
    },
    {
      id: 7,
      step: '07',
      title: 'Development Support',
      phase: 'Execution',
      status: 'current',
      completion: 72,
      description: 'Provide daily clarification to engineering teams, review sprint increments, and refine user stories.',
      deliverables: ['Sprint Backlog Refinements', 'Clarification Decision Logs', 'API Contract Reviews'],
      activities: ['Participate in daily standups', 'Clarify edge cases on OTP login flow', 'Validate database schema against business rules']
    },
    {
      id: 8,
      step: '08',
      title: 'Testing / UAT',
      phase: 'Validation',
      status: 'upcoming',
      completion: 0,
      description: 'Define UAT test scenarios, acceptance criteria checklists, and guide business users during validation.',
      deliverables: ['UAT Test Plan', 'Business Acceptance Scenarios', 'UAT Defect Log'],
      activities: ['Prepare pilot test data set', 'Train pilot branch users', 'Log and triage user-reported anomalies']
    },
    {
      id: 9,
      step: '09',
      title: 'Implementation',
      phase: 'Deployment',
      status: 'upcoming',
      completion: 0,
      description: 'Support rollout, pilot release, change management, training, and operational handoff.',
      deliverables: ['Release Readiness Checklist', 'User Standard Operating Procedure (SOP)', 'Rollback Contingency Plan'],
      activities: ['Conduct pilot deployment in staging', 'Deliver train-the-trainer workshops', 'Oversee data migration sign-off']
    },
    {
      id: 10,
      step: '10',
      title: 'Closure',
      phase: 'Evaluation',
      status: 'upcoming',
      completion: 0,
      description: 'Conduct post-implementation review (PIR), measure KPI realization, and document lessons learned.',
      deliverables: ['Post-Implementation Review (PIR)', 'Lessons Learned Register', 'Final Benefits Realization Assessment'],
      activities: ['Measure 30-day adoption rate', 'Archive final project artifacts', 'Formal sponsor sign-off and project closure']
    }
  ]);

  // 3. Requirements
  const [requirements, setRequirements] = useState([
    {
      id: 'REQ-1024',
      title: 'Customer Login with OTP Verification',
      type: 'Functional',
      priority: 'Critical',
      status: 'Implemented',
      stakeholder: 'Elena Rostova (Apex Enterprise)',
      assignedBA: 'Dhaneesh Vijayanand',
      dueDate: '18 Oct 2026',
      description: 'The mobile banking client must authenticate users through mobile number and timed one-time password (TOTP) with biometric failover.',
      businessNeed: 'Mitigate unauthorized account access while ensuring sub-3 second login friction for verified mobile devices.',
      acceptanceCriteria: [
        'User enters registered phone number and receives 6-digit SMS code within 5 seconds.',
        'OTP expires exactly after 120 seconds of issuance.',
        'Account locks for 15 minutes after 5 consecutive failed attempts.',
        'Biometric authentication prompt is presented if device hardware permits.'
      ],
      businessRules: 'BR-001, BR-004',
      dependencies: 'SMS Gateway Service, User Identity Directory (UID)',
      relatedStories: 'US-102, US-105'
    },
    {
      id: 'REQ-1025',
      title: 'Real-Time Transaction Stream Telemetry HUD',
      type: 'Functional',
      priority: 'High',
      status: 'Approved',
      stakeholder: 'Elena Rostova (Apex Enterprise)',
      assignedBA: 'Dhaneesh Vijayanand',
      dueDate: '22 Oct 2026',
      description: 'Interactive dashboard showing live settlement transactions with instant push updates and status categorization.',
      businessNeed: 'Executive visibility into real-time payment volumes and failure anomalies.',
      acceptanceCriteria: [
        'Websocket connection maintains <500ms latency on transaction event receipt.',
        'Filterable by currency, merchant category, and status.'
      ],
      businessRules: 'BR-002',
      dependencies: 'Transaction Kafka Broker',
      relatedStories: 'US-108'
    },
    {
      id: 'REQ-1026',
      title: 'Automated AML Threshold Flagging',
      type: 'Business',
      priority: 'Critical',
      status: 'Analyzed',
      stakeholder: 'David Chen (Risk Committee)',
      assignedBA: 'Dhaneesh Vijayanand',
      dueDate: '28 Oct 2026',
      description: 'Transactions exceeding regulatory limits ($10,000 equivalent) must be queued for compliance review before dispatch.',
      businessNeed: 'Satisfy FinCEN and international banking compliance regulations.',
      acceptanceCriteria: [
        'Any single transaction >= $10,000 triggers immediate review state.',
        'Aggregate transfers exceeding $25,000 within 24 hours trigger audit warning.'
      ],
      businessRules: 'BR-001',
      dependencies: 'Risk Telemetry Engine',
      relatedStories: 'US-112'
    },
    {
      id: 'REQ-1027',
      title: 'High-Availability Database Read-Replicas',
      type: 'Technical',
      priority: 'High',
      status: 'Approved',
      stakeholder: 'Alex Vance (Lead Architect)',
      assignedBA: 'Dhaneesh Vijayanand',
      dueDate: '30 Oct 2026',
      description: 'Configure multi-region read replicas to maintain 99.99% service level agreement for customer queries.',
      businessNeed: 'Prevent database saturation during peak salary deposit intervals.',
      acceptanceCriteria: [
        'Query latency remains below 120ms during simulated 10,000 concurrent request benchmark.',
        'Failover activates automatically within 15 seconds.'
      ],
      businessRules: 'BR-007',
      dependencies: 'Cloud Infrastructure Fabric',
      relatedStories: 'US-115'
    },
    {
      id: 'REQ-1028',
      title: 'GDPR / CCPA Data Portability Export',
      type: 'Non-functional',
      priority: 'Medium',
      status: 'Gathering',
      stakeholder: 'Maria Santos (Legal Counsel)',
      assignedBA: 'Dhaneesh Vijayanand',
      dueDate: '05 Nov 2026',
      description: 'Customers must be able to download their complete account statement and transaction records in machine-readable JSON/PDF format.',
      businessNeed: 'Comply with international privacy and data sovereignty directives.',
      acceptanceCriteria: [
        'User requests data export from mobile settings.',
        'Secure signed download link emailed within 24 hours.'
      ],
      businessRules: 'BR-009',
      dependencies: 'Batch Document Generation Worker',
      relatedStories: 'US-119'
    },
    {
      id: 'REQ-1029',
      title: 'Biometric FaceID / TouchID Fast Access',
      type: 'Functional',
      priority: 'High',
      status: 'Implemented',
      stakeholder: 'Elena Rostova (Apex Enterprise)',
      assignedBA: 'Dhaneesh Vijayanand',
      dueDate: '12 Oct 2026',
      description: 'Allow clients to utilize device native biometrics to bypass password entry on returning sessions.',
      businessNeed: 'Elevate mobile engagement and reduce login abandonment rates.',
      acceptanceCriteria: [
        'Local secure enclave stores biometric session token.',
        'Fallback to PIN on three consecutive face recognition failures.'
      ],
      businessRules: 'BR-004',
      dependencies: 'Mobile Native Enclave SDK',
      relatedStories: 'US-103'
    }
  ]);

  // 4. Stakeholders
  const [stakeholders, setStakeholders] = useState([
    {
      id: 'stk-1',
      name: 'Elena Rostova',
      role: 'Sponsor & VP of Digital Delivery',
      department: 'Executive Leadership (Apex)',
      influence: 'High',
      interest: 'High',
      matrixQuadrant: 'Manage Closely',
      commPreference: 'Weekly Executive Briefing & Bi-weekly Demo',
      status: 'Active',
      email: 'elena.rostova@apexenterprise.com'
    },
    {
      id: 'stk-2',
      name: 'David Chen',
      role: 'Chief Compliance & Risk Officer',
      department: 'Legal & Regulatory',
      influence: 'High',
      interest: 'High',
      matrixQuadrant: 'Manage Closely',
      commPreference: 'Sprint Review & Compliance Sign-offs',
      status: 'Active',
      email: 'd.chen@apexenterprise.com'
    },
    {
      id: 'stk-3',
      name: 'Alex Vance',
      role: 'Lead Enterprise Architect',
      department: 'Core Engineering',
      influence: 'High',
      interest: 'Low',
      matrixQuadrant: 'Keep Satisfied',
      commPreference: 'Architecture Review Boards (ARB) & Slack',
      status: 'Active',
      email: 'alex.vance@apexenterprise.com'
    },
    {
      id: 'stk-4',
      name: 'Sarah Jenkins',
      role: 'Branch Operations Lead',
      department: 'Retail Banking Operations',
      influence: 'Low',
      interest: 'High',
      matrixQuadrant: 'Keep Informed',
      commPreference: 'Bi-weekly Newsletter & Demo Recordings',
      status: 'Consulted',
      email: 's.jenkins@apexenterprise.com'
    },
    {
      id: 'stk-5',
      name: 'Marcus Brody',
      role: 'Procurement Specialist',
      department: 'Vendor Management',
      influence: 'Low',
      interest: 'Low',
      matrixQuadrant: 'Monitor',
      commPreference: 'Quarterly Milestone Sign-offs',
      status: 'Informed',
      email: 'm.brody@apexenterprise.com'
    }
  ]);

  // 5. Tasks (Kanban Board)
  const [tasks, setTasks] = useState([
    {
      id: 'TSK-101',
      task: 'Finalize Gherkin criteria for OTP authentication',
      assignedTo: 'Dhaneesh Vijayanand',
      priority: 'High',
      status: 'Completed',
      dueDate: '02 Oct 2026',
      progress: 100
    },
    {
      id: 'TSK-102',
      task: 'Conduct stakeholder alignment on AML limits',
      assignedTo: 'Dhaneesh Vijayanand',
      priority: 'Critical',
      status: 'Review',
      dueDate: '06 Oct 2026',
      progress: 85
    },
    {
      id: 'TSK-103',
      task: 'Document data contract for Kafka transaction broker',
      assignedTo: 'Alex Vance',
      priority: 'Medium',
      status: 'In Progress',
      dueDate: '09 Oct 2026',
      progress: 60
    },
    {
      id: 'TSK-104',
      task: 'Draft UAT scenario scripts for retail tellers',
      assignedTo: 'Dhaneesh Vijayanand',
      priority: 'High',
      status: 'In Progress',
      dueDate: '14 Oct 2026',
      progress: 40
    },
    {
      id: 'TSK-105',
      task: 'Prepare pilot rollout training presentation',
      assignedTo: 'Sarah Jenkins',
      priority: 'Low',
      status: 'To Do',
      dueDate: '20 Oct 2026',
      progress: 0
    },
    {
      id: 'TSK-106',
      task: 'Review cloud database failover test report',
      assignedTo: 'Alex Vance',
      priority: 'Medium',
      status: 'To Do',
      dueDate: '25 Oct 2026',
      progress: 0
    }
  ]);

  // 6. User Stories
  const [userStories, setUserStories] = useState([
    {
      id: 'US-102',
      story: 'As a mobile banking customer, I want to receive a 6-digit OTP code on my verified phone number so that I can securely authenticate without remembering complex alphanumeric passwords.',
      priority: 'Critical',
      status: 'Implemented',
      acceptanceCriteria: 'Given a registered mobile number, when submitted, a 6-digit OTP is dispatched via SMS within 5s with a 120s expiry timer.',
      assignedDev: 'Dev Team Alpha',
      sprint: 'Sprint 3'
    },
    {
      id: 'US-105',
      story: 'As an executive stakeholder, I want to view an interactive visual circular ring representing project completion so that I immediately understand milestone progress.',
      priority: 'High',
      status: 'Implemented',
      acceptanceCriteria: 'Given real-time sprint data, the circular SVG ring displays percentage complete with color-coded gradient strokes.',
      assignedDev: 'Frontend Team',
      sprint: 'Sprint 3'
    },
    {
      id: 'US-108',
      story: 'As a corporate treasurer, I want to filter transaction records by currency and settlement status so that I can reconcile payroll disbursements quickly.',
      priority: 'High',
      status: 'In Progress',
      acceptanceCriteria: 'Filter controls return updated dataset within 200ms without page reload.',
      assignedDev: 'Fullstack Pod 2',
      sprint: 'Sprint 4'
    },
    {
      id: 'US-112',
      story: 'As a compliance analyst, I want the system to flag transfers over $10,000 for manual review so that we adhere to federal AML reporting mandates.',
      priority: 'Critical',
      status: 'To Do',
      acceptanceCriteria: 'Any ledger entry > $10,000 triggers approval card in Compliance Portal.',
      assignedDev: 'Backend Core',
      sprint: 'Sprint 5'
    }
  ]);

  // 7. Business Rules
  const [businessRules, setBusinessRules] = useState([
    {
      id: 'BR-001',
      rule: 'High-Value Transfer Compliance Threshold',
      condition: 'If single outbound transaction amount >= $10,000 USD (or local currency equivalent)',
      action: 'Place transaction in pending compliance queue and notify AML officer on duty.',
      priority: 'Critical',
      status: 'Active'
    },
    {
      id: 'BR-002',
      rule: 'Real-Time Transaction Latency SLA',
      condition: 'When event payload is received by the Kafka broker',
      action: 'Broadcast websocket packet to connected client HUDs in under 500ms.',
      priority: 'High',
      status: 'Active'
    },
    {
      id: 'BR-004',
      rule: 'Failed Authentication Rate Limiting',
      condition: 'If 5 consecutive invalid OTP or biometric attempts occur within 10 minutes',
      action: 'Lock account access for 15 minutes and dispatch security warning email to user.',
      priority: 'Critical',
      status: 'Active'
    },
    {
      id: 'BR-007',
      rule: 'Database Cluster Failover Tolerance',
      condition: 'If primary PostgreSQL / SQLite instance fails heartbeat check for > 3 intervals',
      action: 'Promote active read-replica to primary in under 15 seconds without transaction loss.',
      priority: 'High',
      status: 'Active'
    }
  ]);

  // 8. Change Requests
  const [changeRequests, setChangeRequests] = useState([
    {
      id: 'CR-101',
      requestedChange: 'Extend OTP validity window from 60 seconds to 120 seconds',
      requestedBy: 'Elena Rostova (Client Sponsor)',
      impact: 'Low Impact (UX Improvement)',
      priority: 'High',
      status: 'Implemented',
      date: '01 Oct 2026',
      costImpact: '$0 (Configuration update)',
      scheduleImpact: '0 Days'
    },
    {
      id: 'CR-102',
      requestedChange: 'Incorporate Biometric FaceID quick-pass before password prompt',
      requestedBy: 'Product Management Team',
      impact: 'Medium Impact (SDK Integration)',
      priority: 'High',
      status: 'Approved',
      date: '28 Sep 2026',
      costImpact: '$4,200',
      scheduleImpact: '+3 Days'
    },
    {
      id: 'CR-103',
      requestedChange: 'Add multi-currency conversion preview prior to wire settlement',
      requestedBy: 'Commercial Banking Division',
      impact: 'High Impact (FX Provider API integration)',
      priority: 'Medium',
      status: 'Under Analysis',
      date: '03 Oct 2026',
      costImpact: '$12,500',
      scheduleImpact: '+8 Days'
    }
  ]);

  // Helper actions
  const addRequirement = (newReq) => {
    const id = `REQ-${1024 + requirements.length}`;
    setRequirements((prev) => [{ ...newReq, id }, ...prev]);
  };

  const addTask = (newTask) => {
    const id = `TSK-${101 + tasks.length}`;
    setTasks((prev) => [{ ...newTask, id, progress: 0 }, ...prev]);
  };

  const updateTaskStatus = (taskId, newStatus) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? {
              ...t,
              status: newStatus,
              progress: newStatus === 'Completed' ? 100 : t.progress
            }
          : t
      )
    );
  };

  const addChangeRequest = (newCR) => {
    const id = `CR-${101 + changeRequests.length}`;
    setChangeRequests((prev) => [{ ...newCR, id, date: new Date().toLocaleDateString() }, ...prev]);
  };

  return (
    <BAContext.Provider
      value={{
        projectsList,
        activeProject,
        setActiveProject,
        processSteps,
        requirements,
        addRequirement,
        stakeholders,
        tasks,
        addTask,
        updateTaskStatus,
        userStories,
        businessRules,
        changeRequests,
        addChangeRequest,
      }}
    >
      {children}
    </BAContext.Provider>
  );
};

export const useBA = () => {
  const context = useContext(BAContext);
  if (!context) {
    throw new Error('useBA must be used within a BAProvider');
  }
  return context;
};
