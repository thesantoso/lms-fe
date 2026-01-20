import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { schoolApi } from '@/lib/api/services';
import { useAuth } from './AuthContext';
import type { TenantContextType, School } from '@/types';

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export const TenantProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [schools, setSchools] = useState<School[]>([]);
  const [currentSchool, setCurrentSchool] = useState<School | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSchools = async () => {
      if (!isAuthenticated || !user) {
        setLoading(false);
        return;
      }

      try {
        const allSchools = await schoolApi.getAll();
        // Filter schools based on user's school access
        const userSchools = allSchools.filter(school => 
          user.schoolIds.includes(school.id)
        );
        
        setSchools(userSchools);

        // Set current school from localStorage or default to first
        const savedSchoolId = localStorage.getItem('current_school_id');
        if (savedSchoolId) {
          const school = userSchools.find(s => s.id === savedSchoolId);
          setCurrentSchool(school || userSchools[0] || null);
        } else if (userSchools.length > 0) {
          setCurrentSchool(userSchools[0]);
          localStorage.setItem('current_school_id', userSchools[0].id);
        }
      } catch (error) {
        console.error('Failed to load schools:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSchools();
  }, [isAuthenticated, user]);

  const switchSchool = (schoolId: string) => {
    const school = schools.find(s => s.id === schoolId);
    if (school) {
      setCurrentSchool(school);
      localStorage.setItem('current_school_id', schoolId);
    }
  };

  return (
    <TenantContext.Provider
      value={{
        currentSchool,
        schools,
        switchSchool,
        loading,
      }}
    >
      {children}
    </TenantContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useTenant = () => {
  const context = useContext(TenantContext);
  if (context === undefined) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
};
