/**
 * Utility functions for goal management, including auto-generation of milestones and tasks
 */

// Define common goal templates with associated milestones and tasks
const goalTemplates = {
  fitness: {
    bulking: {
      title: "Bulk to {targetWeight}kg",
      description: "Gain muscle mass through proper nutrition and training",
      category: "health",
      milestones: [
        { description: "Set up nutrition plan", timeframe: 1, unit: "days" },
        { description: "Establish workout routine", timeframe: 2, unit: "days" },
        { description: "Gain first {targetStep}kg", timeframe: 14, unit: "days" },
        { description: "Reach {midWeight}kg", percentComplete: 50 },
        { description: "Maintain protein intake for 30 days straight", timeframe: 30, unit: "days" },
        { description: "Reach goal weight of {targetWeight}kg", percentComplete: 100 }
      ],
      tasks: {
        daily: [
          { description: "Hit protein target ({proteinTarget}g)", recurrence: "daily", category: "nutrition" },
          { description: "Track calories ({calorieTarget} kcal)", recurrence: "daily", category: "nutrition" },
          { description: "Get 7-8 hours of sleep", recurrence: "daily", category: "recovery" },
          { description: "Take supplements", recurrence: "daily", category: "nutrition" }
        ],
        weekly: [
          { description: "Weight training session", recurrence: "3x weekly", category: "exercise" },
          { description: "Meal prep for the week", recurrence: "weekly", category: "nutrition" },
          { description: "Weekly weight check-in", recurrence: "weekly", category: "tracking" }
        ],
        monthly: [
          { description: "Take progress photos", recurrence: "monthly", category: "tracking" },
          { description: "Reassess workout routine", recurrence: "monthly", category: "planning" }
        ]
      }
    },
    cutting: {
      title: "Cut to {targetWeight}kg",
      description: "Lose fat while maintaining muscle mass",
      category: "health",
      milestones: [
        { description: "Set up calorie deficit plan", timeframe: 1, unit: "days" },
        { description: "Establish cardio and weight training routine", timeframe: 2, unit: "days" },
        { description: "Lose first {targetStep}kg", timeframe: 14, unit: "days" },
        { description: "Reach {midWeight}kg", percentComplete: 50 },
        { description: "Maintain deficit for 30 days straight", timeframe: 30, unit: "days" },
        { description: "Reach goal weight of {targetWeight}kg", percentComplete: 100 }
      ],
      tasks: {
        daily: [
          { description: "Hit protein target ({proteinTarget}g)", recurrence: "daily", category: "nutrition" },
          { description: "Stay within calorie limit ({calorieTarget} kcal)", recurrence: "daily", category: "nutrition" },
          { description: "Get 7-8 hours of sleep", recurrence: "daily", category: "recovery" },
          { description: "Drink {waterTarget}L of water", recurrence: "daily", category: "nutrition" }
        ],
        weekly: [
          { description: "Weight training session", recurrence: "3x weekly", category: "exercise" },
          { description: "Cardio session", recurrence: "3x weekly", category: "exercise" },
          { description: "Weekly weight check-in", recurrence: "weekly", category: "tracking" }
        ],
        monthly: [
          { description: "Take progress photos", recurrence: "monthly", category: "tracking" },
          { description: "Body measurements check-in", recurrence: "monthly", category: "tracking" }
        ]
      }
    },
    runningGoal: {
      title: "Run a {distance}",
      description: "Train to complete a {distance} run",
      category: "health",
      milestones: [
        { description: "Establish baseline fitness level", timeframe: 7, unit: "days" },
        { description: "Complete {distance25}% distance", percentComplete: 25 },
        { description: "Complete {distance50}% distance", percentComplete: 50 },
        { description: "Complete {distance75}% distance", percentComplete: 75 },
        { description: "Complete full {distance} (practice run)", timeframe: -7, unit: "days", relativeTo: "end" },
        { description: "Complete {distance} event", percentComplete: 100 }
      ],
      tasks: {
        daily: [
          { description: "Stretching routine", recurrence: "daily", category: "exercise" },
          { description: "Hydration tracking", recurrence: "daily", category: "nutrition" }
        ],
        weekly: [
          { description: "Long run - {longRunDistance}", recurrence: "weekly", category: "exercise" },
          { description: "Speed training session", recurrence: "weekly", category: "exercise" },
          { description: "Easy recovery runs", recurrence: "2x weekly", category: "exercise" },
          { description: "Cross-training session", recurrence: "weekly", category: "exercise" }
        ],
        monthly: [
          { description: "Evaluate training progress", recurrence: "monthly", category: "tracking" },
          { description: "Update training plan", recurrence: "monthly", category: "planning" }
        ]
      }
    }
  },
  learning: {
    codingLanguage: {
      title: "Learn {language} Programming",
      description: "Become proficient in {language} programming language",
      category: "education",
      milestones: [
        { description: "Complete basic syntax tutorial", timeframe: 7, unit: "days" },
        { description: "Build first small project", timeframe: 14, unit: "days" },
        { description: "Solve 10 coding problems", timeframe: 21, unit: "days" },
        { description: "Build a medium-sized project", timeframe: 45, unit: "days" },
        { description: "Complete advanced concepts", timeframe: 60, unit: "days" },
        { description: "Build a comprehensive project", percentComplete: 100 }
      ],
      tasks: {
        daily: [
          { description: "Coding practice (1 hour)", recurrence: "daily", category: "practice" },
          { description: "Read documentation/tutorials", recurrence: "daily", category: "learning" }
        ],
        weekly: [
          { description: "Complete coding challenge", recurrence: "weekly", category: "practice" },
          { description: "Review progress and adjust learning path", recurrence: "weekly", category: "planning" }
        ],
        monthly: [
          { description: "Build a project using new skills", recurrence: "monthly", category: "project" },
          { description: "Connect with community/forums", recurrence: "monthly", category: "networking" }
        ]
      }
    },
    readingGoal: {
      title: "Read {bookCount} Books",
      description: "Read {bookCount} books in {timeframe}",
      category: "personal",
      milestones: [
        { description: "Create reading list", timeframe: 3, unit: "days" },
        { description: "Read {bookCount25}% of books", percentComplete: 25 },
        { description: "Read {bookCount50}% of books", percentComplete: 50 },
        { description: "Read {bookCount75}% of books", percentComplete: 75 },
        { description: "Complete all {bookCount} books", percentComplete: 100 }
      ],
      tasks: {
        daily: [
          { description: "Read for {readingTime} minutes", recurrence: "daily", category: "reading" }
        ],
        weekly: [
          { description: "Finish current book section", recurrence: "weekly", category: "reading" },
          { description: "Update reading journal", recurrence: "weekly", category: "tracking" }
        ],
        monthly: [
          { description: "Review and adjust reading list", recurrence: "monthly", category: "planning" }
        ]
      }
    }
  },
  financial: {
    savingsGoal: {
      title: "Save ${targetAmount}",
      description: "Save ${targetAmount} for {purpose}",
      category: "financial",
      milestones: [
        { description: "Create budget plan", timeframe: 7, unit: "days" },
        { description: "Save first ${initialSaving}", timeframe: 30, unit: "days" },
        { description: "Reach ${amount25}% of goal", percentComplete: 25 },
        { description: "Reach ${amount50}% of goal", percentComplete: 50 },
        { description: "Reach ${amount75}% of goal", percentComplete: 75 },
        { description: "Reach full ${targetAmount} savings goal", percentComplete: 100 }
      ],
      tasks: {
        daily: [
          { description: "Track daily expenses", recurrence: "daily", category: "tracking" }
        ],
        weekly: [
          { description: "Review weekly spending", recurrence: "weekly", category: "tracking" },
          { description: "Transfer ${weeklyAmount} to savings", recurrence: "weekly", category: "saving" }
        ],
        monthly: [
          { description: "Review and adjust budget", recurrence: "monthly", category: "planning" },
          { description: "Check progress towards goal", recurrence: "monthly", category: "tracking" }
        ]
      }
    }
  },
  career: {
    skillDevelopment: {
      title: "Master {skill} for Career Growth",
      description: "Develop expertise in {skill} to advance career",
      category: "career",
      milestones: [
        { description: "Research learning resources", timeframe: 7, unit: "days" },
        { description: "Complete beginner course/materials", timeframe: 30, unit: "days" },
        { description: "Complete intermediate materials", timeframe: 60, unit: "days" },
        { description: "Practice {skill} in real-world setting", timeframe: 90, unit: "days" },
        { description: "Get feedback from mentor/peer", timeframe: 120, unit: "days" },
        { description: "Complete advanced materials or certification", percentComplete: 100 }
      ],
      tasks: {
        daily: [
          { description: "Practice {skill} (30 minutes)", recurrence: "daily", category: "practice" }
        ],
        weekly: [
          { description: "Complete course module", recurrence: "weekly", category: "learning" },
          { description: "Apply {skill} in practical scenario", recurrence: "weekly", category: "practice" }
        ],
        monthly: [
          { description: "Get feedback on progress", recurrence: "monthly", category: "feedback" },
          { description: "Review and adjust learning path", recurrence: "monthly", category: "planning" }
        ]
      }
    }
  }
};

