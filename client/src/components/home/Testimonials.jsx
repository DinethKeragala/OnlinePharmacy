import { FaStar } from 'react-icons/fa'
import { Link } from 'react-router-dom'

const testimonials = [
  {
    quote:
      'The service is exceptional! I get my prescriptions delivered right to my door, which is so helpful as a busy mom. The pharmacists are also very knowledgeable and always available to answer my questions.',
    name: 'Sarah Johnson',
    role: 'Verified Customer',
    avatar:
      'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?q=80&w=120&h=120&fit=crop&auto=format',
    rating: 5,
  },
  {
    quote:
      "I've been using this online pharmacy for over a year now, and it has made managing my medications so much easier. The automatic refills and reminders ensure I never miss a dose.",
    name: 'Michael Chen',
    role: 'Verified Customer',
    avatar:
      'https://images.unsplash.com/photo-1607746882042-944635dfe10e?q=80&w=120&h=120&fit=crop&auto=format',
    rating: 5,
  },
  {
    quote:
      'The online consultation feature saved me when I was traveling and needed medical advice. The pharmacist was able to help me right away. Their same-day delivery is also incredibly reliable.',
    name: 'Emily Rodriguez',
    role: 'Verified Customer',
    avatar:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=120&h=120&fit=crop&auto=format',
    rating: 4,
  },
]

function Stars({ n }) {
  return (
    <div className="flex gap-1 text-yellow-400">
      {[1, 2, 3, 4, 5].map((i) => (
        <FaStar key={i} className={i <= n ? '' : 'opacity-30'} />
      ))}
    </div>
  )
}

export default function Testimonials() {
  return (
    <section className="bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">What Our Customers Say</h2>
          <p className="mt-3 text-gray-600">
            Thousands of customers trust us with their healthcare needs every day. Here's what some of them have to say.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div key={t.name} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col">
              <Stars n={t.rating} />
              <p className="mt-4 text-gray-700 leading-relaxed">“{t.quote}”</p>
              <div className="mt-6 flex items-center gap-3">
                <img src={t.avatar} alt={t.name} className="h-10 w-10 rounded-full object-cover" />
                <div>
                  <div className="font-medium text-gray-900">{t.name}</div>
                  <div className="text-sm text-gray-500">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link to="/testimonials" className="inline-flex items-center text-blue-600 font-medium hover:underline">
            Read more testimonials <span className="ml-1">→</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
