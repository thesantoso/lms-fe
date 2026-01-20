import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { BookOpen, Users, GraduationCap } from '@phosphor-icons/react';
import Card, { CardBody, CardHeader } from '@/components/ui/Card';
import { useTenant } from '@/contexts/TenantContext';
import { courseApi, teacherApi, studentApi } from '@/lib/api/services';

const AdminDashboard: React.FC = () => {
  const { currentSchool } = useTenant();

  const { data: courses } = useQuery({
    queryKey: ['courses', currentSchool?.id],
    queryFn: () => courseApi.getAll({ schoolId: currentSchool?.id, perPage: 100 }),
    enabled: !!currentSchool,
  });

  const { data: teachers } = useQuery({
    queryKey: ['teachers', currentSchool?.id],
    queryFn: () => teacherApi.getAll({ schoolId: currentSchool?.id, perPage: 100 }),
    enabled: !!currentSchool,
  });

  const { data: students } = useQuery({
    queryKey: ['students', currentSchool?.id],
    queryFn: () => studentApi.getAll({ schoolId: currentSchool?.id, perPage: 100 }),
    enabled: !!currentSchool,
  });

  const stats = [
    {
      title: 'Total Courses',
      value: courses?.total || 0,
      icon: BookOpen,
      color: 'primary',
      bgColor: 'bg-primary-50',
      iconColor: 'text-primary-600',
    },
    {
      title: 'Total Teachers',
      value: teachers?.total || 0,
      icon: Users,
      color: 'secondary',
      bgColor: 'bg-secondary-50',
      iconColor: 'text-secondary-600',
    },
    {
      title: 'Total Students',
      value: students?.total || 0,
      icon: GraduationCap,
      color: 'success',
      bgColor: 'bg-success-50',
      iconColor: 'text-success-600',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-neutral-900">Admin Dashboard</h1>
        <p className="text-neutral-600 mt-1">
          {currentSchool ? `Managing ${currentSchool.name}` : 'Select a school to manage'}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} variant="elevated">
            <CardBody>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral-600">{stat.title}</p>
                  <p className="text-3xl font-bold text-neutral-900 mt-2">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                  <stat.icon size={24} className={stat.iconColor} />
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card variant="elevated">
          <CardHeader>
            <h2 className="text-lg font-semibold text-neutral-900">Recent Courses</h2>
          </CardHeader>
          <CardBody>
            {courses?.data.length ? (
              <div className="space-y-3">
                {courses.data.slice(0, 5).map((course) => (
                  <div key={course.id} className="flex items-start justify-between py-2">
                    <div>
                      <p className="font-medium text-neutral-900">{course.name}</p>
                      <p className="text-sm text-neutral-500">{course.teacherName}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      course.status === 'active' 
                        ? 'bg-success-100 text-success-700'
                        : 'bg-neutral-100 text-neutral-700'
                    }`}>
                      {course.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-neutral-500 text-center py-8">No courses available</p>
            )}
          </CardBody>
        </Card>

        <Card variant="elevated">
          <CardHeader>
            <h2 className="text-lg font-semibold text-neutral-900">School Information</h2>
          </CardHeader>
          <CardBody>
            {currentSchool ? (
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-neutral-600">School Name</p>
                  <p className="font-medium text-neutral-900">{currentSchool.name}</p>
                </div>
                <div>
                  <p className="text-sm text-neutral-600">Address</p>
                  <p className="font-medium text-neutral-900">{currentSchool.address}</p>
                </div>
                <div>
                  <p className="text-sm text-neutral-600">Contact Email</p>
                  <p className="font-medium text-neutral-900">{currentSchool.contactEmail}</p>
                </div>
                <div>
                  <p className="text-sm text-neutral-600">Contact Phone</p>
                  <p className="font-medium text-neutral-900">{currentSchool.contactPhone}</p>
                </div>
              </div>
            ) : (
              <p className="text-neutral-500 text-center py-8">No school selected</p>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
