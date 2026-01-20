import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Plus, MagnifyingGlass } from '@phosphor-icons/react';
import Card, { CardBody, CardHeader } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useTenant } from '@/contexts/TenantContext';
import { studentApi } from '@/lib/api/services';

const StudentsPage: React.FC = () => {
  const { currentSchool } = useTenant();
  const [searchTerm, setSearchTerm] = React.useState('');

  const { data: studentsData, isLoading } = useQuery({
    queryKey: ['students', currentSchool?.id],
    queryFn: () => studentApi.getAll({ schoolId: currentSchool?.id, perPage: 100 }),
    enabled: !!currentSchool,
  });

  const students = studentsData?.data || [];
  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Students</h1>
          <p className="text-neutral-600 mt-1">Manage all students</p>
        </div>
        <Button leftIcon={<Plus size={20} />}>
          Add Student
        </Button>
      </div>

      <Card variant="elevated">
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-neutral-900">All Students</h2>
            <div className="w-64">
              <Input
                placeholder="Search students..."
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
          ) : filteredStudents.length ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-neutral-200 text-left">
                    <th className="pb-3 text-sm font-semibold text-neutral-700">Name</th>
                    <th className="pb-3 text-sm font-semibold text-neutral-700">Email</th>
                    <th className="pb-3 text-sm font-semibold text-neutral-700">Enrolled Courses</th>
                    <th className="pb-3 text-sm font-semibold text-neutral-700">Enrollment Date</th>
                    <th className="pb-3 text-sm font-semibold text-neutral-700">Status</th>
                    <th className="pb-3 text-sm font-semibold text-neutral-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student) => (
                    <tr key={student.id} className="border-b border-neutral-100">
                      <td className="py-4 font-medium text-neutral-900">{student.name}</td>
                      <td className="py-4 text-neutral-700">{student.email}</td>
                      <td className="py-4 text-neutral-700">{student.courses.length}</td>
                      <td className="py-4 text-neutral-700">
                        {new Date(student.enrollmentDate).toLocaleDateString()}
                      </td>
                      <td className="py-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          student.status === 'active' 
                            ? 'bg-success-100 text-success-700'
                            : student.status === 'graduated'
                            ? 'bg-primary-100 text-primary-700'
                            : 'bg-neutral-100 text-neutral-700'
                        }`}>
                          {student.status}
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
              {searchTerm ? 'No students found matching your search' : 'No students available'}
            </p>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default StudentsPage;
