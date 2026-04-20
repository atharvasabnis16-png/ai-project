/**
 * AI Service — Single toggle point for Mock vs Real AI
 * 
 * When USE_MOCK_AI=true in .env, all AI methods return realistic mock data.
 * When USE_MOCK_AI=false, they call the Anthropic Claude API.
 * 
 * To switch: change USE_MOCK_AI in your .env file.
 */

const isMockMode = () => process.env.USE_MOCK_AI === 'true';

// ─── Mock Responses ────────────────────────────────────────────────

const mockResponses = {
  summarizeNotes: (content) => ({
    summary: `**Key Points Summary:**\n\n• The team discussed the main project architecture and component breakdown\n• Frontend will use React with a component-based approach\n• Database schema design was finalized for users, tasks, and teams\n• API endpoints were mapped out for all core features\n• Timeline targets were set with weekly milestones\n• Design system colors and typography were agreed upon`
  }),

  extractActionPoints: (content) => ({
    actionPoints: [
      'Set up the project repository and initialize the codebase',
      'Design the database schema for User and Team models',
      'Implement JWT authentication flow (signup + login)',
      'Create the responsive dashboard layout with sidebar navigation',
      'Build the Kanban task board with drag-and-drop functionality',
      'Integrate the AI service layer with mock/real toggle',
      'Write unit tests for critical authentication flows'
    ]
  }),

  clusterIdeas: (content) => ({
    clusters: [
      {
        theme: '🏗️ Architecture & Setup',
        ideas: ['Project scaffolding', 'Database design', 'API structure', 'Dev environment config']
      },
      {
        theme: '🎨 UI/UX Design',
        ideas: ['Dashboard layout', 'Color scheme', 'Responsive breakpoints', 'Component library']
      },
      {
        theme: '🔐 Security & Auth',
        ideas: ['JWT implementation', 'Password hashing', 'Protected routes', 'Session management']
      },
      {
        theme: '🤖 AI Features',
        ideas: ['Task suggestion engine', 'Note summarization', 'Meeting analysis', 'Skill matching']
      }
    ]
  }),

  suggestTasks: (projectDescription, existingTasks) => ({
    tasks: [
      { title: 'Set up project documentation', skillTag: 'writing', priority: 'high', description: 'Create README, contributing guidelines, and project wiki' },
      { title: 'Design UI mockups for dashboard', skillTag: 'design', priority: 'high', description: 'Create wireframes and high-fidelity mockups for the main dashboard' },
      { title: 'Implement user authentication API', skillTag: 'coding', priority: 'high', description: 'Build signup, login, and JWT token management endpoints' },
      { title: 'Research competitor platforms', skillTag: 'research', priority: 'medium', description: 'Analyze 3-5 similar platforms for feature comparison' },
      { title: 'Create project presentation outline', skillTag: 'ppt', priority: 'low', description: 'Draft slide structure for the final project presentation' },
      { title: 'Write test cases for API endpoints', skillTag: 'testing', priority: 'medium', description: 'Create comprehensive test suite for all REST API routes' }
    ]
  }),

  analyzeMeeting: (transcript) => ({
    summary: `**Meeting Summary:**\n\nThe team held a productive sync meeting to review progress and plan next steps. Key architecture decisions were made regarding the tech stack and feature prioritization. Task assignments were discussed based on individual skill profiles, with an emphasis on balanced workload distribution.`,
    decisions: [
      'Adopted React + Tailwind for the frontend stack',
      'Agreed on MongoDB Atlas for cloud database hosting',
      'Set the sprint deadline for next Friday',
      'Decided to implement AI features with mock fallback mode',
      'Approved the dark sidebar + light content design direction'
    ],
    actionItems: [
      { task: 'Complete the authentication flow implementation', assignee: 'Team Lead' },
      { task: 'Design the Kanban board component', assignee: 'UI Designer' },
      { task: 'Set up MongoDB Atlas cluster and connection', assignee: 'Backend Dev' },
      { task: 'Research Claude API integration patterns', assignee: 'AI Developer' },
      { task: 'Prepare mid-project progress report', assignee: 'Documentation Lead' }
    ]
  }),

  generateResearchOutline: (topic) => ({
    outline: {
      title: `Research Report: ${topic}`,
      sections: [
        { heading: '1. Introduction', points: ['Background context', 'Research objectives', 'Scope and limitations'] },
        { heading: '2. Literature Review', points: ['Existing studies', 'Key theories and frameworks', 'Research gaps'] },
        { heading: '3. Methodology', points: ['Research approach', 'Data collection methods', 'Analysis framework'] },
        { heading: '4. Findings', points: ['Primary results', 'Data analysis', 'Key patterns and trends'] },
        { heading: '5. Discussion', points: ['Interpretation of results', 'Comparison with existing work', 'Implications'] },
        { heading: '6. Conclusion', points: ['Summary of findings', 'Recommendations', 'Future research directions'] }
      ]
    }
  }),

  generatePPTOutline: (topic) => ({
    slides: [
      { slideNumber: 1, title: 'Title Slide', points: [topic, 'Team Name', 'Date'] },
      { slideNumber: 2, title: 'Problem Statement', points: ['Define the problem', 'Why it matters', 'Who is affected'] },
      { slideNumber: 3, title: 'Our Solution', points: ['Solution overview', 'Key innovation', 'Value proposition'] },
      { slideNumber: 4, title: 'Technical Architecture', points: ['System design', 'Tech stack', 'Data flow'] },
      { slideNumber: 5, title: 'Features Demo', points: ['Core feature 1', 'Core feature 2', 'Core feature 3'] },
      { slideNumber: 6, title: 'Market Analysis', points: ['Target audience', 'Competitor comparison', 'Market opportunity'] },
      { slideNumber: 7, title: 'Impact & Results', points: ['Metrics', 'User feedback', 'Performance data'] },
      { slideNumber: 8, title: 'Roadmap', points: ['Current stage', 'Next milestones', 'Long-term vision'] },
      { slideNumber: 9, title: 'Team', points: ['Team members', 'Roles and expertise', 'Advisors'] },
      { slideNumber: 10, title: 'Q&A', points: ['Thank you', 'Contact information', 'Links'] }
    ]
  })
};

