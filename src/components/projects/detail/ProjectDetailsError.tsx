
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import PageTransition from '@/components/ui/page-transition';

interface ProjectDetailsErrorProps {
  onBack: () => void;
}

const ProjectDetailsError: React.FC<ProjectDetailsErrorProps> = ({ onBack }) => {
  return (
    <PageTransition>
      <div className="container px-4 py-8">
        <div className="flex items-center space-x-4 mb-6">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Projects
          </Button>
        </div>
        <div className="bg-destructive/10 text-destructive p-4 rounded-lg">
          Failed to load project details. Please try again.
        </div>
      </div>
    </PageTransition>
  );
};

export default ProjectDetailsError;
