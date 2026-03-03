<div align="center">

# 🎯 ConflictCoach AI

### _Master Conflict Resolution Through AI-Powered Voice Simulations_

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-conflict--coach--ai.vercel.app-00C7B7?style=for-the-badge)](https://conflict-coach-ai.vercel.app/)
[![Made with Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Powered by ElevenLabs](https://img.shields.io/badge/ElevenLabs-AI_Voice-6C5DD3?style=for-the-badge)](https://elevenlabs.io/)
[![Gemini AI](https://img.shields.io/badge/Google_Gemini-AI_Analysis-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://deepmind.google/technologies/gemini/)

**[🚀 Live Demo](https://conflict-coach-ai.vercel.app/)** • **[📖 Documentation](./SETUP.md)** • **[🐛 Report Bug](https://github.com/yourusername/ConflictCoachAI/issues)** • **[✨ Request Feature](https://github.com/yourusername/ConflictCoachAI/issues)**

---

_Developed with ❤️ by_ **[BlockNexa Labs](https://github.com/BlockNexa)** 🏢

</div>

---

## 🌟 What is ConflictCoach AI?

**ConflictCoach AI** is a revolutionary, AI-powered voice training simulator that empowers professionals to master **conflict resolution** and **customer de-escalation** techniques through realistic, interactive conversations.

🎭 **Practice real-world scenarios** in a safe, judgment-free environment  
🧠 **Get instant AI feedback** on your communication approach  
📈 **Track your progress** with detailed performance analytics  
🎯 **Build confidence** before facing real conflicts

Whether you're in customer service, management, healthcare, or any field requiring strong interpersonal skills, ConflictCoach AI helps you develop the soft skills that matter most.

---

## ✨ Key Features

<table>
<tr>
<td width="50%">

### 🎤 **Real-Time Voice Interaction**

Engage in natural voice conversations powered by **ElevenLabs AI**. Experience realistic dialogue with emotionally intelligent responses that adapt to your tone and approach.

### 🧠 **Intelligent AI Feedback**

Get instant, detailed analysis from **Google Gemini AI** on:

- Communication effectiveness
- Emotional intelligence
- De-escalation techniques
- Areas for improvement

### 📊 **Performance Analytics**

Track your progress with comprehensive metrics:

- Conversation success rates
- Stress management scores
- Technique effectiveness
- Historical performance trends

</td>
<td width="50%">

### 🎯 **Scenario-Based Training**

Practice with diverse, real-world scenarios:

- 😤 Angry customer complaints
- 💼 Workplace disagreements
- 📞 Service escalations
- 🤝 Team conflicts
- And many more...

### 💡 **Adaptive Learning System**

AI dynamically adjusts difficulty based on your performance, ensuring you're always challenged but never overwhelmed.

### 🎨 **Modern, Intuitive UI**

Beautiful interface with:

- Smooth animations (Framer Motion)
- Responsive design
- Real-time visual feedback
- Accessible components (shadcn/ui)

</td>
</tr>
</table>

---

## 🚀 Quick Start

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18.x or higher → [Download here](https://nodejs.org/)
- **npm**, **yarn**, or **bun** package manager
- **API Keys** for:
  - [ElevenLabs](https://elevenlabs.io/) (for AI voice)
  - [Google Gemini](https://ai.google.dev/) (for AI analysis)

### 📦 Installation

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/ConflictCoachAI.git

# 2. Navigate to project directory
cd ConflictCoachAI

# 3. Install dependencies
npm install
# or with bun
bun install
# or with yarn
yarn install

# 4. Set up environment variables
cp .env.example .env
# Edit .env with your API keys:
# NEXT_PUBLIC_ELEVENLABS_API_KEY=your_elevenlabs_key
# GOOGLE_GEMINI_API_KEY=your_gemini_key

# 5. Run the development server
npm run dev
# or with bun
bun dev
```

**🎉 Visit [http://localhost:3000](http://localhost:3000) to see your application!**

---

## 🛠️ Tech Stack

<div align="center">

| Technology                                                                                          | Purpose         | Why We Use It                                    |
| :-------------------------------------------------------------------------------------------------- | :-------------- | :----------------------------------------------- |
| ![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)                              | React Framework | Server-side rendering, routing, and optimization |
| ![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript&logoColor=white)   | Type Safety     | Catch errors early and improve code quality      |
| ![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)                   | UI Library      | Component-based, reactive UI development         |
| ![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwind-css&logoColor=white) | Styling         | Utility-first CSS for rapid UI development       |
| ![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-Latest-000000)                                | UI Components   | Beautiful, accessible component library          |
| ![ElevenLabs](https://img.shields.io/badge/ElevenLabs-API-6C5DD3)                                   | AI Voice        | Ultra-realistic voice synthesis                  |
| ![Gemini](https://img.shields.io/badge/Google_Gemini-AI-4285F4?logo=google&logoColor=white)         | NLP & Analysis  | Advanced language understanding and feedback     |
| ![Framer Motion](https://img.shields.io/badge/Framer_Motion-10-FF0055?logo=framer)                  | Animations      | Smooth, professional animations                  |
| ![Vercel](https://img.shields.io/badge/Vercel-Hosting-000000?logo=vercel)                           | Deployment      | Fast, reliable hosting with CI/CD                |

</div>

---

## 📂 Project Structure

```
ConflictCoachAI/
│
├── 📱 app/                      # Next.js App Directory
│   ├── api/                    # API Routes
│   │   └── analyze/            # AI analysis endpoint
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Home page
│   └── globals.css             # Global styles
│
├── 🧩 components/              # React Components
│   ├── ui/                     # shadcn/ui base components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   └── ...                 # 40+ UI components
│   ├── ControlDock.tsx         # Voice control interface
│   ├── VoiceOrb.tsx            # Animated voice visualizer
│   ├── FeedbackBox.tsx         # AI feedback display
│   ├── ScoreCard.tsx           # Performance metrics
│   └── ...                     # More feature components
│
├── ⚙️ config/                   # Configuration
│   └── scenarios.ts            # Training scenario definitions
│
├── 🔌 context/                  # React Context
│   └── AuthContext.tsx         # Authentication state
│
├── 🪝 hooks/                    # Custom React Hooks
│   ├── use-mobile.tsx          # Mobile detection
│   └── use-toast.ts            # Toast notifications
│
├── 📚 lib/                      # Utility Functions
│   ├── utils.ts                # Helper functions
│   └── conversation-utils.ts   # Conversation logic
│
├── 📝 types/                    # TypeScript Types
│   └── index.ts                # Type definitions
│
├── 🎨 public/                   # Static Assets
│   └── robots.txt
│
└── 📄 Configuration Files
    ├── package.json
    ├── tsconfig.json
    ├── tailwind.config.ts
    ├── next.config.js
    └── ...
```

---

## 🎯 How to Use

### 1️⃣ **Choose Your Scenario**

Browse through various conflict resolution scenarios tailored to different professional contexts.

### 2️⃣ **Start the Conversation**

Click the microphone button and begin speaking naturally with the AI coach.

### 3️⃣ **Engage Authentically**

Respond to the AI's prompts using your own words and approach – the AI adapts to your style.

### 4️⃣ **Receive Real-Time Feedback**

As you progress, receive instant insights on your:

- Tone and emotional control
- Active listening skills
- Problem-solving approach
- De-escalation effectiveness

### 5️⃣ **Review Your Performance**

After each session, analyze detailed metrics and recommendations for improvement.

### 6️⃣ **Practice & Improve**

Repeat scenarios to master different techniques and track your skill development over time.

---

## 🌐 Deployment

### Deploy to Vercel (Recommended)

The easiest way to deploy ConflictCoach AI is using Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/ConflictCoachAI)

**Or manually:**

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod
```

### Other Deployment Options

ConflictCoach AI can also be deployed to:

- **Netlify** - Connect your Git repository
- **AWS Amplify** - Use the Amplify Console
- **Railway** - Deploy with zero configuration
- **Cloudflare Pages** - Edge-optimized hosting

**Don't forget to set your environment variables in your hosting platform!**

---

## 🤝 Contributing

We welcome contributions from the community! Whether it's bug fixes, new features, or documentation improvements, every contribution helps make ConflictCoach AI better.

### How to Contribute

1. **Fork the repository**

   ```bash
   # Click the 'Fork' button at the top of this page
   ```

2. **Clone your fork**

   ```bash
   git clone https://github.com/YOUR_USERNAME/ConflictCoachAI.git
   cd ConflictCoachAI
   ```

3. **Create a feature branch**

   ```bash
   git checkout -b feature/amazing-new-feature
   ```

4. **Make your changes and commit**

   ```bash
   git add .
   git commit -m "✨ Add amazing new feature"
   ```

5. **Push to your fork**

   ```bash
   git push origin feature/amazing-new-feature
   ```

6. **Open a Pull Request**
   - Go to the original repository
   - Click "New Pull Request"
   - Describe your changes in detail

### Contribution Guidelines

- ✅ Follow the existing code style
- ✅ Write clear commit messages
- ✅ Add tests for new features
- ✅ Update documentation as needed
- ✅ Be respectful and constructive

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

```
MIT License - Feel free to use this project for personal or commercial purposes!
```

---

## 🙏 Acknowledgments

We're grateful to these amazing technologies and communities:

- 🎤 **[ElevenLabs](https://elevenlabs.io/)** - For their exceptional AI voice synthesis technology
- 🧠 **[Google Gemini](https://ai.google.dev/)** - For powerful natural language understanding
- 🎨 **[shadcn/ui](https://ui.shadcn.com/)** - For beautiful, accessible component primitives
- ⚡ **[Vercel](https://vercel.com/)** - For seamless deployment and hosting
- 🎭 **[Framer Motion](https://www.framer.com/motion/)** - For buttery-smooth animations
- 💅 **[Tailwind CSS](https://tailwindcss.com/)** - For the utility-first CSS framework
- ⚛️ **[React Team](https://react.dev/)** - For the amazing UI library
- 🔷 **[Next.js Team](https://nextjs.org/)** - For the powerful React framework

---

## 📞 Contact & Support

<div align="center">

### Need Help? Have Questions?

[![Live Demo](https://img.shields.io/badge/🌐_Try_Live_Demo-Visit_Now-00C7B7?style=for-the-badge)](https://conflict-coach-ai.vercel.app/)
[![Report Bug](https://img.shields.io/badge/🐛_Report_Bug-GitHub_Issues-red?style=for-the-badge)](https://github.com/yourusername/ConflictCoachAI/issues)
[![Feature Request](https://img.shields.io/badge/✨_Feature_Request-GitHub_Issues-blue?style=for-the-badge)](https://github.com/yourusername/ConflictCoachAI/issues)

**Built with ❤️ by [BlockNexa Labs](https://github.com/BlockNexa)**

---

### ⭐ Star us on GitHub — it motivates us a lot!

[![GitHub stars](https://img.shields.io/github/stars/yourusername/ConflictCoachAI?style=social)](https://github.com/yourusername/ConflictCoachAI/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/yourusername/ConflictCoachAI?style=social)](https://github.com/yourusername/ConflictCoachAI/network/members)
[![GitHub watchers](https://img.shields.io/github/watchers/yourusername/ConflictCoachAI?style=social)](https://github.com/yourusername/ConflictCoachAI/watchers)

_Made with 💖 for professionals who want to excel in conflict resolution_

</div>
