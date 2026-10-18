/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Portfolio seed data used when initializing a new database (MVC Architecture)
 * Contains seed records for Projects, Certificates (in 4 Categories),
 * Skills, Experiences, Messages, and Authenticated Users.
 */
class InMemoryDatabase {
  projects = [];
  certificates = [];
  skills = [];
  experiences = [];
  messages = [];
  constructor() {
    this.seedDatabase();
  }
  seedDatabase() {
    this.projects = [
      {
        id: 1,
        title: "AI-Powered Evangadi Forum & Technical Discussion Platform",
        slug: "ai-evangadi-forum",
        layer: "Full-Stack",
        category: "AI & Community / Q&A Platform",
        status: "Live & Deployed",
        overview: "Full-stack developer community and technical Q&A discussion platform powered by conversational AI assistance. Features threaded discussions, AI-answered question resolution, user reputation badges, and normalized relational persistence.",
        client_name: "Evangadi Tech Network",
        role_title: "Full-Stack Lead Engineer",
        outcome: "Built responsive AI query resolution, real-time question voting, user authentication, and sub-40ms thread queries.",
        frontend_stack: "React 19, JavaScript, Tailwind CSS, Axios, Context API",
        backend_stack: "Node.js, Express MVC, OpenAI / Gemini AI API, MySQL 8.0, JWT RBAC",
        infra_stack: "Vercel Edge Network, GitHub Actions CI/CD",
        image_url: "/frontend/assets/images/evangadi_ai_forum.jpg",
        live_url: "https://evangadi-form.vercel.app/",
        repo_url: "https://github.com/Eliyas-wakjira/evangadi-forum-fullstack",
        is_featured: true,
        sort_order: 1
      },
      {
        id: 2,
        title: "ChatGPT Conversational AI Platform Clone",
        slug: "chatgpt-conversational-ai-clone",
        layer: "Full-Stack",
        category: "AI / Conversational Platform",
        status: "Live & Deployed",
        overview: "Modern conversational AI chat platform featuring streaming token responses, syntax-highlighted code blocks, multi-session thread history, persistent database storage, and responsive dark theme.",
        client_name: "Generative AI Showcase",
        role_title: "Full-Stack AI Systems Developer",
        outcome: "Engineered SSE streaming with sub-180ms first token latency, markdown code rendering, and mobile-friendly conversation drawer.",
        frontend_stack: "React 19, JavaScript, Tailwind CSS, Lucide Icons, SyntaxHighlighter",
        backend_stack: "Node.js, Express.js MVC, OpenAI / Gemini API, SSE Streaming",
        infra_stack: "Netlify Edge Platform, GitHub Actions CI/CD",
        image_url: "/frontend/assets/images/project_chatgpt.jpg",
        live_url: "https://chatgpclon.netlify.app/",
        repo_url: "https://github.com/Eliyas-wakjira/chatgpt-fullstack-clone",
        is_featured: true,
        sort_order: 2
      },
      {
        id: 3,
        title: "Netflix Streaming Experience Clone - TMDB API",
        slug: "netflix-streaming-platform-clone",
        layer: "Frontend",
        category: "Media / Video Streaming",
        status: "Live & Deployed",
        overview: "Cinematic movie and series streaming web showcase consuming live TMDB REST APIs with interactive hero video billboard, multi-row category carousels, and embedded YouTube trailer playback.",
        client_name: "Entertainment Web Showcase",
        role_title: "Frontend JavaScript Developer",
        outcome: "Delivered smooth 60fps horizontal carousel scrolling, dynamic trailer popups, and client-side caching with sub-60ms response time.",
        frontend_stack: "React 19, JavaScript, Axios, Tailwind CSS, React-YouTube",
        backend_stack: "Node.js API Proxy, TMDB RESTful API",
        infra_stack: "Netlify Edge Platform, GitHub Actions CI/CD",
        image_url: "/frontend/assets/images/project_netflix.jpg",
        live_url: "https://eliyas-netflex-clone.netlify.app/",
        repo_url: "https://github.com/Eliyas-wakjira/netflix-clone-frontend-api",
        is_featured: true,
        sort_order: 3
      },
      {
        id: 4,
        title: "Akmonlink College Official Website & Portal",
        slug: "akmonlink-college-portal",
        layer: "Full-Stack",
        category: "Higher Education / Academic Portal",
        status: "Future Project / Pipeline",
        overview: "Official collegiate academic portal for Akmonlink College, featuring undergraduate faculty directories, online admissions application pipeline, campus event calendars, and departmental resource centers.",
        client_name: "Akmonlink Higher Education Institution",
        role_title: "Principal Web Architect",
        outcome: "Designed scalable multi-faculty web portal architecture with online student application intake and verified academic publication index.",
        frontend_stack: "Next.js 15, React 19, TypeScript, Tailwind CSS",
        backend_stack: "Node.js, Express MVC, MySQL 8.0 Relational DB, Redis",
        infra_stack: "Akmonlink Domain (.edu.et), Cloudflare DNS, NGINX SSL, Linux Server",
        image_url: "/frontend/assets/images/akmonlink_college.jpg",
        live_url: "https://www.akmonlink.edu.et",
        repo_url: "https://github.com/Eliyas-wakjira/akmonlink-college-portal",
        is_featured: true,
        sort_order: 4
      },
      {
        id: 5,
        title: "Ginchi Polytechnic College Digital Campus",
        slug: "ginchi-polytechnic-college",
        layer: "Full-Stack",
        category: "TVET / Technical Engineering",
        status: "Future Project / Pipeline",
        overview: "Comprehensive institutional web platform for Ginchi Polytechnic College, unifying technical vocational education (TVET) training curricula, engineering lab reservations, occupational competency rubrics, and trainee admissions.",
        client_name: "Ginchi Polytechnic College Directorate",
        role_title: "Lead Systems & Collegiate Architect",
        outcome: "Digitized 12 occupational training programs, institutional announcements, and TVET trainer portfolio management.",
        frontend_stack: "React 19, JavaScript, Tailwind CSS, Lucide Icons",
        backend_stack: "Node.js, Express.js MVC, MySQL 8.0 Relational DB",
        infra_stack: "Ethiopian Academic Domain (.edu.et), NGINX Reverse Proxy, Linux Server",
        image_url: "/frontend/assets/images/ginchi_polytechnic.jpg",
        live_url: "https://ginchipoly.edu.et",
        repo_url: "https://github.com/Eliyas-wakjira/ginchipoly-college-platform",
        is_featured: true,
        sort_order: 5
      },
      {
        id: 6,
        title: "Akmon Academy Preparatory & Secondary Web Portal",
        slug: "akmon-academy-portal",
        layer: "Frontend + Backend",
        category: "Secondary & Preparatory Education",
        status: "Future Project / Pipeline",
        overview: "Modern secondary academy web portal featuring digital curriculum guides, interactive STEM lab showcases, parent communication bulletins, and extracurricular student club directories.",
        client_name: "Akmon Academy Board of Education",
        role_title: "Full-Stack Developer",
        outcome: "Architected modern responsive portal for prospective student intake, academic calendar, and parent information hub.",
        frontend_stack: "React 19, Next.js, Tailwind CSS, Framer Motion",
        backend_stack: "Node.js, Express MVC, MySQL Database, Email API",
        infra_stack: "Akmon Academy Domain (.edu.et), Cloudflare Edge, NGINX",
        image_url: "/frontend/assets/images/akmon_academy.jpg",
        live_url: "https://akmonacademy.edu.et",
        repo_url: "https://github.com/Eliyas-wakjira/akmon-academy-web",
        is_featured: false,
        sort_order: 6
      },
      {
        id: 7,
        title: "Akmonlink College Enterprise LMS & ERP System",
        slug: "akmonlink-college-lms-system",
        layer: "Full-Stack",
        category: "Enterprise / College LMS ERP",
        status: "Future Project / Pipeline",
        overview: "Comprehensive collegiate Learning Management System and Student Information ERP uniting academic semester enrollment, weighted gradebook calculations, daily attendance tracking, instructor syllabus distribution, and student portal dashboards with strict role-based access control.",
        client_name: "Akmonlink College Academic Affairs",
        role_title: "Principal Full-Stack Architect",
        outcome: "Unified academic modules for 10,000+ student profiles with ACID transactional integrity, automated GPA calculation, and attendance roll-calls.",
        frontend_stack: "Next.js 15, React 19, TypeScript, Tailwind CSS, Chart.js",
        backend_stack: "Node.js, Express MVC, MySQL 8.0 ACID Transactions, JWT RBAC, Redis",
        infra_stack: "Docker Compose, AWS EC2 & RDS MySQL, GitHub Actions CI/CD",
        image_url: "/frontend/assets/images/akmonlink_lms.jpg",
        live_url: "https://www.akmonlink.edu.et",
        repo_url: "https://github.com/Eliyas-wakjira/akmonlink-college-lms",
        is_featured: true,
        sort_order: 7
      },
      {
        id: 8,
        title: "Apple.com Official Web Experience Clone",
        slug: "apple-clone-frontend",
        layer: "Frontend",
        category: "Consumer Electronics / Web Experience",
        status: "Live & Deployed",
        overview: "Pixel-accurate responsive frontend recreation of Apple’s global desktop and mobile navigation ecosystem, dynamic promotional banners, and product showcase carousels.",
        client_name: "Independent Showcase",
        role_title: "Lead Frontend Developer",
        outcome: "Delivered 60fps responsive animations, sub-1.2s page load, and complete keyboard/screen reader accessibility compliance.",
        frontend_stack: "React 19, JavaScript, CSS3 Media Queries, Tailwind CSS, Lucide Icons",
        backend_stack: "Static Site Architecture, Headless Asset Pipeline",
        infra_stack: "Vercel Edge Network, GitHub Actions CI/CD",
        image_url: "/frontend/assets/images/project_apple.jpg",
        live_url: "https://apple-clone-eliyas.netlify.app",
        repo_url: "https://github.com/Eliyas-wakjira/apple-clone-frontend",
        is_featured: false,
        sort_order: 8
      }
    ];
    this.certificates = [
      // 1. TECHNOLOGY
      {
        id: 1,
        title: "AWS Certified Solutions Architect - Associate",
        issuer: "Amazon Web Services (AWS)",
        year: "2024",
        issue_date: "2024-04-18",
        expiry_date: "2027-04-18",
        credential_id: "AWS-PSA-98214",
        credential_url: "https://aws.amazon.com/certification/certified-solutions-architect-associate/",
        category: "Technology",
        category_number: 1,
        visibility: "Public",
        description: "Design and deployment of robust, secure, scalable, and highly available cloud applications and distributed database topologies on AWS infrastructure.",
        skills_acquired: ["AWS EC2", "S3", "RDS MySQL", "VPC", "IAM", "CloudFront", "Route53", "Auto-Scaling"],
        file_url: "/frontend/assets/images/hero_eliyas_workstation_1791918969286.jpg",
        file_name: "aws_certified_solutions_architect.pdf",
        file_type: "pdf"
      },
      {
        id: 2,
        title: "Full-Stack Software Engineering Professional Specialization",
        issuer: "Meta / Coursera Professional Specialization",
        year: "2023",
        issue_date: "2023-11-20",
        expiry_date: "Does not expire",
        credential_id: "META-SE-774128",
        credential_url: "https://coursera.org/verify/professional-cert/meta-full-stack",
        category: "Technology",
        category_number: 1,
        visibility: "Public",
        description: "Comprehensive software engineering specialization covering React 19, Node.js, Express MVC, relational databases, test-driven development, and CI/CD automation.",
        skills_acquired: ["React 19", "Next.js", "Node.js", "Express MVC", "MySQL", "REST APIs", "Git", "Testing"],
        file_url: "/frontend/assets/images/project_chatgpt_clone_1791918970987.jpg",
        file_name: "meta_full_stack_software_engineer.pdf",
        file_type: "pdf"
      },
      {
        id: 3,
        title: "Cisco Certified Network Associate (CCNA 200-301)",
        issuer: "Cisco Systems",
        year: "2023",
        issue_date: "2023-08-14",
        expiry_date: "2026-08-14",
        credential_id: "CSCO-14289052",
        credential_url: "https://www.cisco.com/c/en/us/training-events/career-certifications.html",
        category: "Technology",
        category_number: 1,
        visibility: "Public",
        description: "Comprehensive enterprise network fundamentals, IPv4/IPv6 routing, VLAN switching, IP services, security fundamentals, Cisco IOS, and network programmability.",
        skills_acquired: ["Routing Protocols", "VLAN Switching", "OSPF", "Subnetting", "ACLs", "Cisco IOS", "IPv6"],
        file_url: "/frontend/assets/images/hero_eliyas_workstation_1791918969286.jpg",
        file_name: "cisco_ccna_certification.pdf",
        file_type: "pdf"
      },
      {
        id: 4,
        title: "MySQL Database Administrator & Developer Certification",
        issuer: "Oracle University",
        year: "2023",
        issue_date: "2023-05-10",
        expiry_date: "Does not expire",
        credential_id: "ORCL-DB-54129",
        credential_url: "https://education.oracle.com/mysql",
        category: "Technology",
        category_number: 1,
        visibility: "Public",
        description: "Advanced relational database architecture, Boyce-Codd normal form, indexing strategies, query execution plan tuning, replication, and ACID transaction isolation.",
        skills_acquired: ["MySQL 8.0", "SQL Query Optimization", "Index Tuning", "InnoDB Engine", "Transactions", "Backups"],
        file_url: "/frontend/assets/images/project_eschool_erp_1791918972002.jpg",
        file_name: "oracle_mysql_database_administrator.pdf",
        file_type: "pdf"
      },
      {
        id: 5,
        title: "CompTIA Linux+ Certified Professional",
        issuer: "CompTIA",
        year: "2022",
        issue_date: "2022-10-05",
        expiry_date: "2025-10-05",
        credential_id: "COMP001029381",
        credential_url: "https://www.comptia.org/certifications/linux",
        category: "Technology",
        category_number: 1,
        visibility: "Public",
        description: "Enterprise Linux server management, shell scripting, systemd service orchestration, storage configuration, firewall security, and kernel performance optimization.",
        skills_acquired: ["Bash Scripting", "Ubuntu/Debian", "Systemd", "Storage & LVM", "SSH Security", "NGINX"],
        file_url: "/frontend/assets/images/project_netflix_clone_1791918972434.jpg",
        file_name: "comptia_linux_plus.pdf",
        file_type: "pdf"
      },
      // 2. EDUCATION
      {
        id: 6,
        title: "Higher Diploma in Technical & Vocational Collegiate Instruction (HDP)",
        issuer: "Federal TVET Institute / Ministry of Education",
        year: "2022",
        issue_date: "2022-07-28",
        expiry_date: "Does not expire",
        credential_id: "HDP-PED-04192",
        credential_url: "https://moe.gov.et",
        category: "Education",
        category_number: 2,
        visibility: "Public",
        description: "Pedagogy, competency-based curriculum development, ICT laboratory management, and technical instruction methodology in computing and engineering education.",
        skills_acquired: ["Curriculum Architecture", "Technical Pedagogy", "Lab Mentorship", "Student Evaluation"],
        file_url: "/frontend/assets/images/project_apple_clone_1791918969741.jpg",
        file_name: "higher_diploma_technical_instruction.png",
        file_type: "image"
      },
      {
        id: 7,
        title: "Collegiate Pedagogy & Technical Laboratory Instruction Certificate",
        issuer: "Higher Technical Education Directorate",
        year: "2023",
        issue_date: "2023-09-15",
        expiry_date: "Does not expire",
        credential_id: "HTE-LAB-2023-88",
        credential_url: "https://moe.gov.et/tvet",
        category: "Education",
        category_number: 2,
        visibility: "Public",
        description: "Certified competencies in modern technical lab delivery, interactive software debugging sessions, student capstone supervision, and practical examination evaluation.",
        skills_acquired: ["Instructional Design", "Lab Leadership", "Capstone Mentoring", "Technical Pedagogy"],
        file_url: "/frontend/assets/images/project_eschool_erp_1791918972002.jpg",
        file_name: "collegiate_pedagogy_laboratory_instruction.pdf",
        file_type: "pdf"
      },
      {
        id: 8,
        title: "National TVET Lead Assessor & Curriculum Architecture Specialist",
        issuer: "National Occupational Standards Agency",
        year: "2024",
        issue_date: "2024-02-14",
        expiry_date: "Does not expire",
        credential_id: "NOSA-ASSESS-2024-331",
        credential_url: "https://moe.gov.et",
        category: "Education",
        category_number: 2,
        visibility: "Public",
        description: "Formal credential for auditing computer science programs, evaluating occupational competence in web engineering, and architecting accredited technical assessment rubrics.",
        skills_acquired: ["Competency Assessment", "Occupational Standards", "Technical Rubrics", "Outcome Verification"],
        file_url: "/frontend/assets/images/project_apple_clone_1791918969741.jpg",
        file_name: "national_curriculum_lead_assessor.pdf",
        file_type: "pdf"
      },
      // 3. HUMANITARIAN
      {
        id: 9,
        title: "Community Digital Literacy & Youth Empowerment Award",
        issuer: "Ethiopian Youth Digital Inclusion Initiative",
        year: "2023",
        issue_date: "2023-12-10",
        expiry_date: "Does not expire",
        credential_id: "EYDI-HUM-2023-412",
        credential_url: "https://eliyastech.com/credentials/humanitarian-digital-literacy",
        category: "Humanitarian",
        category_number: 3,
        visibility: "Public",
        description: "Honored for establishing free community coding workshops, training 200+ underprivileged youth in software foundations, and donating educational technology setups.",
        skills_acquired: ["Community Empowerment", "Digital Inclusion", "Youth Mentorship", "Volunteer Training"],
        file_url: "/frontend/assets/images/hero_eliyas_workstation_1791918969286.jpg",
        file_name: "community_digital_inclusion_award.pdf",
        file_type: "pdf"
      },
      {
        id: 10,
        title: "Technology for Social Good & Civic Innovation Recognition",
        issuer: "Civic Tech & Community Innovation Alliance",
        year: "2022",
        issue_date: "2022-11-05",
        expiry_date: "Does not expire",
        credential_id: "CTIA-SOC-9921",
        credential_url: "https://eliyastech.com/credentials/civic-tech-humanitarian",
        category: "Humanitarian",
        category_number: 3,
        visibility: "Public",
        description: "Awarded for volunteer technical contributions to community digital registers, disaster relief communication hubs, and digital equity advocacy.",
        skills_acquired: ["Humanitarian Tech", "Social Impact", "Community Outreach", "Civic Software"],
        file_url: "/frontend/assets/images/project_chatgpt_clone_1791918970987.jpg",
        file_name: "civic_tech_social_good_award.pdf",
        file_type: "pdf"
      },
      {
        id: 11,
        title: "Rural Digital Inclusion & Girls in Coding Mentorship Citation",
        issuer: "Pan-African STEM Equity Foundation",
        year: "2024",
        issue_date: "2024-05-18",
        expiry_date: "Does not expire",
        credential_id: "PASEF-STEM-2024-89",
        credential_url: "https://eliyastech.com/credentials/stem-equity-citation",
        category: "Humanitarian",
        category_number: 3,
        visibility: "Public",
        description: "Commended for directing rural code camps, mentoring high-school female scholars in STEM algorithms, and promoting digital literacy across regional townships.",
        skills_acquired: ["STEM Equity", "Girls in Code", "Rural Outreach", "Pedagogical Volunteering"],
        file_url: "/frontend/assets/images/project_eschool_erp_1791918972002.jpg",
        file_name: "rural_stem_inclusion_citation.pdf",
        file_type: "pdf"
      },
      // 4. OTHERS
      {
        id: 12,
        title: "Professional Leadership & Institutional Service Award",
        issuer: "Metropolitan Higher Education Consortium",
        year: "2023",
        issue_date: "2023-06-30",
        expiry_date: "Does not expire",
        credential_id: "MHEC-LEAD-7821",
        credential_url: "https://eliyastech.com/credentials/leadership-award",
        category: "Others",
        category_number: 4,
        visibility: "Public",
        description: "Institutional recognition for distinguished service, cross-departmental collaboration, and engineering leadership in campus digital transformation.",
        skills_acquired: ["Leadership", "Institutional Strategy", "Team Coordination", "Ethics & Governance"],
        file_url: "/frontend/assets/images/project_netflix_clone_1791918972434.jpg",
        file_name: "institutional_leadership_service_award.pdf",
        file_type: "pdf"
      },
      {
        id: 13,
        title: "ICT Infrastructure Reliability & Innovation Citation",
        issuer: "National Information Technology Forum",
        year: "2022",
        issue_date: "2022-04-12",
        expiry_date: "Does not expire",
        credential_id: "NITF-CIT-2022-19",
        credential_url: "https://eliyastech.com/credentials/infrastructure-citation",
        category: "Others",
        category_number: 4,
        visibility: "Public",
        description: "Commended for pioneering high-availability campus network architectures with 99.98% verified uptime and zero security breaches.",
        skills_acquired: ["High Availability", "Network Resilience", "Systems Excellence", "Infrastructure Strategy"],
        file_url: "/frontend/assets/images/hero_eliyas_workstation_1791918969286.jpg",
        file_name: "ict_infrastructure_reliability_citation.pdf",
        file_type: "pdf"
      },
      {
        id: 14,
        title: "Enterprise Agile Delivery & Systems Excellence Commendation",
        issuer: "East Africa Software Engineering Guild",
        year: "2024",
        issue_date: "2024-03-22",
        expiry_date: "Does not expire",
        credential_id: "EASEG-AGILE-2024-114",
        credential_url: "https://eliyastech.com/credentials/agile-systems-delivery",
        category: "Others",
        category_number: 4,
        visibility: "Public",
        description: "Awarded for demonstrating exemplary technical project leadership, sprint retrospectives, continuous deployment pipelines, and zero-downtime database migrations.",
        skills_acquired: ["Agile Leadership", "CI/CD Pipelines", "Zero-Downtime Delivery", "Sprint Architecture"],
        file_url: "/frontend/assets/images/project_chatgpt_clone_1791918970987.jpg",
        file_name: "enterprise_agile_delivery_commendation.pdf",
        file_type: "pdf"
      }
    ];
    this.skills = [
      {
        id: "nextjs",
        name: "Next.js 15",
        category: "frontend",
        categoryLabel: "Frontend & SSR",
        role: "Server Components, App Router & Static Generation",
        color: "#000000",
        logo_url: "/assets/tech-logos/nextjs.svg"
      },
      {
        id: "react",
        name: "React 19",
        category: "frontend",
        categoryLabel: "Frontend UI",
        role: "Concurrent Mode, Custom Hooks & Reactive State",
        color: "#61DAFB",
        logo_url: "/assets/tech-logos/react.svg"
      },
      {
        id: "javascript",
        name: "JavaScript",
        category: "frontend",
        categoryLabel: "Core Language",
        role: "Modern ESNext, Async Event Loop & Functional Architecture",
        color: "#F7DF1E",
        logo_url: "/assets/tech-logos/javascript.svg"
      },
      {
        id: "typescript",
        name: "TypeScript",
        category: "frontend",
        categoryLabel: "Type Safety",
        role: "Generics, Strict Type Contracts & Compiler Tooling",
        color: "#3178C6",
        logo_url: "/assets/tech-logos/typescript.svg"
      },
      {
        id: "tailwindcss",
        name: "Tailwind CSS",
        category: "frontend",
        categoryLabel: "Styling System",
        role: "Utility-First Tokens, Responsive Viewports & Modern Grid",
        color: "#38BDF8",
        logo_url: "/assets/tech-logos/tailwindcss.svg"
      },
      {
        id: "nodejs",
        name: "Node.js",
        category: "backend",
        categoryLabel: "Backend Runtime",
        role: "V8 Async Non-blocking I/O, Streams & Core Microservices",
        color: "#339933",
        logo_url: "/assets/tech-logos/nodejs.svg"
      },
      {
        id: "express",
        name: "Express.js",
        category: "backend",
        categoryLabel: "Backend Framework",
        role: "Decoupled MVC Routing, JWT Authentication & REST APIs",
        color: "#083785",
        logo_url: "/assets/tech-logos/express.svg"
      },
      {
        id: "mysql",
        name: "MySQL 8.0",
        category: "database",
        categoryLabel: "Relational DB",
        role: "ACID Transactions, B-Tree Indexes & BCNF Normalization",
        color: "#4479A1",
        logo_url: "/assets/tech-logos/mysql.svg"
      },
      {
        id: "docker",
        name: "Docker",
        category: "devops",
        categoryLabel: "Containers",
        role: "Multi-stage Builds, Compose Orchestration & Production Images",
        color: "#2496ED",
        logo_url: "/assets/tech-logos/docker.svg"
      },
      {
        id: "aws",
        name: "AWS Cloud",
        category: "devops",
        categoryLabel: "Cloud Platform",
        role: "EC2 Compute, S3 Storage, RDS Databases & CloudFront CDN",
        color: "#FF9900",
        logo_url: "/assets/tech-logos/aws.svg"
      },
      {
        id: "linux",
        name: "Linux / Ubuntu",
        category: "devops",
        categoryLabel: "Server OS",
        role: "Bash Automation, Systemd Services, SSH & NGINX Tuning",
        color: "#E95420",
        logo_url: "/assets/tech-logos/ubuntu.svg"
      },
      {
        id: "git",
        name: "Git & GitHub",
        category: "devops",
        categoryLabel: "Version Control",
        role: "Trunk-based Branching, Code Reviews & Automated Actions",
        color: "#F05032",
        logo_url: "/assets/tech-logos/git.svg"
      }
    ];
    this.experiences = [
      {
        id: 1,
        period: "2023 - Present",
        role: "Senior Full-Stack Developer & Software Architect",
        organization: "Independent Technology Engineering & Systems Consulting",
        location: "Addis Ababa, Ethiopia",
        type: "Full-Time / Contract",
        description: "Architecting scalable web platforms, normalized relational database structures, and high-performance frontend interfaces for domestic institutions and commercial clients.",
        achievements: [
          "Engineered full-stack enterprise school management ERP serving 14,000+ active student records with zero schema migration downtime.",
          "Optimized MySQL relational indexing, reducing API p95 query response latency by 64%.",
          "Delivered production React 19 / Next.js web applications with 99+ Lighthouse performance scores."
        ]
      },
      {
        id: 2,
        period: "2021 - Present",
        role: "Collegiate ICT & Computer Science Lecturer",
        organization: "Department of Computer Science & Information Technology",
        location: "Addis Ababa, Ethiopia",
        type: "Collegiate Academic Instruction",
        description: "Instructing diploma and undergraduate students in Web Development, Relational Databases (MySQL), Systems Administration, and Computer Networking.",
        achievements: [
          "Trained and graduated over 450+ students with verified competencies in JavaScript, MySQL, and full-stack software development.",
          "Designed modular laboratory curricula integrating real-world Git version control, Express MVC patterns, and SQL query tuning.",
          "Supervised 30+ capstone engineering graduation projects with 100% successful institutional defenses."
        ]
      },
      {
        id: 3,
        period: "2020 - 2022",
        role: "Network Engineer & Systems Administrator",
        organization: "Regional Technical Campus ICT Directorate",
        location: "Addis Ababa, Ethiopia",
        type: "Institutional Systems Operations",
        description: "Managed campus-wide network infrastructure, Cisco switch/router topologies, server virtualization, and institutional database backups.",
        achievements: [
          "Achieved 99.98% network uptime across 8 campus facilities with redundant Cisco routing.",
          "Configured Linux hypervisor clusters (Proxmox, Docker) for automated application hosting.",
          "Standardized fiber optic backbone routing and structured data center cabling."
        ]
      }
    ];
    this.messages = [
      {
        id: 1,
        name: "Dr. Solomon Tadesse",
        email: "solomon.tadesse@aait.edu.et",
        subject: "Collegiate Curriculum Advisory Board Invitation",
        message: "Dear Mr. Eliyas, we would like to invite you to join our Advisory Committee for full-stack database curriculum evaluation.",
        status: "New",
        created_at: new Date(Date.now() - 36e5 * 24).toISOString()
      },
      {
        id: 2,
        name: "Kassahun Bekele",
        email: "kassahun@techconsult.et",
        subject: "Consulting: Enterprise MySQL Replication Tuning",
        message: "Hello Elyas, we are looking for a senior backend architect to evaluate our MySQL replication topology and optimize our query indexes.",
        status: "Read",
        created_at: new Date(Date.now() - 36e5 * 48).toISOString()
      }
    ];
  }
  // Simulated SQL Query Execution Engine for the Admin Studio
  executeSql(query) {
    const startTime = performance.now();
    const cleanQuery = query.trim().toLowerCase();
    let rows = [];
    let columns = [];
    if (cleanQuery.includes("projects")) {
      rows = this.projects.map((p) => ({
        id: p.id,
        title: p.title,
        layer: p.layer,
        category: p.category,
        status: p.status
      }));
      columns = ["id", "title", "layer", "category", "status"];
    } else if (cleanQuery.includes("certificates")) {
      rows = this.certificates.map((c) => ({
        id: c.id,
        title: c.title,
        category: `${c.category_number}. ${c.category}`,
        issuer: c.issuer,
        issue_date: c.issue_date,
        credential_id: c.credential_id
      }));
      columns = ["id", "title", "category", "issuer", "issue_date", "credential_id"];
    } else if (cleanQuery.includes("messages")) {
      rows = this.messages.map((m) => ({
        id: m.id,
        name: m.name,
        email: m.email,
        subject: m.subject,
        status: m.status,
        created_at: m.created_at
      }));
      columns = ["id", "name", "email", "subject", "status", "created_at"];
    } else if (cleanQuery.includes("skills")) {
      rows = this.skills.map((s) => ({
        id: s.id,
        category: s.category,
        name: s.name,
        proficiency: `${s.proficiency}%`
      }));
      columns = ["id", "category", "name", "proficiency"];
    } else if (cleanQuery.includes("experiences")) {
      rows = this.experiences.map((e) => ({
        id: e.id,
        period: e.period,
        role: e.role,
        organization: e.organization,
        location: e.location
      }));
      columns = ["id", "period", "role", "organization", "location"];
    } else {
      rows = [
        {
          engine: "MySQL 8.0.35 (InnoDB)",
          charset: "utf8mb4",
          uptime: "99.98%",
          active_connections: 4,
          max_connections: 151
        }
      ];
      columns = ["engine", "charset", "uptime", "active_connections", "max_connections"];
    }
    const executionTimeMs = parseFloat((performance.now() - startTime).toFixed(2));
    return {
      columns,
      rows,
      rowCount: rows.length,
      executionTimeMs
    };
  }
}
const db = new InMemoryDatabase();
export {
  db
};
