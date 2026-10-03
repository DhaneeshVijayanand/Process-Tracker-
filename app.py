import streamlit as st
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
from datetime import datetime

# ---------------------------------------------------------
# Page Configuration
# ---------------------------------------------------------
st.set_page_config(
    page_title="BA Process Tracker — Enterprise Delivery Cockpit",
    page_icon="🎯",
    layout="wide",
    initial_sidebar_state="expanded"
)

# ---------------------------------------------------------
# Custom Styling: Modern Deep Emerald & Bright Lime SaaS Theme
# ---------------------------------------------------------
st.markdown("""
<style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Space+Grotesk:wght@500;700&display=swap');
    
    html, body, [class*="css"] {
        font-family: 'Plus Jakarta Sans', sans-serif;
    }
    
    .main {
        background-color: #F7F8F2;
    }
    
    /* Brand Header Box */
    .brand-container {
        display: flex;
        align-items: center;
        gap: 12px;
        background: #064E45;
        padding: 16px;
        border-radius: 16px;
        margin-bottom: 20px;
        border: 1px solid #087F6A;
    }
    
    .brand-title {
        color: #FFFFFF;
        font-size: 18px;
        font-weight: 800;
        line-height: 1.1;
        letter-spacing: -0.5px;
    }
    
    .brand-accent {
        color: #DFFF72;
    }
    
    .brand-sub {
        color: #DFFF72;
        font-size: 10px;
        font-family: monospace;
        letter-spacing: 1px;
        text-transform: uppercase;
    }
    
    /* Stat KPI Card */
    .stat-card {
        background: #FFFFFF;
        padding: 18px 22px;
        border-radius: 20px;
        border: 1px solid #E3E8DE;
        box-shadow: 0 4px 16px rgba(16, 32, 29, 0.04);
        transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    .stat-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 24px rgba(6, 78, 69, 0.08);
    }
    .stat-label {
        font-size: 11px;
        font-weight: 700;
        color: #5A6E69;
        text-transform: uppercase;
        letter-spacing: 0.8px;
        font-family: monospace;
    }
    .stat-val {
        font-size: 28px;
        font-weight: 800;
        color: #10201D;
        margin-top: 4px;
        letter-spacing: -1px;
    }
    .stat-badge {
        display: inline-block;
        padding: 2px 8px;
        border-radius: 10px;
        font-size: 10px;
        font-weight: 700;
        margin-top: 6px;
    }
    .stat-badge-lime {
        background: #E8FF9A;
        color: #064E45;
    }
    
    /* Step Milestone Pill */
    .step-pill {
        padding: 10px 14px;
        border-radius: 14px;
        margin-bottom: 8px;
        border: 1px solid #E3E8DE;
        background: white;
    }
    .step-pill-active {
        background: #064E45;
        color: white;
        border-color: #064E45;
    }
    
    /* Sidebar Styling */
    [data-testid="stSidebar"] {
        background-color: #064E45 !important;
    }
    [data-testid="stSidebar"] * {
        color: #E1ECE9 !important;
    }
    [data-testid="stSidebar"] h1, [data-testid="stSidebar"] h2, [data-testid="stSidebar"] h3 {
        color: #FFFFFF !important;
    }
    [data-testid="stSidebar"] hr {
        border-color: #087F6A !important;
    }
</style>
""", unsafe_allow_html=True)

# ---------------------------------------------------------
# Default Mock Data Initialization
# ---------------------------------------------------------
if "projects" not in st.session_state:
    st.session_state.projects = [
        {"id": "PRJ-01", "name": "Global Enterprise CRM Modernization", "progress": 68, "status": "On Track", "lead": "Elena Rostova (Lead BA)", "client": "Apex Global Retail", "due": "Nov 20, 2026"},
        {"id": "PRJ-02", "name": "FinTech Automated KYC Verification", "progress": 84, "status": "Ready for Gate 8", "lead": "Marcus Vance (Senior BA)", "client": "Sterling Bank PLC", "due": "Dec 05, 2026"},
        {"id": "PRJ-03", "name": "Supply Chain EDI 850 Order Gateway", "progress": 42, "status": "Discovery", "lead": "Sarah Chen (Technical BA)", "client": "Maersk Logistics", "due": "Jan 15, 2027"},
    ]

