export interface DepartmentData {
  id: string;
  name: string;
  company: string;
  salary: number;
  status: 'Placed' | 'Not Placed' | 'In Process';
  role: string;
  skillset: string[];
  domain: string;
  joiningDate?: string;
}

export interface DepartmentStats {
  totalStudents: number;
  placedStudents: number;
  placementPercentage: number;
  averageSalary: number;
  highestSalary: number;
  topCompanies: Array<{ name: string; count: number }>;
  skillGaps: Array<{ skill: string; demand: number; supply: number }>;
  domainDistribution: Array<{ domain: string; count: number }>;
}

export interface ChartData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
  }>;
}

export interface CompanyCount {
  company: string;
  count: number;
}

export interface SkillGapData {
  skill: string;
  demand: number;
  supply: number;
}

export interface DomainData {
  name: string;
  value: number;
  children?: DomainData[];
}

export interface NetworkNode {
  id: string;
  name: string;
  type: 'company' | 'student';
  value: number;
}

export interface NetworkLink {
  source: string;
  target: string;
  value: number;
}

export interface NetworkData {
  nodes: NetworkNode[];
  links: NetworkLink[];
}

export interface SankeyData {
  nodes: Array<{ name: string }>;
  links: Array<{ source: number; target: number; value: number }>;
}