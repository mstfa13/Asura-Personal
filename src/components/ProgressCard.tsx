
interface ProgressCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  progress?: number;
  gradient: string;
  icon?: React.ReactNode;
  className?: string;
}

export default function ProgressCard({ 
  title, 
  value, 
  subtitle, 
  progress, 
  gradient, 
  icon,
  className = ""
}: ProgressCardProps) {
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-100 p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        {icon && <div className="text-gray-400">{icon}</div>}
      </div>
      
      <div className="space-y-2">
        <div className="text-3xl font-bold text-gray-900">{value}</div>
        {subtitle && <div className="text-sm text-gray-500">{subtitle}</div>}
        
        {progress !== undefined && (
          <div className="space-y-2">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${gradient}`}
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
            <div className="text-xs text-gray-500">{progress}% complete</div>
          </div>
        )}
      </div>
    </div>
  );
}
