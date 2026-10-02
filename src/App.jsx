import { useMemo, useState } from 'react'
import {
  ArrowDownToLine,
  ArrowUpRight,
  Bell,
  BookOpen,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  GraduationCap,
  LayoutDashboard,
  Menu,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  Users,
  X,
} from 'lucide-react'
import './App.css'

const initialStudents = [
  { name: 'Amara Johnson', initials: 'AJ', grade: 'Grade 8', email: 'amara.j@email.com', attendance: 98, status: 'Present', color: 'lilac' },
  { name: 'Noah Williams', initials: 'NW', grade: 'Grade 6', email: 'noah.w@email.com', attendance: 94, status: 'Present', color: 'mint' },
  { name: 'Sofia Chen', initials: 'SC', grade: 'Grade 9', email: 'sofia.c@email.com', attendance: 89, status: 'Late', color: 'peach' },
  { name: 'Ethan Patel', initials: 'EP', grade: 'Grade 7', email: 'ethan.p@email.com', attendance: 96, status: 'Present', color: 'blue' },
  { name: 'Mia Thompson', initials: 'MT', grade: 'Grade 5', email: 'mia.t@email.com', attendance: 82, status: 'Absent', color: 'yellow' },
]

const navigation = [
  { label: 'Overview', icon: LayoutDashboard },
  { label: 'Students', icon: Users },
  { label: 'Attendance', icon: CalendarDays },
  { label: 'Classes', icon: BookOpen },
  { label: 'Teachers', icon: GraduationCap },
]

const classes = [
  { name: 'Mathematics', grade: 'Grade 8 · Room 204', teacher: 'Mr. James Wilson', students: 28, color: 'green' },
  { name: 'English Literature', grade: 'Grade 7 · Room 106', teacher: 'Ms. Priya Shah', students: 24, color: 'coral' },
  { name: 'General Science', grade: 'Grade 9 · Lab 02', teacher: 'Dr. Emma Clarke', students: 26, color: 'blue' },
  { name: 'World History', grade: 'Grade 6 · Room 112', teacher: 'Mr. Daniel Kim', students: 22, color: 'gold' },
]

const teachers = [
  { name: 'James Wilson', subject: 'Mathematics', email: 'j.wilson@northfield.edu', initials: 'JW' },
  { name: 'Priya Shah', subject: 'English Literature', email: 'p.shah@northfield.edu', initials: 'PS' },
  { name: 'Emma Clarke', subject: 'General Science', email: 'e.clarke@northfield.edu', initials: 'EC' },
  { name: 'Daniel Kim', subject: 'World History', email: 'd.kim@northfield.edu', initials: 'DK' },
]

const pageCopy = {
  Overview: ['Good morning, Olivia', "Here's what's happening at Northfield today."],
  Students: ['Students', 'Your school community, all in one place.'],
  Attendance: ['Attendance', 'A look at attendance across the school.'],
  Classes: ['Classes', 'Keep track of courses and class groups.'],
  Teachers: ['Teachers', 'Meet the people who make learning happen.'],
  Settings: ['Settings', 'Manage your school workspace preferences.'],
}

function AttendanceChart() {
  const bars = [64, 75, 69, 84, 78, 91, 72, 85, 76, 96, 82, 89, 78, 93, 84, 98, 74, 88, 81, 95, 86, 92, 79, 89, 97, 83, 94, 86]

  return (
    <div className="chart-wrap" aria-label="Attendance rate over the last 28 days">
      <div className="chart-guides" aria-hidden="true"><span>100%</span><span>75%</span><span>50%</span><span>25%</span></div>
      <div className="bar-chart" role="img" aria-label="Attendance has remained between 74 and 98 percent over the last 28 days">
        {bars.map((height, index) => <span className={`chart-bar ${index === 24 ? 'is-highlighted' : ''}`} style={{ height: `${height}%` }} key={`${height}-${index}`} />)}
      </div>
      <div className="chart-labels"><span>Sep 5</span><span>Sep 12</span><span>Sep 19</span><span>Oct 2</span></div>
    </div>
  )
}

function StudentTable({ students, onStudentClick }) {
  return (
    <div className="table-scroll">
      <table>
        <thead><tr><th>Student</th><th>Grade</th><th>Attendance</th><th>Status</th><th aria-label="Details" /></tr></thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.email}>
              <td><div className="person-cell"><span className={`avatar ${student.color}`}>{student.initials}</span><span><strong>{student.name}</strong><small>{student.email}</small></span></div></td>
              <td>{student.grade}</td>
              <td><span className="attendance-value">{student.attendance}%</span><span className="attendance-track"><i style={{ width: `${student.attendance}%` }} /></span></td>
              <td><span className={`status status-${student.status.toLowerCase()}`}><i />{student.status}</span></td>
              <td><button className="icon-button row-action" aria-label={`View ${student.name}`} onClick={() => onStudentClick(student)}><ChevronRight size={17} /></button></td>
            </tr>
          ))}
          {students.length === 0 && <tr><td className="empty-state" colSpan="5">No students match your search.</td></tr>}
        </tbody>
      </table>
    </div>
  )
}