if "requirements" not in st.session_state:
    st.session_state.requirements = [
        {"id": "REQ-101", "title": "OAuth 2.0 / SAML 2.0 Single Sign-On", "category": "Security", "priority": "Critical", "moscow": "Must Have", "status": "Approved", "complexity": "Medium", "business_value": "High", "owner": "Security Team"},
        {"id": "REQ-102", "title": "Bulk CSV Lead Import Pipeline", "category": "Functional", "priority": "High", "moscow": "Must Have", "status": "Implemented", "complexity": "High", "business_value": "Critical", "owner": "Data Team"},
        {"id": "REQ-103", "title": "Role-Based Access Control (RBAC) Engine", "category": "Security", "priority": "High", "moscow": "Must Have", "status": "Implemented", "complexity": "Medium", "business_value": "High", "owner": "Core Platform"},
        {"id": "REQ-104", "title": "Automated SLA Alert Webhooks", "category": "Integration", "priority": "Medium", "moscow": "Should Have", "status": "In Review", "complexity": "Medium", "business_value": "Medium", "owner": "DevOps"},
        {"id": "REQ-105", "title": "Interactive Executive Pipeline Dashboard", "category": "UI/UX", "priority": "Medium", "moscow": "Could Have", "status": "Draft", "complexity": "Low", "business_value": "Medium", "owner": "Frontend"},
        {"id": "REQ-106", "title": "GDPR One-Click Data Subject Erasure", "category": "Compliance", "priority": "Critical", "moscow": "Must Have", "status": "Approved", "complexity": "High", "business_value": "Critical", "owner": "Legal & Core"},
    ]

if "stakeholders" not in st.session_state:
    st.session_state.stakeholders = [
        {"name": "Arthur Pendelton", "role": "Chief Technology Officer (Sponsor)", "power": 9, "interest": 8, "strategy": "Manage Closely", "quadrant": "High Power / High Interest"},
        {"name": "Elena Rostova", "role": "Lead Business Analyst", "power": 7, "interest": 9, "strategy": "Manage Closely", "quadrant": "High Power / High Interest"},
        {"name": "David Sterling", "role": "VP Operations (Client)", "power": 8, "interest": 6, "strategy": "Keep Satisfied", "quadrant": "High Power / Low Interest"},
        {"name": "Sofia Reyes", "role": "Head of Product Design", "power": 5, "interest": 9, "strategy": "Keep Informed", "quadrant": "Low Power / High Interest"},
        {"name": "Vikram Patel", "role": "QA & Release Lead", "power": 4, "interest": 7, "strategy": "Keep Informed", "quadrant": "Low Power / High Interest"},
        {"name": "Legal & Audit Board", "role": "External Compliance Counsel", "power": 7, "interest": 3, "strategy": "Keep Satisfied", "quadrant": "High Power / Low Interest"},
    ]

if "change_requests" not in st.session_state:
    st.session_state.change_requests = [
        {"id": "CR-001", "title": "Add WhatsApp Business API Integration", "status": "Approved", "impact_days": "+4 days", "cost": "$3,200", "urgency": "High", "justification": "Requested by regional sales team in LATAM"},
        {"id": "CR-002", "title": "Multi-Currency Dynamic Conversion", "status": "Under Review", "impact_days": "+6 days", "cost": "$4,800", "urgency": "Medium", "justification": "Supports European subsidiary kickoff"},
        {"id": "CR-003", "title": "Custom Watermark on PDF Invoices", "status": "Draft", "impact_days": "+1 day", "cost": "$800", "urgency": "Low", "justification": "Brand team compliance request"},
    ]

