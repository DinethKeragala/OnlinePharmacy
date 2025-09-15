import PageHeader from '../components/common/PageHeader';

const Medicines = () => {
  const breadcrumbs = [
    { label: 'Home', path: '/' },
    { label: 'Medicines', path: null }
  ];

  return (
    <div>
      <PageHeader 
        title="Medicines" 
        breadcrumbs={breadcrumbs} 
      />
      {/* Medicine content will go here */}
    </div>
  );
};

export default Medicines;