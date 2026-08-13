import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [applications, setApplications] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [sortBy, setSortBy] = useState('NEWEST')
  const [form, setForm] = useState({
    company: '',
    position: '',
    location: '',
    status: 'APPLIED',
    dateApplied: '',
    jobUrl: '',
    notes: ''
  })

  const loadApplications = async () => {
    const response = await fetch('http://localhost:8080/api/applications')
    const data = await response.json()
    setApplications(data)
  }

  useEffect(() => {
    loadApplications()
  }, [])

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value
    })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const url = editingId
      ? `http://localhost:8080/api/applications/${editingId}`
      : 'http://localhost:8080/api/applications'

    const method = editingId ? 'PUT' : 'POST'

    await fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(form)
    })

    setForm({
      company: '',
      position: '',
      location: '',
      status: 'APPLIED',
      dateApplied: '',
      jobUrl: '',
      notes: ''
    })

    setEditingId(null)

    loadApplications()
  }


  const deleteApplication = async (id) => {
      const confirmed = window.confirm(
          'Are you sure you want to delete this application?'
      )

      if (!confirmed) return
    await fetch(`http://localhost:8080/api/applications/${id}`, {
      method: 'DELETE'
    })

    loadApplications()
  }
const startEdit = (application) => {
  setEditingId(application.id)

  setForm({
    company: application.company || '',
    position: application.position || '',
    location: application.location || '',
    status: application.status || 'APPLIED',
    dateApplied: application.dateApplied || '',
    jobUrl: application.jobUrl || '',
    notes: application.notes || ''
  })
}
const filteredApplications = applications.filter((application) => {
    const matchesSearch =
        application.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        application.position?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        application.location?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus =
        statusFilter === 'ALL' || application.status === statusFilter

    return matchesSearch && matchesStatus
})
const totalApplications = applications.length
const appliedCount = applications.filter(
    (application) => application.status === 'APPLIED'
).length
const interviewCount = applications.filter(
    (application) => application.status === 'INTERVIEW'
).length

const offerCount = applications.filter(
    (application) => application.status === 'OFFER'
).length

const rejectedCount = applications.filter(
    (application) => application.status === 'REJECTED'
).length
const sortedApplications = [...filteredApplications].sort((a, b) => {
    if (sortBy === 'NEWEST') {
        return new Date(b.dateApplied) - new Date(a.dateApplied)
    }

    if (sortBy === 'OLDEST') {
        return new Date(a.dateApplied) - new Date(b.dateApplied)
    }

    if (sortBy === 'COMPANY') {
        return (a.company || '').localeCompare(b.company || '')
    }

    return 0
})
  return (
    <div className="app">
      <header>
        <div className="header-content">
          <h1>CareerOS</h1>
          <p>Track applications, interviews, offers, and career progress.</p>
        </div>
      </header>

      <main>
          <section className="stats-grid">
              <div className="stat-card">
                  <span>Total Applications</span>
                  <strong>{totalApplications}</strong>
              </div>

              <div className="stat-card">
                  <span>Applied</span>
                  <strong>{appliedCount}</strong>
              </div>

              <div className="stat-card">
                  <span>Interviews</span>
                  <strong>{interviewCount}</strong>
              </div>

              <div className="stat-card">
                  <span>Offers</span>
                  <strong>{offerCount}</strong>
              </div>

              <div className="stat-card">
                  <span>Rejected</span>
                  <strong>{rejectedCount}</strong>
              </div>
          </section>
        <section className="card">
          <h2>Add Application</h2>

          <form onSubmit={handleSubmit}>
            <input
              name="company"
              placeholder="Company"
              value={form.company}
              onChange={handleChange}
              required
            />

            <input
              name="position"
              placeholder="Position"
              value={form.position}
              onChange={handleChange}
              required
            />

            <input
              name="location"
              placeholder="Location"
              value={form.location}
              onChange={handleChange}
            />

            <select
              name="status"
              value={form.status}
              onChange={handleChange}
            >
              <option value="APPLIED">Applied</option>
              <option value="INTERVIEW">Interview</option>
              <option value="OFFER">Offer</option>
              <option value="REJECTED">Rejected</option>
            </select>

            <input
              type="date"
              name="dateApplied"
              value={form.dateApplied}
              onChange={handleChange}
              required
            />

            <input
              name="jobUrl"
              placeholder="Job URL"
              value={form.jobUrl}
              onChange={handleChange}
            />

            <textarea
              name="notes"
              placeholder="Notes"
              value={form.notes}
              onChange={handleChange}
            />

            <button type="submit">
                {editingId ? 'Update Application' : 'Add Application'}
            </button>
          </form>
        </section>

        <section className="card">
          <h2>Applications</h2>
          <div className="filters">
            <input
              type="text"
              placeholder="Search company, position, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">All Statuses</option>
              <option value="APPLIED">Applied</option>
              <option value="INTERVIEW">Interview</option>
              <option value="OFFER">Offer</option>
              <option value="REJECTED">Rejected</option>
            </select>
            <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
            >
                <option value="NEWEST">Newest First</option>
                <option value="OLDEST">Oldest First</option>
                <option value="COMPANY">Company A-Z</option>
            </select>
          </div>

          {applications.length === 0 ? (
            <div className="empty-state">
              No applications yet. Add your first opportunity above.
            </div>
          ) : (
            <div className="applications">
              {sortedApplications.map((application) => (
                <div className="application-item" key={application.id}>
                  <div>
                    <h3>{application.company}</h3>
                    <p>{application.position}</p>
                    <p>{application.location}</p>
                    <span
                      className={`status-badge status-${application.status.toLowerCase()}`}
                    >
                      {application.status}
                    </span>
                    <p>Applied: {application.dateApplied}</p>
                  </div>
<button
    className="edit-button"
    onClick={() => startEdit(application)}
>
    Edit
</button>
{application.jobUrl && (
    <a
        className="job-link"
        href={application.jobUrl}
        target="_blank"
        rel="noopener noreferrer"
    >
        View Job
    </a>
)}
<button
    className="delete-button"
    onClick={() => deleteApplication(application.id)}
>
    Delete
</button>

                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

export default App