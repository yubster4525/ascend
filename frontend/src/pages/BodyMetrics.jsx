import React, { useState } from 'react';
import '../styles/BodyMetrics.css';

const BodyMetrics = () => {
  // Mock data that would normally come from an API
  const initialMetrics = [
    { id: 1, date: '2025-02-10', weight: 78.5, bodyFat: 22, muscleMass: 35.2, waterPercentage: 55 },
    { id: 2, date: '2025-02-17', weight: 77.8, bodyFat: 21.5, muscleMass: 35.5, waterPercentage: 56 },
    { id: 3, date: '2025-02-24', weight: 77.2, bodyFat: 21.0, muscleMass: 35.8, waterPercentage: 56.5 },
    { id: 4, date: '2025-03-03', weight: 76.5, bodyFat: 20.5, muscleMass: 36.0, waterPercentage: 57 },
  ];

  const [metrics, setMetrics] = useState(initialMetrics);
  const [newMetric, setNewMetric] = useState({
    date: new Date().toISOString().split('T')[0],
    weight: '',
    bodyFat: '',
    muscleMass: '',
    waterPercentage: ''
  });

  // Calculate metrics for the dashboard
  const latestMetric = metrics[metrics.length - 1];
  const firstMetric = metrics[0];
  const progressData = {
    weightLoss: firstMetric.weight - latestMetric.weight,
    bodyFatReduction: firstMetric.bodyFat - latestMetric.bodyFat,
    muscleMassGain: latestMetric.muscleMass - firstMetric.muscleMass
  };

  // Calculate BMI
  const calculateBMI = (weight, height) => {
    if (!weight || !height) return 'N/A';
    const heightInM = height / 100;
    return (weight / (heightInM * heightInM)).toFixed(1);
  };

  // Calculate ideal weight range based on height and gender
  const calculateIdealWeightRange = (height, gender) => {
    if (!height) return { min: 'N/A', max: 'N/A' };
    
    let minFactor = gender === 'male' ? 20 : 19;
    let maxFactor = gender === 'male' ? 25 : 24;
    
    const heightInM = height / 100;
    const min = (minFactor * heightInM * heightInM).toFixed(1);
    const max = (maxFactor * heightInM * heightInM).toFixed(1);
    
    return { min, max };
  };

  const [personalInfo, setPersonalInfo] = useState({
    height: 178,
    gender: 'male',
    age: 30,
    activityLevel: 'moderate'
  });

  const bmi = calculateBMI(latestMetric.weight, personalInfo.height);
  const idealWeightRange = calculateIdealWeightRange(personalInfo.height, personalInfo.gender);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMetric({
      ...newMetric,
      [name]: value
    });
  };

  const handlePersonalInfoChange = (e) => {
    const { name, value } = e.target;
    setPersonalInfo({
      ...personalInfo,
      [name]: value
    });
  };

  const handleAddMetric = (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!newMetric.weight) return;
    
    const metricToAdd = {
      id: Date.now(),
      date: newMetric.date,
      weight: parseFloat(newMetric.weight),
      bodyFat: newMetric.bodyFat ? parseFloat(newMetric.bodyFat) : null,
      muscleMass: newMetric.muscleMass ? parseFloat(newMetric.muscleMass) : null,
      waterPercentage: newMetric.waterPercentage ? parseFloat(newMetric.waterPercentage) : null
    };
    
    setMetrics([...metrics, metricToAdd]);
    setNewMetric({
      date: new Date().toISOString().split('T')[0],
      weight: '',
      bodyFat: '',
      muscleMass: '',
      waterPercentage: ''
    });
  };

  return (
    <div className="body-metrics-container">
      <h1>Body Metrics Tracker</h1>
      
      <div className="metrics-grid">
        <div className="metrics-dashboard card">
          <h3>Your Body Composition</h3>
          <div className="metrics-overview">
            <div className="metric-item">
              <div className="metric-value">{latestMetric.weight} kg</div>
              <div className="metric-label">Current Weight</div>
              <div className="metric-progress positive">
                {progressData.weightLoss > 0 ? `↓ ${progressData.weightLoss.toFixed(1)} kg` : 
                 progressData.weightLoss < 0 ? `↑ ${Math.abs(progressData.weightLoss).toFixed(1)} kg` : 'No change'}
              </div>
            </div>
            
            <div className="metric-item">
              <div className="metric-value">{bmi}</div>
              <div className="metric-label">BMI</div>
              <div className="metric-progress">
                Ideal: {idealWeightRange.min}-{idealWeightRange.max} kg
              </div>
            </div>
            
            <div className="metric-item">
              <div className="metric-value">{latestMetric.bodyFat}%</div>
              <div className="metric-label">Body Fat</div>
              <div className="metric-progress positive">
                {progressData.bodyFatReduction > 0 ? `↓ ${progressData.bodyFatReduction.toFixed(1)}%` : 
                 progressData.bodyFatReduction < 0 ? `↑ ${Math.abs(progressData.bodyFatReduction).toFixed(1)}%` : 'No change'}
              </div>
            </div>
            
            <div className="metric-item">
              <div className="metric-value">{latestMetric.muscleMass} kg</div>
              <div className="metric-label">Muscle Mass</div>
              <div className="metric-progress positive">
                {progressData.muscleMassGain > 0 ? `↑ ${progressData.muscleMassGain.toFixed(1)} kg` : 
                 progressData.muscleMassGain < 0 ? `↓ ${Math.abs(progressData.muscleMassGain).toFixed(1)} kg` : 'No change'}
              </div>
            </div>
          </div>
        </div>
        
        <div className="personal-info card">
          <h3>Personal Information</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Height (cm)</label>
              <input 
                type="number" 
                name="height" 
                value={personalInfo.height}
                onChange={handlePersonalInfoChange}
              />
            </div>
            <div className="form-group">
              <label>Gender</label>
              <select name="gender" value={personalInfo.gender} onChange={handlePersonalInfoChange}>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Age</label>
              <input 
                type="number" 
                name="age" 
                value={personalInfo.age}
                onChange={handlePersonalInfoChange}
              />
            </div>
            <div className="form-group">
              <label>Activity Level</label>
              <select name="activityLevel" value={personalInfo.activityLevel} onChange={handlePersonalInfoChange}>
                <option value="sedentary">Sedentary</option>
                <option value="light">Light Activity</option>
                <option value="moderate">Moderate Activity</option>
                <option value="active">Very Active</option>
                <option value="athlete">Athlete</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      
      <div className="add-metrics card">
        <h3>Add New Measurements</h3>
        <form onSubmit={handleAddMetric}>
          <div className="form-row">
            <div className="form-group">
              <label>Date</label>
              <input 
                type="date" 
                name="date" 
                value={newMetric.date}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Weight (kg)</label>
              <input 
                type="number" 
                step="0.1" 
                name="weight" 
                value={newMetric.weight}
                onChange={handleInputChange}
                placeholder="e.g. 75.5"
                required
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Body Fat (%)</label>
              <input 
                type="number" 
                step="0.1" 
                name="bodyFat" 
                value={newMetric.bodyFat}
                onChange={handleInputChange}
                placeholder="e.g. 20.5"
              />
            </div>
            <div className="form-group">
              <label>Muscle Mass (kg)</label>
              <input 
                type="number" 
                step="0.1" 
                name="muscleMass" 
                value={newMetric.muscleMass}
                onChange={handleInputChange}
                placeholder="e.g. 35.2"
              />
            </div>
            <div className="form-group">
              <label>Water (%)</label>
              <input 
                type="number" 
                step="0.1" 
                name="waterPercentage" 
                value={newMetric.waterPercentage}
                onChange={handleInputChange}
                placeholder="e.g. 55"
              />
            </div>
          </div>
          
          <button type="submit" className="btn">Add Measurement</button>
        </form>
      </div>
      
      <div className="metrics-history card">
        <h3>Measurement History</h3>
        <div className="table-container">
          <table className="metrics-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Weight (kg)</th>
                <th>Body Fat (%)</th>
                <th>Muscle Mass (kg)</th>
                <th>Water (%)</th>
              </tr>
            </thead>
            <tbody>
              {metrics.map(metric => (
                <tr key={metric.id}>
                  <td>{new Date(metric.date).toLocaleDateString()}</td>
                  <td>{metric.weight}</td>
                  <td>{metric.bodyFat || '-'}</td>
                  <td>{metric.muscleMass || '-'}</td>
                  <td>{metric.waterPercentage || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="metrics-insights card">
        <h3>Body Composition Insights</h3>
        <div className="insights-content">
          <p>
            You've lost <strong>{progressData.weightLoss.toFixed(1)} kg</strong> while gaining 
            <strong> {progressData.muscleMassGain.toFixed(1)} kg</strong> of muscle mass. 
            This indicates effective body recomposition!
          </p>
          <p>
            Your body fat has decreased by <strong>{progressData.bodyFatReduction.toFixed(1)}%</strong>, 
            which is excellent progress toward a healthier body composition.
          </p>
          <p>
            <strong>Recommendation:</strong> Focus on maintaining your protein intake to support muscle growth 
            while continuing your current exercise routine.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BodyMetrics;