# ---------------------------------------------------------
# Sidebar Branding & Project Controls
# ---------------------------------------------------------
with st.sidebar:
    st.markdown("""
    <div class="brand-container">
        <svg width="34" height="34" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="32" height="32" rx="8" fill="#DFFF72"/>
            <path d="M6 24L13 17L18 21L26 9" stroke="#064E45" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/>
            <circle cx="6" cy="24" r="2.4" fill="#043F38"/>
            <circle cx="13" cy="17" r="2.4" fill="#043F38"/>
            <circle cx="18" cy="21" r="2.4" fill="#043F38"/>
            <circle cx="26" cy="9" r="3.4" fill="#FFFFFF" stroke="#064E45" stroke-width="1.8"/>
            <circle cx="26" cy="9" r="1.2" fill="#064E45"/>
        </svg>
        <div>
            <div class="brand-title">BA Process <span class="brand-accent">Tracker</span></div>
            <div class="brand-sub">Enterprise Cockpit</div>
        </div>
    </div>
    """, unsafe_allow_html=True)
    
    st.markdown("### 📁 Active Project")
    project_names = [p["name"] for p in st.session_state.projects]
    selected_proj_name = st.selectbox("Select Project", project_names, index=0)
    selected_project = next(p for p in st.session_state.projects if p["name"] == selected_proj_name)
    
    st.markdown(f"""
    **Project ID:** `{selected_project['id']}`  
    **Client:** {selected_project['client']}  
    **Lead BA:** {selected_project['lead']}  
    **Target Gate:** {selected_project['due']}  
    """)
    
    st.markdown("---")
    st.markdown("### ⚡ Live Status")
    st.progress(selected_project["progress"] / 100)
    st.caption(f"Overall Completion: **{selected_project['progress']}%** ({selected_project['status']})")
    
    st.markdown("---")
    st.caption("🔒 Encrypted Cockpit Session • v2.4 SaaS")

# ---------------------------------------------------------
# Top Header & Greeting
# ---------------------------------------------------------
col_head1, col_head2 = st.columns([3, 1])
with col_head1:
    st.markdown("<h1 style='margin-bottom: 2px; color: #10201D; font-weight: 800; font-size: 32px;'>Good morning, Elena</h1>", unsafe_allow_html=True)
    st.markdown("<p style='color: #5A6E69; font-size: 14px;'>Here is your Business Analyst trajectory, gate deliverables, and requirement metrics for today.</p>", unsafe_allow_html=True)

with col_head2:
    st.markdown("<div style='text-align: right; padding-top: 8px;'><span style='background: #DFFF72; color: #064E45; padding: 6px 14px; border-radius: 20px; font-weight: 800; font-size: 12px; font-family: monospace;'>● GATE 6 IN PROGRESS</span></div>", unsafe_allow_html=True)

st.markdown("<br>", unsafe_allow_html=True)

# ---------------------------------------------------------
# 4 KPI Stat Cards
# ---------------------------------------------------------
c1, c2, c3, c4 = st.columns(4)
with c1:
    st.markdown("""
    <div class="stat-card">
        <div class="stat-label">Project Health</div>
        <div class="stat-val" style="color: #064E45;">98.4%</div>
        <span class="stat-badge stat-badge-lime">On Schedule</span>
    </div>
    """, unsafe_allow_html=True)

with c2:
    total_reqs = len(st.session_state.requirements)
    approved_reqs = sum(1 for r in st.session_state.requirements if r['status'] in ['Approved', 'Implemented'])
    st.markdown(f"""
    <div class="stat-card">
        <div class="stat-label">Reqs Signed Off</div>
        <div class="stat-val">{approved_reqs} <span style="font-size: 16px; color: #8C9E9A;">/ {total_reqs}</span></div>
        <span class="stat-badge stat-badge-lime">{int((approved_reqs/total_reqs)*100)}% Baselined</span>
    </div>
    """, unsafe_allow_html=True)

with c3:
    st.markdown("""
    <div class="stat-card">
        <div class="stat-label">Active Stakeholders</div>
        <div class="stat-val">12</div>
        <span class="stat-badge stat-badge-lime">100% Engaged</span>
    </div>
    """, unsafe_allow_html=True)

with c4:
    st.markdown("""
    <div class="stat-card">
        <div class="stat-label">Open Change Reqs</div>
        <div class="stat-val" style="color: #D97706;">2</div>
        <span class="stat-badge" style="background: #FEF3C7; color: #92400E;">Gate Review Needed</span>
    </div>
    """, unsafe_allow_html=True)

st.markdown("<br>", unsafe_allow_html=True)

