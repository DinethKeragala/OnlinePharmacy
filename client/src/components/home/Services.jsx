import { FaClipboardList, FaUserCircle, FaTruck, FaHeadphones } from 'react-icons/fa'

const services = [
  {
    icon: FaClipboardList,
    title: 'Prescription Refills',
    desc: 'Easily upload your prescription and get refills delivered to your doorstep.',
    href: '/prescriptions',
  },
  {
    icon: FaUserCircle,
    title: 'Online Consultation',
    desc: 'Connect with licensed pharmacists for medication guidance and advice.',
    href: '/prescriptions',
  },
  {
    icon: FaTruck,
    title: 'Same-Day Delivery',
    desc: 'Get your essential medications delivered on the same day in select areas.',
    href: '/medicines',
  },
  {
    icon: FaHeadphones,
    title: '24/7 Customer Support',
    desc: 'Our team is available round the clock to assist with your queries.',
    href: '/contact',
  },
]

export default function Services() {
  return (
    <section className="bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Our Services</h2>
          <p className="mt-3 text-gray-600">We offer a range of pharmacy services to ensure you receive the best care and convenience for all your healthcare needs.</p>
        </div>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((s) => {
            const Icon = s.icon
            return (
              <div key={s.title} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col">
                <div className="h-12 w-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Icon />
                </div>
                <h3 className="mt-4 text-xl font-semibold text-gray-900">{s.title}</h3>
                <p className="mt-2 text-gray-600 flex-1">{s.desc}</p>
                <a href={s.href} className="mt-4 inline-flex items-center text-blue-600 font-medium hover:underline">
                  Learn more <span className="ml-1">→</span>
                </a>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
