import PageHeader from '../components/common/PageHeader';

const HealthProducts = () => {
  const breadcrumbs = [
    { label: 'Home', path: '/' },
    { label: 'Health Products', path: null }
  ];

  return (
    <div>
      <PageHeader 
        title="Health Products" 
        breadcrumbs={breadcrumbs} 
      />
      {/* Health Products content will go here */}
    </div>
  );
};

export default HealthProducts;