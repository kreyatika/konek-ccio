
import React from 'react';
import { Loader2 } from 'lucide-react';
import PageTransition from '@/components/ui/page-transition';

const ProjectsLoading: React.FC = () => {
  return (
    <PageTransition>
      <div className="container px-4 py-6 mx-auto flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading projects...</p>
      </div>
    </PageTransition>
  );
};

export default ProjectsLoading;
