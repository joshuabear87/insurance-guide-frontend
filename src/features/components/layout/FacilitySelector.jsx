import API from '../../../api/axios'; 

const FacilitySelector = ({ current, available, onChange }) => {
  const handleChange = async (newFacility) => {
    try {
      const response = await API.post('/auth/set-facility', {
        activeFacility: newFacility,
      });

      const { token } = response.data;
      if (token) {
        localStorage.setItem('accessToken', token);
        localStorage.setItem('activeFacility', newFacility); 
        onChange(newFacility); 
        window.location.reload(); 
      }
    } catch (error) {
      console.error('❌ Failed to switch facility:', error);
      alert('Failed to switch facility. Please try again.');
    }
  };

  return (
    <select
      className="form-select form-select-sm w-auto"
      value={current}
      onChange={(e) => handleChange(e.target.value)}
    >
      {available.map((facility) => (
        <option key={facility.name} value={facility.name}>
          {facility.name}
        </option>
      ))}
    </select>
  );
};

export default FacilitySelector;
