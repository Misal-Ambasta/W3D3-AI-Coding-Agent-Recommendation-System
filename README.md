# AI Coding Agent Recommendation System

A sophisticated web application that recommends the best AI coding agents for your specific programming tasks. Built with modern technologies and featuring a beautiful glassmorphism UI design.

## 🚀 Features

### Core Functionality
- **Smart Task Analysis**: Analyzes natural language task descriptions to understand requirements
- **Intelligent Recommendations**: Provides top 3 AI coding agent recommendations with detailed scoring
- **Multiple Strategies**: Choose from different recommendation strategies (Best Overall, Beginner Friendly, Enterprise Ready, Budget Conscious)
- **Advanced Filtering**: Filter by budget, experience level, and team size
- **Detailed Scoring**: Transparent scoring breakdown across 5 key factors

### Scoring Algorithm
The system uses a weighted scoring algorithm with the following factors:

1. **Language Proficiency Match (30%)**
   - Exact language match: 100 points
   - Similar language family: 70 points
   - Basic support: 40 points

2. **Task Complexity Alignment (25%)**
   - Matches agent complexity rating with task requirements
   - Considers beginner-friendly vs advanced capabilities

3. **Use Case Specificity (20%)**
   - Direct use case match: 100 points
   - Related use case: 60 points
   - Generic capability: 30 points

4. **Integration & Workflow (15%)**
   - IDE compatibility
   - Team collaboration features
   - Setup complexity vs user experience

5. **Performance & Reliability (10%)**
   - Response time
   - Code quality metrics
   - User satisfaction scores

### Supported AI Coding Agents
- **GitHub Copilot** - AI pair programmer with excellent code completion
- **Cursor** - AI-first code editor with advanced generation capabilities
- **Replit Ghostwriter** - Cloud-based AI coding assistant
- **Amazon CodeWhisperer** - Security-focused code generator
- **Tabnine** - Privacy-focused AI completion tool
- **Codeium** - Free AI-powered code acceleration
- **OpenAI Codex** - GPT-based code generation
- **Sourcegraph Cody** - Deep codebase understanding

## Screenshots

![screencapture-localhost-5173-2025-06-28-18_42_27](https://github.com/user-attachments/assets/12c80630-115c-421e-8f79-8d2695928a31)

![screencapture-localhost-5173-2025-06-28-18_42_14](https://github.com/user-attachments/assets/806ef9bb-6dbd-4c9e-9335-cbffc18a636b)

## 🛠️ Technology Stack

### Backend
- **Node.js** with Express.js
- **Natural Language Processing** with `natural` and `compromise` libraries
- **RESTful API** with comprehensive error handling
- **JSON-based data storage** for agent information

### Frontend
- **React 19** with TypeScript
- **Tailwind CSS** for styling
- **Framer Motion** for smooth animations
- **Lucide React** for beautiful icons
- **Glassmorphism design** with dark theme

### Key Libraries
- `natural` - Natural language processing
- `compromise` - Text analysis and entity extraction
- `framer-motion` - Animation library
- `lucide-react` - Icon library

## 📦 Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Backend Setup
```bash
cd backend
npm install
npm run dev
```

The backend will start on `http://localhost:3001`

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

The frontend will start on `http://localhost:5173`

### Environment Variables
Create a `.env` file in the frontend directory:
```env
VITE_API_URL=http://localhost:3001/api/v1
```

## 🎯 Usage

1. **Describe Your Task**: Enter a detailed description of your coding task
2. **Choose Strategy**: Select a recommendation strategy based on your needs
3. **Apply Filters**: Use advanced filters to narrow down options
4. **Get Recommendations**: Receive personalized top 3 agent recommendations
5. **Review Details**: Explore detailed scoring, reasoning, and agent capabilities

### Example Task Descriptions
- "Build a React web application with TypeScript and Tailwind CSS"
- "Create a Python REST API with database integration and authentication"
- "Develop a mobile app using React Native with real-time features"
- "Set up a CI/CD pipeline with Docker and Kubernetes"

## 🔧 API Endpoints

### Core Endpoints
- `POST /api/v1/recommend` - Get agent recommendations
- `GET /api/v1/agents` - List all agents with filtering
- `GET /api/v1/agents/:id` - Get specific agent details
- `POST /api/v1/analyze` - Analyze task without recommendations
- `GET /api/v1/metadata` - Get system metadata and strategies

### Health Check
- `GET /api/health` - Server health status

## 🎨 UI Features

### Design System
- **Glassmorphism**: Modern frosted glass effect with backdrop blur
- **Dark Theme**: Elegant dark color scheme with accent colors
- **Responsive**: Mobile-first design that works on all devices
- **Animations**: Smooth transitions and micro-interactions
- **Typography**: Inter and Poppins fonts for optimal readability

### Interactive Elements
- **Quick Select Buttons**: Pre-defined common project types
- **Expandable Cards**: Detailed information on demand
- **Real-time Feedback**: Loading states and error handling
- **Score Visualization**: Color-coded scoring badges

## 📊 Data Structure

The system uses a comprehensive JSON database with detailed agent information:

```json
{
  "agents": [
    {
      "id": "agent-id",
      "name": "Agent Name",
      "languages": { "javascript": 95, "python": 90 },
      "strengths": ["Feature 1", "Feature 2"],
      "weaknesses": ["Limitation 1", "Limitation 2"],
      "pricing": { "free_tier": true, "individual": 10 },
      "performance_metrics": { "response_time_ms": 150, "accuracy_score": 85 }
    }
  ]
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the ISC License.

## 🙏 Acknowledgments

- Built for educational and demonstration purposes
- Inspired by the growing ecosystem of AI coding assistants
- Uses modern web development best practices

---

**Note**: This is a demonstration system. The agent data is for educational purposes and may not reflect current pricing or capabilities of the actual services.
