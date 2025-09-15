import PageHeader from '../components/common/PageHeader';

const Prescriptions = () => {
  const breadcrumbs = [
    { label: 'Home', path: '/' },
    { label: 'Prescriptions', path: null }
  ];

  return (
    <div>
      <PageHeader 
        title="Prescriptions" 
        breadcrumbs={breadcrumbs} 
      />
      {/* Prescriptions content will go here */}
    </div>
  );
};

export default Prescriptions;