# ---------------------------------------------------------
# Navigation Tabs
# ---------------------------------------------------------
tabs = st.tabs([
    "📊 10-Step BA Lifecycle", 
    "📋 Requirements Matrix", 
    "👥 Stakeholder 2x2", 
    "📌 Kanban & Stories", 
    "⚡ Change Requests", 
    "📈 Analytics & Charts"
])

# =========================================================
# TAB 1: 10-Step BA Lifecycle Tracker
# =========================================================
with tabs[0]:
    st.markdown("### 🏆 10-Step Business Analyst Delivery Lifecycle")
    st.caption("Standardized BABOK / Agile delivery framework mapping inception to client post-implementation signoff.")
    
    steps = [
        {"num": 1, "name": "Initiation & Vision", "status": "Completed", "deliverable": "Project Charter & Problem Statement", "completion": 100},
        {"num": 2, "name": "Stakeholder Discovery", "status": "Completed", "deliverable": "Stakeholder Engagement Matrix", "completion": 100},
        {"num": 3, "name": "As-Is Process Mapping", "status": "Completed", "deliverable": "BPMN 2.0 Current State Swimlane", "completion": 100},
        {"num": 4, "name": "Elicitation Workshops", "status": "Completed", "deliverable": "Interview Transcripts & JAD Notes", "completion": 100},
        {"num": 5, "name": "Requirements Baselining", "status": "Completed", "deliverable": "BRD / FSD Formal Signoff", "completion": 100},
        {"num": 6, "name": "To-Be Future Architecture", "status": "Active (In Progress)", "deliverable": "Target State Workflow Diagrams", "completion": 75},
        {"num": 7, "name": "Backlog & Story Slicing", "status": "Ready", "deliverable": "Jira Epics, Stories & Gherkin Scenarios", "completion": 40},
        {"num": 8, "name": "UAT & Acceptance Prep", "status": "Pending", "deliverable": "Test Scripts & Traceability Matrix", "completion": 10},
        {"num": 9, "name": "Deployment & Training", "status": "Pending", "deliverable": "Runbook, End-User Guides, Training Videos", "completion": 0},
        {"num": 10, "name": "Post-Go-Live Signoff", "status": "Pending", "deliverable": "Benefit Realization & PIR Report", "completion": 0},
    ]
    
    # Milestone pills horizontal view
    pill_cols = st.columns(5)
    for i in range(5):
        s = steps[i]
        with pill_cols[i]:
            st.markdown(f"""
            <div style="background: {'#064E45' if s['completion']==100 else '#E8FF9A'}; color: {'white' if s['completion']==100 else '#064E45'}; padding: 12px; border-radius: 14px; text-align: center; border: 1px solid #E3E8DE;">
                <div style="font-weight: 800; font-size: 13px;">Step {s['num']}: {s['name']}</div>
                <div style="font-size: 11px; margin-top: 4px; font-weight: 600;">{s['completion']}% Done</div>
            </div>
            """, unsafe_allow_html=True)
            
    pill_cols2 = st.columns(5)
    for i in range(5, 10):
        s = steps[i]
        with pill_cols2[i-5]:
            bg = "#DFFF72" if "Active" in s['status'] else "#FFFFFF"
            color = "#064E45" if "Active" in s['status'] else "#5A6E69"
            st.markdown(f"""
            <div style="background: {bg}; color: {color}; padding: 12px; border-radius: 14px; text-align: center; border: 1px solid #E3E8DE; margin-top: 8px;">
                <div style="font-weight: 800; font-size: 13px;">Step {s['num']}: {s['name']}</div>
                <div style="font-size: 11px; margin-top: 4px; font-weight: 600;">{s['status']}</div>
            </div>
            """, unsafe_allow_html=True)
            
    st.markdown("<br>", unsafe_allow_html=True)
    st.markdown("#### 🔍 Step Details & Gate Criteria")
    df_steps = pd.DataFrame(steps)
    st.dataframe(df_steps, use_container_width=True, hide_index=True)