function App() {
  const [activePage, setActivePage] = useState('Overview')
  const [students, setStudents] = useState(initialStudents)
  const [search, setSearch] = useState('')
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [toast, setToast] = useState('')
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [settings, setSettings] = useState({ attendance: true, email: false, weekly: true })
  const [form, setForm] = useState({ name: '', grade: 'Grade 5', email: '' })
  const filteredStudents = useMemo(() => students.filter((student) => `${student.name} ${student.grade} ${student.email}`.toLowerCase().includes(search.toLowerCase())), [students, search])
  const [heading, subtitle] = pageCopy[activePage]

  function showToast(message) {
    setToast(message)
    window.setTimeout(() => setToast(''), 2800)
  }

  function addStudent(event) {
    event.preventDefault()
    const name = form.name.trim()
    const email = form.email.trim()
    if (!name || !email) return
    const initials = name.split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase()
    setStudents((current) => [{ name, initials, grade: form.grade, email, attendance: 100, status: 'Present', color: 'mint' }, ...current])
    setForm({ name: '', grade: 'Grade 5', email: '' })
    setIsAddOpen(false)
    showToast(`${name} added to your students.`)
  }

  function exportStudents() {
    const csv = ['Name,Grade,Email,Attendance,Status', ...students.map(({ name, grade, email, attendance, status }) => [name, grade, email, `${attendance}%`, status].map((value) => `"${value.replaceAll('"', '""')}"`).join(','))].join('\n')
    const link = document.createElement('a')
    link.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }))
    link.download = 'northfield-students.csv'
    link.click()
    URL.revokeObjectURL(link.href)
    showToast('Student report downloaded.')
  }

  function changePage(page) {
    setActivePage(page)
    setSearch('')
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="#overview" onClick={(event) => { event.preventDefault(); changePage('Overview') }}>
          <span className="brand-mark"><GraduationCap size={22} strokeWidth={2.2} /></span>
          <span className="brand-name">northfield<span>ACADEMY</span></span>
        </a>
        <div className="school-switcher"><span className="school-initial">N</span><span><strong>Northfield Academy</strong><small>School workspace</small></span><ChevronDown size={15} /></div>
        <p className="nav-label">SCHOOL</p>
        <nav className="main-nav" aria-label="Main navigation">
          {navigation.map(({ label, icon: Icon }) => <button className={`nav-item ${activePage === label ? 'active' : ''}`} onClick={() => changePage(label)} key={label}><Icon size={18} strokeWidth={1.9} /><span>{label}</span>{label === 'Attendance' && <span className="nav-count">12</span>}</button>)}
        </nav>
        <div className="sidebar-bottom">
          <div className="term-card"><span className="term-icon"><CalendarDays size={17} /></span><span><small>CURRENT TERM</small><strong>Fall semester</strong><em>Sep 3 – Dec 20, 2025</em></span></div>
          <button className={`nav-item ${activePage === 'Settings' ? 'active' : ''}`} onClick={() => changePage('Settings')}><Settings size={18} /><span>Settings</span></button>
          <button className="nav-item" onClick={() => showToast('Help center is ready for your team.')}><CircleHelp size={18} /><span>Help center</span></button>
          <div className="profile"><span className="avatar profile-avatar">OR</span><span><strong>Olivia Rhye</strong><small>School administrator</small></span><button className="icon-button profile-menu" aria-label="Profile options" onClick={() => showToast('Signed in as Olivia Rhye.')}><ChevronDown size={17} /></button></div>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div className="breadcrumbs"><span>School</span><ChevronRight size={14} /><strong>{activePage}</strong></div>
          <div className="top-actions">
            <label className="global-search"><Search size={17} /><input value={search} onChange={(event) => { setSearch(event.target.value); if (event.target.value) setActivePage('Students') }} placeholder="Search students..." aria-label="Search students" /><kbd>⌘ K</kbd></label>
            <div className="notification-wrap"><button className="icon-button notification-button" aria-label="Notifications" onClick={() => setNotificationsOpen((open) => !open)}><Bell size={19} /><i /></button>{notificationsOpen && <div className="notification-popover"><strong>Notifications</strong><p><span className="notice-dot" />3 students have attendance below 85%.</p><p><span className="notice-dot coral-dot" />Parent-teacher evening is next Thursday.</p><button onClick={() => { setNotificationsOpen(false); changePage('Attendance') }}>View attendance <ArrowUpRight size={14} /></button></div>}</div>
            <span className="top-divider" /><span className="avatar profile-avatar top-avatar">OR</span>
          </div>
        </header>

        <div className="page-content">
          <section className="page-heading">
            <div><p className="eyebrow"><span className="live-dot" /> TUESDAY, OCTOBER 2, 2025</p><h1>{heading}<span className="heading-period">{activePage === 'Overview' ? '.' : ''}</span></h1><p className="page-subtitle">{subtitle}</p></div>
            <div className="heading-actions"><button className="button button-secondary" onClick={exportStudents}><ArrowDownToLine size={16} /> <span>Export report</span></button><button className="button button-primary" onClick={() => setIsAddOpen(true)}><Plus size={17} /> <span>Add student</span></button></div>
          </section>

          {(activePage === 'Overview' || activePage === 'Attendance') && <section className="metrics-grid" aria-label="School statistics">
            <article className="metric-card"><div className="metric-top"><span>Total students</span><span className="metric-icon metric-green"><Users size={17} /></span></div><div className="metric-number">1,284</div><div className="metric-foot"><span className="metric-change"><ArrowUpRight size={13} /> 4.8%</span><span>vs. last semester</span></div></article>
            <article className="metric-card"><div className="metric-top"><span>Present today</span><span className="metric-icon metric-peach"><Check size={17} /></span></div><div className="metric-number">1,196<span className="metric-unit"> / 1,284</span></div><div className="metric-foot"><span className="metric-change">93.1%</span><span>attendance rate</span></div></article>
            <article className="metric-card"><div className="metric-top"><span>Teaching staff</span><span className="metric-icon metric-blue"><GraduationCap size={17} /></span></div><div className="metric-number">68</div><div className="metric-foot"><span className="metric-neutral">Across 12 departments</span></div></article>
            <article className="metric-card"><div className="metric-top"><span>Classes today</span><span className="metric-icon metric-gold"><BookOpen size={17} /></span></div><div className="metric-number">24</div><div className="metric-foot"><span className="metric-change">8 in progress</span><span>of 24 scheduled</span></div></article>
          </section>}

          {activePage === 'Overview' && <section className="overview-grid">
            <article className="panel attendance-panel"><div className="panel-heading"><div><h2>Attendance overview</h2><p>Daily attendance across the school</p></div><button className="select-button" onClick={() => changePage('Attendance')}>Last 28 days <ChevronDown size={15} /></button></div><div className="chart-summary"><strong>93.1%</strong><span className="metric-change"><ArrowUpRight size={13} /> 2.4%</span><small>compared to previous period</small></div><AttendanceChart /></article>
            <article className="panel schedule-panel"><div className="panel-heading"><div><h2>Today&apos;s schedule</h2><p>Tuesday, October 2</p></div><button className="text-link" onClick={() => changePage('Classes')}>Full schedule <ArrowUpRight size={14} /></button></div><div className="schedule-list">
              <div className="schedule-item"><time>09:00</time><span className="schedule-line green-line" /><div><strong>Mathematics</strong><small>Grade 8 · Room 204</small></div><span className="schedule-status in-progress">In progress</span></div>
              <div className="schedule-item"><time>10:30</time><span className="schedule-line coral-line" /><div><strong>English Literature</strong><small>Grade 7 · Room 106</small></div><span className="schedule-status">Upcoming</span></div>
              <div className="schedule-item"><time>11:45</time><span className="schedule-line blue-line" /><div><strong>General Science</strong><small>Grade 9 · Lab 02</small></div><span className="schedule-status">Upcoming</span></div>
              <div className="schedule-item"><time>13:15</time><span className="schedule-line gold-line" /><div><strong>World History</strong><small>Grade 6 · Room 112</small></div><span className="schedule-status">Upcoming</span></div>
            </div></article>
          </section>}

          {(activePage === 'Overview' || activePage === 'Students' || activePage === 'Attendance') && <section className="panel students-panel"><div className="panel-heading students-heading"><div><h2>{activePage === 'Attendance' ? 'Today’s attendance' : 'Recently enrolled students'}</h2><p>{activePage === 'Attendance' ? 'Student attendance status for today' : 'A snapshot of your student community'}</p></div><div className="table-controls"><label className="table-search"><Search size={15} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Find a student" aria-label="Find a student" /></label><button className="icon-button filter-button" aria-label="Filter students" onClick={() => showToast('Showing all grades and statuses.')}><SlidersHorizontal size={16} /></button>{activePage === 'Overview' && <button className="text-link desktop-link" onClick={() => changePage('Students')}>View all <ArrowUpRight size={14} /></button>}</div></div><StudentTable students={filteredStudents} onStudentClick={setSelectedStudent} /></section>}

          {activePage === 'Classes' && <section className="class-grid">{classes.map((item) => <article className="panel class-card" key={item.name}><div className={`class-art ${item.color}`}><BookOpen size={23} /><span>{item.students} students</span></div><div className="class-copy"><span className="class-grade">{item.grade}</span><h2>{item.name}</h2><p>{item.teacher}</p><button className="text-link" onClick={() => showToast(`${item.name} class details opened.`)}>View class <ArrowUpRight size={14} /></button></div></article>)}</section>}

          {activePage === 'Teachers' && <section className="teacher-grid">{teachers.map((teacher, index) => <article className="panel teacher-card" key={teacher.email}><span className={`teacher-avatar teacher-color-${index}`}>{teacher.initials}</span><div><h2>{teacher.name}</h2><p>{teacher.subject}</p><span>{teacher.email}</span></div><button className="icon-button" aria-label={`View ${teacher.name}`} onClick={() => showToast(`${teacher.name} teacher profile opened.`)}><ChevronRight size={17} /></button></article>)}</section>}

          {activePage === 'Settings' && <section className="panel settings-panel"><div className="panel-heading"><div><h2>Workspace preferences</h2><p>Choose which updates you&apos;d like to receive.</p></div><ShieldCheck size={20} className="settings-shield" /></div>{[['attendance', 'Attendance alerts', 'Get notified about attendance changes.'], ['email', 'Email notifications', 'Receive important school updates by email.'], ['weekly', 'Weekly summary', 'A Friday recap of school activity.']].map(([key, title, description]) => <label className="setting-row" key={key}><span><strong>{title}</strong><small>{description}</small></span><input type="checkbox" checked={settings[key]} onChange={() => setSettings((current) => ({ ...current, [key]: !current[key] }))} /></label>)}</section>}

          <footer className="page-footer"><span>© 2025 Northfield Academy</span><span>School year 2025–2026 <span className="footer-separator">·</span> Demo workspace</span></footer>
        </div>
      </main>

      {isAddOpen && <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setIsAddOpen(false) }}><section className="modal" role="dialog" aria-modal="true" aria-labelledby="add-student-title"><div className="modal-header"><span className="modal-icon"><Users size={19} /></span><button className="icon-button" aria-label="Close dialog" onClick={() => setIsAddOpen(false)}><X size={19} /></button></div><h2 id="add-student-title">Add a student</h2><p className="modal-description">Add a student to your Northfield roster.</p><form onSubmit={addStudent}><label>Full name<input autoFocus required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="e.g. Jordan Lee" /></label><label>Email address<input required type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="student@email.com" /></label><label>Grade<select value={form.grade} onChange={(event) => setForm({ ...form, grade: event.target.value })}>{Array.from({ length: 9 }, (_, index) => `Grade ${index + 1}`).map((grade) => <option key={grade}>{grade}</option>)}</select></label><div className="modal-actions"><button className="button button-secondary" type="button" onClick={() => setIsAddOpen(false)}>Cancel</button><button className="button button-primary" type="submit"><Plus size={16} /> Add student</button></div></form></section></div>}

      {selectedStudent && <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelectedStudent(null) }}><section className="modal student-modal" role="dialog" aria-modal="true" aria-labelledby="student-detail-title"><div className="modal-header"><span className={`avatar large-avatar ${selectedStudent.color}`}>{selectedStudent.initials}</span><button className="icon-button" aria-label="Close dialog" onClick={() => setSelectedStudent(null)}><X size={19} /></button></div><h2 id="student-detail-title">{selectedStudent.name}</h2><p className="modal-description">{selectedStudent.email}</p><div className="student-details"><span>Grade<strong>{selectedStudent.grade}</strong></span><span>Attendance<strong>{selectedStudent.attendance}%</strong></span><span>Status<strong>{selectedStudent.status}</strong></span></div><button className="button button-secondary detail-close" onClick={() => setSelectedStudent(null)}>Close</button></section></div>}

      {toast && <div className="toast" role="status"><span><Check size={15} /></span>{toast}</div>}
      <button className="mobile-menu icon-button" aria-label="Open navigation" onClick={() => showToast('Use the navigation bar to switch sections.')}><Menu size={19} /></button>
    </div>
  )
}

export default App