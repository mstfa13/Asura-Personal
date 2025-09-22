
interface LevelCardProps {
  level: number;
  title: string;
  description: string;
  hoursRequired: number;
  currentHours: number;
  knownWords?: number;
  gradient: string;
  icon: React.ReactNode;
  isActive?: boolean;
}

export default function LevelCard({
  level,
  title,
  description,
  hoursRequired,
  currentHours,
  knownWords,
  gradient,
  icon,
  isActive = false
}: LevelCardProps) {
  const progress = Math.min((currentHours / hoursRequired) * 100, 100);
  
  return (
    <div className={`bg-white rounded-xl p-6 border-2 transition-all duration-200 ${
      isActive ? 'border-purple-200 shadow-lg' : 'border-gray-100 hover:border-gray-200'
    }`}>
      <div className="flex items-start space-x-4">
        <div className={`w-12 h-12 rounded-lg ${gradient} flex items-center justify-center flex-shrink-0`}>
          {icon}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <span className="text-sm text-gray-500">Level {level}</span>
          </div>
          
          <p className="text-gray-600 text-sm mb-4">{description}</p>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Hours of input: {currentHours}</span>
              {knownWords && <span className="text-gray-500">Known words: {knownWords.toLocaleString()}</span>}
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            
            <div className="text-xs text-gray-500">
              {hoursRequired - currentHours > 0 
                ? `${hoursRequired - currentHours} hours to next level`
                : 'Level completed!'
              }
            </div>
          </div>
        </div>
        
        <button className="text-gray-400 hover:text-gray-600">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
