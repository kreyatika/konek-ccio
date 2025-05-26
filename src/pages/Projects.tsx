
import React, { useState } from 'react';
import PageTransition from '@/components/ui/page-transition';
import { Dialog } from '@/components/ui/dialog';
import { useProjects } from '@/hooks/useProjects';
import ProjectsHeader from '@/components/projects/ProjectsHeader';
import ProjectsLoading from '@/components/projects/ProjectsLoading';
import ProjectsError from '@/components/projects/ProjectsError';
import CreateProjectDialog from '@/components/projects/CreateProjectDialog';
import ProjectTabs from '@/components/projects/ProjectTabs';

const Projects = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const {
    projects,
    isLoading,
    error,
    handleRefresh
  } = useProjects();

  // Reset form when dialog closes
  const handleDialogChange = (open: boolean) => {
    setIsCreateOpen(open);
  };

  // Logging for debugging
  console.log('Projects data:', projects);

  // Loading state
  if (isLoading) {
    return <ProjectsLoading />;
  }

  // Error state
  if (error) {
    return <ProjectsError onRefresh={handleRefresh} />;
  }

  // Ensure projects is an array, even if data fetching returned undefined
  const safeProjects = Array.isArray(projects) ? projects : [];
  
  return (
    <PageTransition>
      <div className="container px-4 py-6 mx-[35px]">
        <div className="flex flex-col space-y-6">
          <ProjectsHeader 
            onRefresh={handleRefresh} 
            isCreateOpen={isCreateOpen} 
            setIsCreateOpen={handleDialogChange} 
          />
          
          <ProjectTabs projects={safeProjects} />
        </div>
      </div>
      
      <Dialog open={isCreateOpen} onOpenChange={handleDialogChange}>
        <CreateProjectDialog onSuccess={() => setIsCreateOpen(false)} />
      </Dialog>
    </PageTransition>
  );
};

export default Projects;