# =========================================================
# TAB 2: Requirements Matrix & Add Requirement Form
# =========================================================
with tabs[1]:
    st.markdown("### 📋 Requirements Traceability Matrix (RTM)")
    
    # Filter Row
    f_col1, f_col2, f_col3 = st.columns(3)
    with f_col1:
        cat_filter = st.multiselect("Filter by Category", options=list(set(r["category"] for r in st.session_state.requirements)))
    with f_col2:
        moscow_filter = st.multiselect("Filter by MoSCoW", options=["Must Have", "Should Have", "Could Have", "Won't Have"])
    with f_col3:
        status_filter = st.multiselect("Filter by Status", options=["Draft", "In Review", "Approved", "Implemented"])
        
    filtered_reqs = st.session_state.requirements
    if cat_filter:
        filtered_reqs = [r for r in filtered_reqs if r["category"] in cat_filter]
    if moscow_filter:
        filtered_reqs = [r for r in filtered_reqs if r["moscow"] in moscow_filter]
    if status_filter:
        filtered_reqs = [r for r in filtered_reqs if r["status"] in status_filter]
        
    df_reqs = pd.DataFrame(filtered_reqs)
    st.dataframe(df_reqs, use_container_width=True, hide_index=True)
    
    # Download button
    csv_data = df_reqs.to_csv(index=False).encode('utf-8')
    st.download_button(
        label="📥 Export Requirements (CSV)",
        data=csv_data,
        file_name="BA_Process_Requirements.csv",
        mime="text/csv",
    )
    
    st.markdown("---")
    with st.expander("➕ Add New Requirement"):
        with st.form("new_req_form"):
            c_a, c_b = st.columns(2)
            with c_a:
                new_title = st.text_input("Requirement Title / Specification")
                new_category = st.selectbox("Category", ["Functional", "Non-Functional", "Security", "Integration", "Compliance", "UI/UX"])
                new_priority = st.selectbox("Priority", ["Critical", "High", "Medium", "Low"])
            with c_b:
                new_moscow = st.selectbox("MoSCoW Priority", ["Must Have", "Should Have", "Could Have", "Won't Have"])
                new_complexity = st.selectbox("Complexity Estimate", ["Low", "Medium", "High"])
                new_owner = st.text_input("Assignee / Lead Owner", value="Elena Rostova")
            
            submit_btn = st.form_submit_button("Create Requirement")
            if submit_btn and new_title.strip():
                new_id = f"REQ-{len(st.session_state.requirements) + 101}"
                st.session_state.requirements.append({
                    "id": new_id,
                    "title": new_title.strip(),
                    "category": new_category,
                    "priority": new_priority,
                    "moscow": new_moscow,
                    "status": "Draft",
                    "complexity": new_complexity,
                    "business_value": "High",
                    "owner": new_owner
                })
                st.success(f"Requirement `{new_id}` added successfully!")
                st.rerun()

# =========================================================
# TAB 3: Stakeholder 2x2 Power / Interest Matrix
# =========================================================
with tabs[2]:
    st.markdown("### 👥 Stakeholder Influence vs. Interest Matrix")
    st.caption("Strategic alignment quadrants for stakeholder engagement and escalation pathways.")
    
    df_stk = pd.DataFrame(st.session_state.stakeholders)
    
    # Plotly 2x2 Matrix Chart
    fig_matrix = px.scatter(
        df_stk,
        x="interest",
        y="power",
        text="name",
        color="strategy",
        color_discrete_map={
            "Manage Closely": "#064E45",
            "Keep Satisfied": "#087F6A",
            "Keep Informed": "#D97706",
            "Monitor": "#6B7280"
        },
        size=[24]*len(df_stk),
        labels={"interest": "Level of Interest (1-10)", "power": "Level of Power / Authority (1-10)"},
        title="Stakeholder Grid (2x2 BABOK Model)"
    )
    
    # Add quadrant dividing lines
    fig_matrix.add_hline(y=5, line_dash="dash", line_color="#CBD5E1")
    fig_matrix.add_vline(x=5, line_dash="dash", line_color="#CBD5E1")
    
    fig_matrix.add_annotation(x=8, y=8.5, text="<b>MANAGE CLOSELY</b>", showarrow=False, font=dict(color="#064E45", size=11))
    fig_matrix.add_annotation(x=2.5, y=8.5, text="<b>KEEP SATISFIED</b>", showarrow=False, font=dict(color="#087F6A", size=11))
    fig_matrix.add_annotation(x=8, y=2.5, text="<b>KEEP INFORMED</b>", showarrow=False, font=dict(color="#D97706", size=11))
    fig_matrix.add_annotation(x=2.5, y=2.5, text="<b>MONITOR</b>", showarrow=False, font=dict(color="#6B7280", size=11))
    
    fig_matrix.update_layout(
        plot_bgcolor="#FFFFFF",
        paper_bgcolor="#FFFFFF",
        xaxis=dict(range=[0, 10.5], gridcolor="#F1F5F9"),
        yaxis=dict(range=[0, 10.5], gridcolor="#F1F5F9"),
        font=dict(family="Plus Jakarta Sans"),
        height=480
    )
    
    st.plotly_chart(fig_matrix, use_container_width=True)
    
    st.markdown("#### 📋 Stakeholder Roster & Communication Protocol")
    st.dataframe(df_stk[["name", "role", "strategy", "quadrant"]], use_container_width=True, hide_index=True)

