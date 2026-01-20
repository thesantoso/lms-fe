import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Plus, MagnifyingGlass } from '@phosphor-icons/react';
import Card, { CardBody, CardHeader } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useTenant } from '@/contexts/TenantContext';
import { courseApi } from '@/lib/api/services';

const CoursesPage: React.FC = () => {
  const { currentSchool } = useTenant();
  const [searchTerm, setSearchTerm] = React.useState('');

  const { data: coursesData, isLoading } = useQuery({
    queryKey: ['courses', currentSchool?.id],
    queryFn: () => courseApi.getAll({ schoolId: currentSchool?.id, perPage: 100 }),
    enabled: !!currentSchool,
  });

  const courses = coursesData?.data || [];
  const filteredCourses = courses.filter(course =>
    course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.teacherName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Courses</h1>
          <p className="text-neutral-600 mt-1">Manage all courses</p>
        </div>
        <Button leftIcon={<Plus size={20} />}>
          Add Course
        </Button>
      </div>

      <Card variant="elevated">
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-neutral-900">All Courses</h2>
            <div className="w-64">
              <Input
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                leftIcon={<MagnifyingGlass size={20} />}
              />
            </div>
          </div>
        </CardHeader>
        <CardBody>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
          ) : filteredCourses.length ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-neutral-200 text-left">
                    <th className="pb-3 text-sm font-semibold text-neutral-700">Course Name</th>
                    <th className="pb-3 text-sm font-semibold text-neutral-700">Instructor</th>
                    <th className="pb-3 text-sm font-semibold text-neutral-700">Students</th>
                    <th className="pb-3 text-sm font-semibold text-neutral-700">Duration</th>
                    <th className="pb-3 text-sm font-semibold text-neutral-700">Status</th>
                    <th className="pb-3 text-sm font-semibold text-neutral-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCourses.map((course) => (
                    <tr key={course.id} className="border-b border-neutral-100">
                      <td className="py-4">
                        <div>
                          <p className="font-medium text-neutral-900">{course.name}</p>
                          <p className="text-sm text-neutral-500">{course.description.slice(0, 50)}...</p>
                        </div>
                      </td>
                      <td className="py-4 text-neutral-700">{course.teacherName}</td>
                      <td className="py-4 text-neutral-700">{course.studentCount}</td>
                      <td className="py-4 text-sm text-neutral-500">
                        {new Date(course.startDate).toLocaleDateString()} - {new Date(course.endDate).toLocaleDateString()}
                      </td>
                      <td className="py-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          course.status === 'active' 
                            ? 'bg-success-100 text-success-700'
                            : course.status === 'completed'
                            ? 'bg-neutral-100 text-neutral-700'
                            : 'bg-warning-100 text-warning-700'
                        }`}>
                          {course.status}
                        </span>
                      </td>
                      <td className="py-4">
                        <div className="flex gap-2">
                          <Button size="sm" variant="ghost">Edit</Button>
                          <Button size="sm" variant="ghost">View</Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-neutral-500 text-center py-8">
              {searchTerm ? 'No courses found matching your search' : 'No courses available'}
            </p>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default CoursesPage;
