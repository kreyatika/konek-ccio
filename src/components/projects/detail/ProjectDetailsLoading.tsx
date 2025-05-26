
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import PageTransition from '@/components/ui/page-transition';

interface ProjectDetailsLoadingProps {
  onBack: () => void;
}

const ProjectDetailsLoading: React.FC<ProjectDetailsLoadingProps> = ({ onBack }) => {
  return (
    <PageTransition>
      <div className="container px-4 py-8">
        <div className="flex items-center space-x-4 mb-6">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Projects
          </Button>
        </div>
        <div className="w-full h-64 rounded-lg bg-muted animate-pulse" />
      </div>
    </PageTransition>
  );
};

export default ProjectDetailsLoading;