/**
 * Generate a timeframe-based date from now
 * @param {number} timeframe - The amount of time
 * @param {string} unit - The unit of time (days, weeks, months)
 * @param {string} relativeTo - 'start' or 'end' (relative to goal start or end date)
 * @param {Date} startDate - The start date of the goal
 * @param {Date} endDate - The end date of the goal
 * @returns {Date} The calculated date
 */
const calculateMilestoneDate = (timeframe, unit, relativeTo = 'start', startDate, endDate) => {
  const baseDate = relativeTo === 'end' ? new Date(endDate) : new Date(startDate);
  
  // If timeframe is negative, it means X days/weeks/months before the reference date
  const multiplier = timeframe < 0 ? -1 : 1;
  const absTimeframe = Math.abs(timeframe);
  
  switch(unit) {
    case 'days':
      baseDate.setDate(baseDate.getDate() + (absTimeframe * multiplier));
      break;
    case 'weeks':
      baseDate.setDate(baseDate.getDate() + (absTimeframe * 7 * multiplier));
      break;
    case 'months':
      baseDate.setMonth(baseDate.getMonth() + (absTimeframe * multiplier));
      break;
    default:
      break;
  }
  
  return baseDate;
};

/**
 * Calculate milestone dates based on percentage completion
 * @param {number} percentComplete - Percentage of goal completion (0-100)
 * @param {Date} startDate - Start date of the goal
 * @param {Date} endDate - End date of the goal
 * @returns {Date} The calculated date
 */