// ─── Real Claude API Calls ─────────────────────────────────────────

let anthropicClient = null;

const getClient = async () => {
  if (!anthropicClient) {
    const Anthropic = (await import('@anthropic-ai/sdk')).default;
    anthropicClient = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }
  return anthropicClient;
};

const callClaude = async (systemPrompt, userMessage) => {
  const client = await getClient();
  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 2048,
    system: systemPrompt,
    messages: [{ role: 'user', content: userMessage }]
  });
  return response.content[0].text;
};

// ─── Public API ────────────────────────────────────────────────────

export const aiService = {
  async summarizeNotes(content) {
    if (isMockMode()) return mockResponses.summarizeNotes(content);
    
    const result = await callClaude(
      'You are a helpful assistant that summarizes meeting/project notes into clear bullet points. Return only the summary.',
      `Summarize these notes:\n\n${content}`
    );
    return { summary: result };
  },

  async extractActionPoints(content) {
    if (isMockMode()) return mockResponses.extractActionPoints(content);
    
    const result = await callClaude(
      'Extract actionable tasks from the given notes. Return a JSON array of strings. Only return the JSON array, no other text.',
      `Extract action points from:\n\n${content}`
    );
    return { actionPoints: JSON.parse(result) };
  },

  async clusterIdeas(content) {
    if (isMockMode()) return mockResponses.clusterIdeas(content);
    
    const result = await callClaude(
      'Group the ideas in the given notes into themed clusters. Return a JSON array of objects with "theme" (string) and "ideas" (array of strings). Only return the JSON array.',
      `Cluster the ideas in:\n\n${content}`
    );
    return { clusters: JSON.parse(result) };
  },

  async suggestTasks(projectDescription, existingTasks = []) {
    if (isMockMode()) return mockResponses.suggestTasks(projectDescription, existingTasks);
    
    const result = await callClaude(
      'Suggest project tasks based on the description. Return a JSON array of objects with "title", "skillTag" (one of: coding, design, research, writing, ppt, testing, data-analysis, communication), "priority" (low/medium/high), and "description". Only return the JSON array.',
      `Project: ${projectDescription}\n\nExisting tasks: ${existingTasks.map(t => t.title).join(', ')}\n\nSuggest 4-6 new tasks.`
    );
    return { tasks: JSON.parse(result) };
  },

  async analyzeMeeting(transcript) {
    if (isMockMode()) return mockResponses.analyzeMeeting(transcript);
    
    const result = await callClaude(
      'Analyze this meeting transcript. Return a JSON object with "summary" (string), "decisions" (array of strings), and "actionItems" (array of objects with "task" and "assignee" strings). Only return the JSON object.',
      `Meeting transcript:\n\n${transcript}`
    );
    return JSON.parse(result);
  },

  async generateResearchOutline(topic) {
    if (isMockMode()) return mockResponses.generateResearchOutline(topic);
    
    const result = await callClaude(
      'Generate a structured research report outline. Return a JSON object with "title" (string) and "sections" (array of objects with "heading" and "points" array). Only return the JSON object.',
      `Create a research outline for: ${topic}`
    );
    return { outline: JSON.parse(result) };
  },

  async generatePPTOutline(topic) {
    if (isMockMode()) return mockResponses.generatePPTOutline(topic);
    
    const result = await callClaude(
      'Generate a presentation slide outline. Return a JSON object with "slides" (array of objects with "slideNumber", "title", and "points" array). Only return the JSON object.',
      `Create a PPT outline for: ${topic}`
    );
    return JSON.parse(result);
  }
};

export default aiService;
