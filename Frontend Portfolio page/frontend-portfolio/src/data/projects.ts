import type { FrontendProject } from '../types/project';

const projects: FrontendProject[] = [
  {
    id: "1",
    title: "JobBoardX",
    description: "A full-stack job board platform that connects job seekers with employers, inspired by platforms like LinkedIn and AngelList.",
    techStack: ["React", "TypeScript", "Node.js", "Express", "MongoDB", "MUI", "styled-components"],
    liveDemoUrl: "https://jobboardx-woad.vercel.app/",
    githubUrl: "https://github.com/ManishG359/HiringHood",
    features: [
      "Role-based authentication (Job Seeker / Employer)",
      "JWT-secured API with protected routes",
      "Profile management with resume link",
      "Job CRUD operations",
      "Advanced job filtering & search",
      "Employer applicant management",
      "Responsive UI with dashboard-style layout",
      "Email notification system"
    ],
    challenges: [
      "Dynamic filtering with pagination and search",
      "Role-based protected route setup in frontend",
      "Maintaining clean architecture with scalable folders",
      "Handling status updates for job applications"
    ],
    screenshots: [
      "/assets/landing-page.png",
      "/assets/seeker-dashboard.png",
      "/assets/employer-dashboard.png",
      "/assets/view-applicants.png",
      "/assets/browse-job.png"
    ]
  },
  {
    id: "2",
    title: "Admin Dashboard for Post Management",
    description: "A full-stack blog CMS with role-based access, post moderation, and user management.",
    techStack: ["React", "Redux Toolkit", "Express", "MongoDB", "Render", "Vercel"],
    liveDemoUrl: "https://cms-admin-dashboard-or4d.vercel.app",
    githubUrl: "https://github.com/ManishG359/HiringHood/tree/main/S2_16_APR_86cygrb67",
    features: [
      "Role-based login (admin/editor)",
      "Post CRUD with rich text",
      "User management & dashboard stats",
      "RTK Query for data fetching",
      "Fully responsive UI"
    ],
    challenges: [
      "CORS & deployment sync between frontend and backend",
      "RTK Query integration with dynamic base URL",
      "Secure JWT authentication with persistent login"
    ],
    screenshots: ["/assets/admin-dashboard-preview.png"] 
  },
  
  {
    id: "3",
    title: "IoT SmartBin Project",
    description: "Smart waste management solution using IoT-enabled dustbins integrated with a responsive web platform.",
    techStack: [ "Blynk", "OutSystems", "HTML/CSS", "JavaScript"],
    liveDemoUrl: "https://sscc2024.com/waste-management-using-iot-applications-and-a-reactive-webpage/",
    githubUrl: "https://github.com/Manishchandra18",  
    features: [
      "Real-time bin level monitoring",
      "Auto-opening lid using sensors",
      "User complaint portal",
      "Dustbin request and location tracking"
    ],
    challenges: [
      "Sensor calibration in outdoor conditions",
      "Integration with Blynk and real-time updates",
      "Low-cost, scalable deployment"
    ],
    screenshots: ["/assets/smartbin-preview.png"]  
  }
  
];

export default projects;