const calculateDateByPercentage = (percentComplete, startDate, endDate) => {
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();
  const totalDuration = end - start;
  
  const millisAtPercent = start + (totalDuration * (percentComplete / 100));
  return new Date(millisAtPercent);
};

/**
 * Generate task due dates based on recurrence
 * @param {Object} task - The task object
 * @param {Date} startDate - The start date of the goal
 * @param {Date} endDate - The end date of the goal
 * @returns {Array} Array of dates when this task is due
 */
const generateTaskDueDates = (task, startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const dueDates = [];
  
  let recurrenceCount = 1;
  let recurrencePeriod = 'days';
  
  // Parse recurrence string like "3x weekly" or "daily"
  if (task.recurrence.includes('x')) {
    const parts = task.recurrence.split('x');
    recurrenceCount = parseInt(parts[0].trim());
    recurrencePeriod = parts[1].trim();
  } else {
    recurrencePeriod = task.recurrence;
  }
  
  // Convert period to days
  let dayInterval = 1;
  switch(recurrencePeriod) {
    case 'daily':
      dayInterval = 1;
      break;
    case 'weekly':
      dayInterval = 7;
      break;
    case 'monthly':
      dayInterval = 30; // Approximation
      break;
    default:
      dayInterval = 1;
  }
  
  // Calculate days between recurrence
  const daysPerRecurrence = Math.ceil(dayInterval / recurrenceCount);
  
  // Generate all dates
  const current = new Date(start);
  while (current <= end) {
    dueDates.push(new Date(current));
    current.setDate(current.getDate() + daysPerRecurrence);
  }
  
  return dueDates;
};

/**
 * Replaces template variables in a string with actual values
 * @param {string} template - Template string with placeholders like {variable}
 * @param {Object} values - Object containing values to replace placeholders
 * @returns {string} String with replaced values
 */
const replaceTemplateVariables = (template, values) => {
  if (!template) return '';
  
  let result = template;
  for (const [key, value] of Object.entries(values)) {
    result = result.replace(new RegExp(`\\{${key}\\}`, 'g'), value);
  }
  return result;
};

