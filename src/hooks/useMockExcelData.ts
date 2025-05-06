import { useState, useEffect } from 'react';
import { DepartmentData } from '../types';

// Mock data generator
const generateMockData = (): Record<string, DepartmentData[]> => {
  const departments = ['CSE', 'ECE', 'MECH', 'CIVIL', 'EEE'];
  const companies = [
    'Google', 'Microsoft', 'Amazon', 'Facebook', 'Apple', 
    'IBM', 'Intel', 'Infosys', 'TCS', 'Wipro', 
    'Accenture', 'Deloitte', 'Cognizant', 'HCL', 'Tech Mahindra'
  ];
  const roles = [
    'Software Engineer', 'Data Scientist', 'Product Manager', 
    'UI/UX Designer', 'DevOps Engineer', 'QA Engineer', 
    'Network Engineer', 'System Architect', 'Business Analyst'
  ];
  const domains = [
    'Web Development', 'Mobile Development', 'Data Science',
    'Cloud Computing', 'Cybersecurity', 'AI/ML',
    'IoT', 'Blockchain', 'AR/VR'
  ];
  const skills = [
    'JavaScript', 'Python', 'Java', 'C++', 'React', 
    'Angular', 'Vue', 'Node.js', 'Django', 'Flask',
    'MongoDB', 'SQL', 'AWS', 'Azure', 'GCP',
    'Docker', 'Kubernetes', 'Git', 'TensorFlow', 'PyTorch'
  ];
  const statuses = ['Placed', 'Not Placed', 'In Process'] as const;

  const mockData: Record<string, DepartmentData[]> = {};

  departments.forEach(dept => {
    const studentCount = Math.floor(Math.random() * 30) + 50; // 50-80 students per department
    const departmentData: DepartmentData[] = [];

    for (let i = 0; i < studentCount; i++) {
      const randomCompany = companies[Math.floor(Math.random() * companies.length)];
      const randomRole = roles[Math.floor(Math.random() * roles.length)];
      const randomDomain = domains[Math.floor(Math.random() * domains.length)];
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
      
      // Generate random skillset (3-7 skills)
      const skillCount = Math.floor(Math.random() * 5) + 3;
      const randomSkills: string[] = [];
      while (randomSkills.length < skillCount) {
        const skill = skills[Math.floor(Math.random() * skills.length)];
        if (!randomSkills.includes(skill)) {
          randomSkills.push(skill);
        }
      }

      const randomSalary = (Math.floor(Math.random() * 150) + 50) * 1000; // Salary between 50k-200k

      departmentData.push({
        id: `${dept}-${i + 1}`,
        name: `Student ${i + 1}`,
        company: randomStatus === 'Placed' ? randomCompany : '',
        salary: randomStatus === 'Placed' ? randomSalary : 0,
        status: randomStatus,
        role: randomStatus === 'Placed' ? randomRole : '',
        domain: randomDomain,
        skillset: randomSkills,
        joiningDate: randomStatus === 'Placed' ? new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0] : undefined
      });
    }

    mockData[dept] = departmentData;
  });

  return mockData;
};

export const useMockExcelData = () => {
  const [data, setData] = useState<Record<string, DepartmentData[]>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call delay
    const timer = setTimeout(() => {
      const mockData = generateMockData();
      setData(mockData);
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  return { data, isLoading };
};