# =========================================================
# TAB 4: Kanban Tasks & User Stories
# =========================================================
with tabs[3]:
    st.markdown("### 📌 Kanban Task Board & User Stories")
    
    k1, k2, k3, k4 = st.columns(4)
    with k1:
        st.markdown("<div style='background: #EFF2E9; padding: 12px; border-radius: 12px; font-weight: 800; font-size: 13px; color: #10201D;'>📋 TO DO (2)</div>", unsafe_allow_html=True)
        st.markdown("""
        <div style='background: white; border: 1px solid #E3E8DE; border-radius: 12px; padding: 12px; margin-top: 10px;'>
            <span style='background: #EFF2E9; color: #064E45; font-size: 10px; font-weight: 800; padding: 2px 6px; border-radius: 6px;'>REQ-105</span>
            <div style='font-weight: 700; font-size: 12px; margin-top: 6px;'>Executive Pipeline Dashboard Wireframes</div>
            <div style='font-size: 11px; color: #5A6E69; margin-top: 4px;'>Assignee: UI/UX Team</div>
        </div>
        """, unsafe_allow_html=True)
        
    with k2:
        st.markdown("<div style='background: #DFFF72; padding: 12px; border-radius: 12px; font-weight: 800; font-size: 13px; color: #064E45;'>⚡ IN PROGRESS (2)</div>", unsafe_allow_html=True)
        st.markdown("""
        <div style='background: white; border: 1px solid #E3E8DE; border-radius: 12px; padding: 12px; margin-top: 10px;'>
            <span style='background: #E8FF9A; color: #064E45; font-size: 10px; font-weight: 800; padding: 2px 6px; border-radius: 6px;'>REQ-104</span>
            <div style='font-weight: 700; font-size: 12px; margin-top: 6px;'>Configure SLA Alert Webhooks & Payload</div>
            <div style='font-size: 11px; color: #5A6E69; margin-top: 4px;'>Assignee: DevOps</div>
        </div>
        """, unsafe_allow_html=True)
        
    with k3:
        st.markdown("<div style='background: #EFF2E9; padding: 12px; border-radius: 12px; font-weight: 800; font-size: 13px; color: #10201D;'>👀 IN REVIEW (1)</div>", unsafe_allow_html=True)
        st.markdown("""
        <div style='background: white; border: 1px solid #E3E8DE; border-radius: 12px; padding: 12px; margin-top: 10px;'>
            <span style='background: #EFF2E9; color: #064E45; font-size: 10px; font-weight: 800; padding: 2px 6px; border-radius: 6px;'>REQ-101</span>
            <div style='font-weight: 700; font-size: 12px; margin-top: 6px;'>SAML / SSO Handshake Verification</div>
            <div style='font-size: 11px; color: #5A6E69; margin-top: 4px;'>Assignee: Security Lead</div>
        </div>
        """, unsafe_allow_html=True)
        
    with k4:
        st.markdown("<div style='background: #064E45; padding: 12px; border-radius: 12px; font-weight: 800; font-size: 13px; color: #DFFF72;'>✅ COMPLETED (3)</div>", unsafe_allow_html=True)
        st.markdown("""
        <div style='background: white; border: 1px solid #E3E8DE; border-radius: 12px; padding: 12px; margin-top: 10px;'>
            <span style='background: #DFFF72; color: #064E45; font-size: 10px; font-weight: 800; padding: 2px 6px; border-radius: 6px;'>REQ-102</span>
            <div style='font-weight: 700; font-size: 12px; margin-top: 6px;'>CSV Bulk Importer Implementation</div>
            <div style='font-size: 11px; color: #5A6E69; margin-top: 4px;'>Status: Baselined & Merged</div>
        </div>
        """, unsafe_allow_html=True)