/**
 * Generate milestones and tasks based on a goal template and parameters
 * @param {string} goalType - Type of goal (e.g., 'fitness.bulking')
 * @param {Object} params - Parameters to customize the goal
 * @param {Date} startDate - Start date for the goal
 * @param {Date} endDate - Target end date for the goal
 * @returns {Object} Generated goal with milestones and tasks
 */
export const generateGoalFromTemplate = (goalType, params, startDate, endDate) => {
  // Parse goal type to navigate the templates object
  const [category, subtype] = goalType.split('.');
  if (!goalTemplates[category] || !goalTemplates[category][subtype]) {
    throw new Error(`Unknown goal template: ${goalType}`);
  }
  
  const template = goalTemplates[category][subtype];
  
  // Create a copy of the template for customization
  const goal = {
    title: replaceTemplateVariables(template.title, params),
    description: replaceTemplateVariables(template.description, params),
    category: template.category,
    targetDate: endDate,
    startDate: startDate,
    progress: 0,
    milestones: [],
    tasks: []
  };
  
  // Generate milestones with dates
  if (template.milestones) {
    goal.milestones = template.milestones.map((milestone, index) => {
      let dueDate;
      
      if (milestone.hasOwnProperty('percentComplete')) {
        dueDate = calculateDateByPercentage(milestone.percentComplete, startDate, endDate);
      } else if (milestone.timeframe && milestone.unit) {
        dueDate = calculateMilestoneDate(
          milestone.timeframe, 
          milestone.unit, 
          milestone.relativeTo || 'start', 
          startDate, 
          endDate
        );
      } else {
        // Default to evenly spaced milestones
        dueDate = calculateDateByPercentage(
          ((index + 1) / template.milestones.length) * 100, 
          startDate, 
          endDate
        );
      }
      
      return {
        id: Date.now() + index,
        description: replaceTemplateVariables(milestone.description, params),
        dueDate: dueDate,
        completed: false
      };
    });
  }
  
  // Generate tasks with recurrence dates
  if (template.tasks) {
    const allTasks = [];
    
    // Process daily tasks
    if (template.tasks.daily) {
      template.tasks.daily.forEach((task, index) => {
        const taskDueDates = generateTaskDueDates(task, startDate, endDate);
        
        taskDueDates.forEach((dueDate, dateIndex) => {
          allTasks.push({
            id: `daily-${index}-${dateIndex}-${Date.now()}`,
            description: replaceTemplateVariables(task.description, params),
            category: task.category,
            recurrence: task.recurrence,
            dueDate: dueDate,
            completed: false
          });
        });
      });
    }
    
    // Process weekly tasks
    if (template.tasks.weekly) {
      template.tasks.weekly.forEach((task, index) => {
        const taskDueDates = generateTaskDueDates(task, startDate, endDate);
        
        taskDueDates.forEach((dueDate, dateIndex) => {
          allTasks.push({
            id: `weekly-${index}-${dateIndex}-${Date.now()}`,
            description: replaceTemplateVariables(task.description, params),
            category: task.category,
            recurrence: task.recurrence,
            dueDate: dueDate,
            completed: false
          });
        });
      });
    }
    
    // Process monthly tasks
    if (template.tasks.monthly) {
      template.tasks.monthly.forEach((task, index) => {
        const taskDueDates = generateTaskDueDates(task, startDate, endDate);
        
        taskDueDates.forEach((dueDate, dateIndex) => {
          allTasks.push({
            id: `monthly-${index}-${dateIndex}-${Date.now()}`,
            description: replaceTemplateVariables(task.description, params),
            category: task.category,
            recurrence: task.recurrence,
            dueDate: dueDate,
            completed: false
          });
        });
      });
    }
    
    goal.tasks = allTasks;
  }
  
  return goal;
};

/**
 * Get available goal templates for selection
 * @returns {Array} List of available goal templates with their parameters
 */
export const getAvailableGoalTemplates = () => {
  const templates = [];
  
  // Iterate through all goal templates and extract their details
  Object.entries(goalTemplates).forEach(([category, subtypes]) => {
    Object.entries(subtypes).forEach(([subtype, template]) => {
      templates.push({
        id: `${category}.${subtype}`,
        title: template.title,
        description: template.description,
        category: template.category,
        // Extract parameter names from template strings
        requiredParams: extractParameterNames(template.title, template.description)
      });
    });
  });
  
  return templates;
};

