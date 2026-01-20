import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { BookOpen, GraduationCap, Clock } from '@phosphor-icons/react';
import Card, { CardBody, CardHeader } from '@/components/ui/Card';
import { useTenant } from '@/contexts/TenantContext';
import { useAuth } from '@/contexts/AuthContext';
import { courseApi } from '@/lib/api/services';

const TeacherDashboard: React.FC = () => {
  const { currentSchool } = useTenant();
  const { user } = useAuth();

  const { data: courses } = useQuery({
    queryKey: ['teacher-courses', currentSchool?.id, user?.id],
    queryFn: () => courseApi.getAll({ schoolId: currentSchool?.id, perPage: 100 }),
    enabled: !!currentSchool && !!user,
  });

  // Filter courses by current teacher
  const myCourses = courses?.data.filter(course => course.teacherId === user?.id) || [];
  const totalStudents = myCourses.reduce((sum, course) => sum + course.studentCount, 0);

  const stats = [
    {
      title: 'My Courses',
      value: myCourses.length,
      icon: BookOpen,
      bgColor: 'bg-primary-50',
      iconColor: 'text-primary-600',
    },
    {
      title: 'Total Students',
      value: totalStudents,
      icon: GraduationCap,
      bgColor: 'bg-success-50',
      iconColor: 'text-success-600',
    },
    {
      title: 'Active Courses',
      value: myCourses.filter(c => c.status === 'active').length,
      icon: Clock,
      bgColor: 'bg-warning-50',
      iconColor: 'text-warning-600',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-neutral-900">Teacher Dashboard</h1>
        <p className="text-neutral-600 mt-1">
          Welcome back, {user?.name}!
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

      {/* My Courses */}
      <Card variant="elevated">
        <CardHeader>
          <h2 className="text-lg font-semibold text-neutral-900">My Courses</h2>
        </CardHeader>
        <CardBody>
          {myCourses.length ? (
            <div className="space-y-4">
              {myCourses.map((course) => (
                <div key={course.id} className="flex items-start justify-between p-4 bg-neutral-50 rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-medium text-neutral-900">{course.name}</h3>
                    <p className="text-sm text-neutral-600 mt-1">{course.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-neutral-500">
                      <span className="flex items-center gap-1">
                        <GraduationCap size={16} />
                        {course.studentCount} students
                      </span>
                      <span>
                        {new Date(course.startDate).toLocaleDateString()} - {new Date(course.endDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <span className={`px-3 py-1 text-xs rounded-full ${
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
            <p className="text-neutral-500 text-center py-8">No courses assigned</p>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default TeacherDashboard;
