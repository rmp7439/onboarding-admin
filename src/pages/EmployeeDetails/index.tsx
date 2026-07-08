import { useParams } from 'react-router-dom';

export default function EmployeeDetails() {
  const { id } = useParams();
  
  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">
        Employee Details <span className="text-gray-500 text-lg">#{id}</span>
      </h1>
    </div>
  );
}