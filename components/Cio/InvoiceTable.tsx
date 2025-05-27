const invoiceData = [
    {
      id: 'INV-1990',
      category: 'Android',
      price: '$83.74',
      status: 'Paid',
      statusColor: 'green'
    },
    {
      id: 'INV-1991',
      category: 'Mac',
      price: '$97.14',
      status: 'Out of date',
      statusColor: 'red'
    },
    {
      id: 'INV-1992',
      category: 'Windows',
      price: '$68.71',
      status: 'Progress',
      statusColor: 'blue'
    },
    {
      id: 'INV-1993',
      category: 'Android',
      price: '$85.21',
      status: 'Paid',
      statusColor: 'green'
    },
    {
      id: 'INV-1994',
      category: 'Mac',
      price: '$52.17',
      status: 'Draft',
      statusColor: 'gray'
    }
  ]
  
  export default function InvoiceTable() {
    const getStatusBadge = (status: string, color: string) => {
      const colorClasses = {
        green: 'bg-green-100 text-green-800',
        red: 'bg-red-100 text-red-800',
        blue: 'bg-blue-100 text-blue-800',
        gray: 'bg-gray-100 text-gray-800'
      }
  
      return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClasses[color as keyof typeof colorClasses]}`}>
          {status}
        </span>
      )
    }
  
    return (
      <div className="bg-white p-4 lg:p-6 rounded-lg shadow-sm">
        <h3 className="text-base lg:text-lg font-semibold mb-4 lg:mb-6">New invoice</h3>
        
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 lg:py-3 px-2 lg:px-4 font-medium text-gray-600 text-sm">
                  Invoice ID
                </th>
                <th className="text-left py-2 lg:py-3 px-2 lg:px-4 font-medium text-gray-600 text-sm">
                  Category
                </th>
                <th className="text-left py-2 lg:py-3 px-2 lg:px-4 font-medium text-gray-600 text-sm">
                  Price
                </th>
                <th className="text-left py-2 lg:py-3 px-2 lg:px-4 font-medium text-gray-600 text-sm">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {invoiceData.map((invoice, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-3 lg:py-4 px-2 lg:px-4 text-sm font-medium text-gray-900">
                    {invoice.id}
                  </td>
                  <td className="py-3 lg:py-4 px-2 lg:px-4 text-sm text-gray-600">
                    {invoice.category}
                  </td>
                  <td className="py-3 lg:py-4 px-2 lg:px-4 text-sm font-semibold text-gray-900">
                    {invoice.price}
                  </td>
                  <td className="py-3 lg:py-4 px-2 lg:px-4 text-sm">
                    {getStatusBadge(invoice.status, invoice.statusColor)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Show more link */}
        <div className="mt-4 text-center">
          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium hover:underline transition-colors">
            View all invoices
          </button>
        </div>
      </div>
    )
  }