# =========================================================
# TAB 5: Scope Change Requests
# =========================================================
with tabs[4]:
    st.markdown("### ⚡ Formal Scope Change Requests (CR)")
    st.caption("Change control governance gate protecting project delivery timeline and resource budget.")
    
    df_cr = pd.DataFrame(st.session_state.change_requests)
    st.dataframe(df_cr, use_container_width=True, hide_index=True)
    
    st.markdown("---")
    st.markdown("#### 📝 Submit Scope Change Request")
    with st.form("cr_form"):
        cr_title = st.text_input("Change Request Title")
        c_x, c_y, c_z = st.columns(3)
        with c_x:
            cr_days = st.text_input("Timeline Impact (e.g., +3 days)", value="+3 days")
        with c_y:
            cr_cost = st.text_input("Budget Estimate (e.g., $2,400)", value="$2,400")
        with c_z:
            cr_urgency = st.selectbox("Urgency", ["High", "Medium", "Low"])
        cr_just = st.text_area("Business Justification & Impact Analysis")
        
        cr_submit = st.form_submit_button("Submit Change Request")
        if cr_submit and cr_title.strip():
            new_cr_id = f"CR-00{len(st.session_state.change_requests) + 1}"
            st.session_state.change_requests.append({
                "id": new_cr_id,
                "title": cr_title.strip(),
                "status": "Under Review",
                "impact_days": cr_days,
                "cost": cr_cost,
                "urgency": cr_urgency,
                "justification": cr_just
            })
            st.success(f"Change Request `{new_cr_id}` submitted for Governance review!")
            st.rerun()

# =========================================================
# TAB 6: Analytics & Delivery Trajectory
# =========================================================
with tabs[5]:
    st.markdown("### 📈 Real-Time BA Delivery Analytics")
    
    col_chart1, col_chart2 = st.columns(2)
    with col_chart1:
        # MoSCoW Breakdown Donut
        moscow_counts = pd.DataFrame(st.session_state.requirements)["moscow"].value_counts().reset_index()
        moscow_counts.columns = ["MoSCoW", "Count"]
        
        fig_donut = px.pie(
            moscow_counts,
            names="MoSCoW",
            values="Count",
            hole=0.55,
            color="MoSCoW",
            color_discrete_map={
                "Must Have": "#064E45",
                "Should Have": "#087F6A",
                "Could Have": "#DFFF72",
                "Won't Have": "#CBD5E1"
            },
            title="MoSCoW Priority Distribution"
        )
        fig_donut.update_layout(paper_bgcolor="#FFFFFF", plot_bgcolor="#FFFFFF", font=dict(family="Plus Jakarta Sans"))
        st.plotly_chart(fig_donut, use_container_width=True)
        
    with col_chart2:
        # Requirements Status Bar Chart
        status_counts = pd.DataFrame(st.session_state.requirements)["status"].value_counts().reset_index()
        status_counts.columns = ["Status", "Count"]
        
        fig_bar = px.bar(
            status_counts,
            x="Status",
            y="Count",
            color="Status",
            color_discrete_sequence=["#064E45", "#DFFF72", "#087F6A", "#CBD5E1"],
            title="Requirements by Approval Status"
        )
        fig_bar.update_layout(paper_bgcolor="#FFFFFF", plot_bgcolor="#FFFFFF", font=dict(family="Plus Jakarta Sans"))
        st.plotly_chart(fig_bar, use_container_width=True)

# ---------------------------------------------------------
# Footer
# ---------------------------------------------------------
st.markdown("---")
st.markdown("""
<div style="text-align: center; color: #5A6E69; font-size: 12px; font-family: monospace;">
    BA PROCESS TRACKER • ENTERPRISE DELIVERY COCKPIT • READY FOR STREAMLIT COMMUNITY CLOUD
</div>
""", unsafe_allow_html=True)
