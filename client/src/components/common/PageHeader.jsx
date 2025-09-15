const PageHeader = ({ title, breadcrumbs }) => {
  return (
    <div className="bg-blue-600 text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold mb-2">{title}</h1>
        <div className="flex items-center gap-2 text-blue-100">
          {breadcrumbs.map((item, index) => (
            <div key={item.path} className="flex items-center">
              {index > 0 && <span className="mx-2">/</span>}
              {item.path ? (
                <a 
                  href={item.path}
                  className="hover:text-white transition-colors"
                >
                  {item.label}
                </a>
              ) : (
                <span>{item.label}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PageHeader;