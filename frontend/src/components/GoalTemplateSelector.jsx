import React, { useState, useEffect } from 'react';
import { 
  getAvailableGoalTemplates, 
  getSuggestedParameters,
  generateGoalFromTemplate
} from '../utils/goalUtils';
import '../styles/GoalTemplateSelector.css';

const GoalTemplateSelector = ({ onGoalGenerated, userMetrics = {} }) => {
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [parameters, setParameters] = useState({});
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(getDefaultEndDate());
  const [isGenerating, setIsGenerating] = useState(false);

  // Get default end date (3 months from now)
  function getDefaultEndDate() {
    const date = new Date();
    date.setMonth(date.getMonth() + 3);
    return date.toISOString().split('T')[0];
  }

  // Load available templates on component mount
  useEffect(() => {
    const availableTemplates = getAvailableGoalTemplates();
    setTemplates(availableTemplates);
  }, []);

  // Update parameters with suggestions when template changes
  useEffect(() => {
    if (selectedTemplate) {
      const suggestedParams = getSuggestedParameters(selectedTemplate.id, userMetrics);
      setParameters(suggestedParams);
    }
  }, [selectedTemplate, userMetrics]);

  // Handle template selection
  const handleTemplateChange = (e) => {
    const templateId = e.target.value;
    const template = templates.find(t => t.id === templateId);
    setSelectedTemplate(template);
  };

  // Handle parameter input changes
  const handleParameterChange = (param, value) => {
    setParameters(prev => ({
      ...prev,
      [param]: value
    }));
  };

  // Generate goal from template with parameters
  const handleGenerateGoal = () => {
    if (!selectedTemplate) return;

    setIsGenerating(true);
    
    try {
      const generatedGoal = generateGoalFromTemplate(
        selectedTemplate.id,
        parameters,
        new Date(startDate),
        new Date(endDate)
      );

      onGoalGenerated(generatedGoal);
      
      // Reset form after generation
      setIsGenerating(false);
      setSelectedTemplate(null);
      setParameters({});
      setStartDate(new Date().toISOString().split('T')[0]);
      setEndDate(getDefaultEndDate());
    } catch (error) {
      console.error("Error generating goal:", error);
      setIsGenerating(false);
      // Could add error handling UI here
    }
  };

  return (
    <div className="goal-template-selector">
      <h3>Select a Goal Template</h3>
      
      <div className="template-select-container">
        <select 
          value={selectedTemplate ? selectedTemplate.id : ''}
          onChange={handleTemplateChange}
          className="template-select"
        >
          <option value="">-- Select a Goal Template --</option>
          {templates.map(template => (
            <option key={template.id} value={template.id}>
              {template.title}
            </option>
          ))}
        </select>
      </div>
      
      {selectedTemplate && (
        <div className="template-config">
          <div className="template-info">
            <p className="template-description">{selectedTemplate.description}</p>
          </div>
          
          <div className="date-range-config">
            <div className="form-group">
              <label>Start Date</label>
              <input 
                type="date" 
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            
            <div className="form-group">
              <label>Target Completion Date</label>
              <input 
                type="date" 
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
          
          <div className="parameters-config">
            <h4>Customize Your Goal</h4>
            
            {selectedTemplate.requiredParams.map(param => (
              <div key={param} className="form-group">
                <label>{param.charAt(0).toUpperCase() + param.slice(1).replace(/([A-Z])/g, ' $1')}</label>
                <input 
                  type={typeof parameters[param] === 'number' ? 'number' : 'text'}
                  value={parameters[param] || ''}
                  onChange={(e) => handleParameterChange(param, e.target.value)}
                  placeholder={`Enter ${param}`}
                />
              </div>
            ))}
          </div>
          
          <button 
            className="generate-button"
            onClick={handleGenerateGoal}
            disabled={isGenerating}
          >
            {isGenerating ? 'Generating...' : 'Generate Goal with Milestones & Tasks'}
          </button>
          
          <div className="template-preview">
            <p>This will create:</p>
            <ul>
              <li>A goal with customized milestones and target dates</li>
              <li>Daily tasks needed to achieve your goal</li>
              <li>Weekly check-ins and progress tracking</li>
              <li>Monthly review points to adjust your approach</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoalTemplateSelector;