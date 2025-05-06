import { useMemo } from 'react';
import { DepartmentData, DepartmentStats, CompanyCount, SkillGapData } from '../types';

export const useCalculateDepartmentStats = (data: DepartmentData[]): DepartmentStats => {
  return useMemo(() => {
    const totalStudents = data.length;
    const placedStudents = data.filter(student => student.status === 'Placed').length;
    const placementPercentage = totalStudents > 0 ? (placedStudents / totalStudents) * 100 : 0;
    
    // Calculate average and highest salary
    const salaries = data
      .filter(student => student.status === 'Placed' && student.salary > 0)
      .map(student => student.salary);
    
    const averageSalary = salaries.length > 0 
      ? salaries.reduce((sum, salary) => sum + salary, 0) / salaries.length 
      : 0;
    
    const highestSalary = salaries.length > 0 
      ? Math.max(...salaries) 
      : 0;
    
    // Calculate top companies
    const companyCount: Record<string, number> = {};
    data.forEach(student => {
      if (student.status === 'Placed' && student.company) {
        companyCount[student.company] = (companyCount[student.company] || 0) + 1;
      }
    });
    
    const topCompanies = Object.entries(companyCount)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
    
    // Calculate domain distribution
    const domainCount: Record<string, number> = {};
    data.forEach(student => {
      if (student.domain) {
        domainCount[student.domain] = (domainCount[student.domain] || 0) + 1;
      }
    });
    
    const domainDistribution = Object.entries(domainCount)
      .map(([domain, count]) => ({ domain, count }))
      .sort((a, b) => b.count - a.count);
    
    // Calculate skill gaps (mocked data for demand vs supply)
    const skillsFrequency: Record<string, number> = {};
    data.forEach(student => {
      student.skillset.forEach(skill => {
        skillsFrequency[skill] = (skillsFrequency[skill] || 0) + 1;
      });
    });
    
    const skillGaps: SkillGapData[] = Object.entries(skillsFrequency)
      .map(([skill, supply]) => {
        // Mock demand data - in a real app, this would come from job listings or employer data
        const demand = Math.floor(Math.random() * 100) + 20;
        return { skill, supply, demand };
      })
      .sort((a, b) => (b.demand - b.supply) - (a.demand - a.supply))
      .slice(0, 8);
    
    return {
      totalStudents,
      placedStudents,
      placementPercentage,
      averageSalary,
      highestSalary,
      topCompanies,
      domainDistribution,
      skillGaps
    };
  }, [data]);
};