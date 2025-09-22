import PropTypes from 'prop-types'

export default function RecentPrescriptionsTable({ rows }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-gray-500">
            <th className="py-2">ID</th>
            <th className="py-2">Patient</th>
            <th className="py-2">Medication</th>
            <th className="py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className="border-t">
              <td className="py-2">{r.id}</td>
              <td className="py-2">{r.patient}</td>
              <td className="py-2">{r.med}</td>
              <td className="py-2">
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs ${r.status === 'Approved' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}`}>{r.status}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

RecentPrescriptionsTable.propTypes = {
  rows: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    patient: PropTypes.string,
    med: PropTypes.string,
    status: PropTypes.string,
  })).isRequired,
}
