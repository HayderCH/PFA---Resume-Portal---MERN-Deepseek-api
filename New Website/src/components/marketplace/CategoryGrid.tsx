
import React from 'react';
import { Link } from 'react-router-dom';
import { Category } from '@/types/marketplace';
import {
  Code,
  BarChart2,
  Heart,
  MessageSquare,
  Image,
  Book,
  DollarSign,
  FileText,
  Briefcase,
  Activity,
  Cpu,
  Database,
  Cloud,
  Coffee,
  ShoppingBag,
  Users,
  Map,
  Globe,
  Award,
} from 'lucide-react';

interface CategoryGridProps {
  categories: Category[];
  isLoading?: boolean;
}

const CategoryGrid: React.FC<CategoryGridProps> = ({ categories, isLoading = false }) => {
  // Map of icon names to components - expanded with more icons
  const iconMap: Record<string, React.ReactNode> = {
    'code': <Code size={28} />,
    'bar-chart-2': <BarChart2 size={28} />,
    'heart': <Heart size={28} />,
    'message-square': <MessageSquare size={28} />,
    'image': <Image size={28} />,
    'book': <Book size={28} />,
    'dollar-sign': <DollarSign size={28} />,
    'file-text': <FileText size={28} />,
    'briefcase': <Briefcase size={28} />,
    'activity': <Activity size={28} />,
    'cpu': <Cpu size={28} />,
    'database': <Database size={28} />,
    'cloud': <Cloud size={28} />,
    'coffee': <Coffee size={28} />,
    'shopping-bag': <ShoppingBag size={28} />,
    'users': <Users size={28} />,
    'map': <Map size={28} />,
    'globe': <Globe size={28} />,
    'award': <Award size={28} />,
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 h-full">
            <div className="flex flex-col items-center text-center h-full animate-pulse">
              <div className="h-16 w-16 rounded-full bg-gray-200 mb-4"></div>
              <div className="h-6 w-32 bg-gray-200 mb-2"></div>
              <div className="h-4 w-full bg-gray-200 mb-1"></div>
              <div className="h-4 w-3/4 bg-gray-200 mb-4"></div>
              <div className="h-5 w-28 bg-gray-200"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No categories found.</p>
      </div>
    );
  }

  console.log("Rendering categories:", categories);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {categories.map((category) => (
        <Link 
          key={category.id}
          to={`/company/marketplace/category/${category.id}`}
          className="group"
        >
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 h-full hover:shadow-md transition-shadow">
            <div className="flex flex-col items-center text-center h-full">
              <div className="h-16 w-16 rounded-full bg-indigo-100 text-talent-primary flex items-center justify-center mb-4">
                {category.iconName && iconMap[category.iconName] ? 
                  iconMap[category.iconName] : 
                  <Code size={28} />}
              </div>
              
              <h3 className="text-lg font-semibold mb-2 group-hover:text-talent-primary transition-colors">
                {category.name}
              </h3>
              
              <p className="text-gray-600 text-sm mb-4 flex-grow">
                {category.description}
              </p>
              
              <div className="text-sm font-medium text-talent-primary">
                View Talent Packs
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default CategoryGrid;