/**
 * Extract parameter names from template strings
 * @param {string} title - Template title string
 * @param {string} description - Template description string
 * @returns {Array} List of parameter names
 */
const extractParameterNames = (title, description) => {
  const combinedText = `${title} ${description}`;
  const paramRegex = /\{([^}]+)\}/g;
  const params = new Set();
  
  let match;
  while ((match = paramRegex.exec(combinedText))) {
    params.add(match[1]);
  }
  
  return Array.from(params);
};

/**
 * Get suggested parameters based on user profile and metrics
 * @param {string} goalType - Type of goal
 * @param {Object} userMetrics - User metrics and profile data
 * @returns {Object} Suggested parameters for the goal template
 */
export const getSuggestedParameters = (goalType, userMetrics) => {
  const [category, subtype] = goalType.split('.');
  const suggestions = {};
  
  // Weight-related goals
  if (goalType === 'fitness.bulking') {
    const currentWeight = userMetrics.weight || 70;
    suggestions.targetWeight = Math.round(currentWeight * 1.1); // 10% more
    suggestions.targetStep = 2;
    suggestions.midWeight = Math.round((currentWeight + suggestions.targetWeight) / 2);
    suggestions.proteinTarget = Math.round(suggestions.targetWeight * 1.8); // 1.8g per kg
    suggestions.calorieTarget = Math.round(suggestions.targetWeight * 35); // 35 cal per kg
  }
  
  if (goalType === 'fitness.cutting') {
    const currentWeight = userMetrics.weight || 70;
    suggestions.targetWeight = Math.round(currentWeight * 0.9); // 10% less
    suggestions.targetStep = 2;
    suggestions.midWeight = Math.round((currentWeight + suggestions.targetWeight) / 2);
    suggestions.proteinTarget = Math.round(currentWeight * 2.2); // 2.2g per kg
    suggestions.calorieTarget = Math.round(currentWeight * 25); // 25 cal per kg
    suggestions.waterTarget = 3;
  }
  
  if (goalType === 'fitness.runningGoal') {
    suggestions.distance = '5K';
    suggestions.distance25 = '1.25K';
    suggestions.distance50 = '2.5K';
    suggestions.distance75 = '3.75K';
    suggestions.longRunDistance = '3K increasing weekly';
  }
  
  if (goalType === 'learning.codingLanguage') {
    suggestions.language = 'Python';
  }
  
  if (goalType === 'learning.readingGoal') {
    suggestions.bookCount = 12;
    suggestions.timeframe = 'one year';
    suggestions.bookCount25 = 3;
    suggestions.bookCount50 = 6;
    suggestions.bookCount75 = 9;
    suggestions.readingTime = 30;
  }
  
  if (goalType === 'financial.savingsGoal') {
    suggestions.targetAmount = 5000;
    suggestions.purpose = 'emergency fund';
    suggestions.initialSaving = 500;
    suggestions.amount25 = suggestions.targetAmount * 0.25;
    suggestions.amount50 = suggestions.targetAmount * 0.5;
    suggestions.amount75 = suggestions.targetAmount * 0.75;
    suggestions.weeklyAmount = Math.round(suggestions.targetAmount / 52);
  }
  
  if (goalType === 'career.skillDevelopment') {
    suggestions.skill = 'public speaking';
  }
  
  return suggestions;
};

/**
 * Detects task overlaps and returns a deduplicated list
 * @param {Array} existingTasks - Existing tasks in the system
 * @param {Array} newTasks - New tasks being added
 * @returns {Array} Deduplicated task list with overlaps identified
 */
export const deduplicateTasks = (existingTasks, newTasks) => {
  const processedTasks = [...newTasks];
  
  // Create a lookup for existing tasks by description and due date
  const existingTaskLookup = {};
  existingTasks.forEach(task => {
    const key = `${task.description.toLowerCase()}_${task.dueDate}`;
    existingTaskLookup[key] = task;
  });
  
  // Identify and mark duplicates
  processedTasks.forEach(task => {
    const key = `${task.description.toLowerCase()}_${task.dueDate}`;
    if (existingTaskLookup[key]) {
      task.duplicate = true;
      task.originalTaskId = existingTaskLookup[key].id;
    }
  });
  
  // Filter out duplicates
  return processedTasks.filter(task => !task.duplicate);
};