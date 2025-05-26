
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, PlusCircle } from 'lucide-react';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';

interface ProjectsHeaderProps {
  onRefresh: () => void;
  isCreateOpen: boolean;
  setIsCreateOpen: (open: boolean) => void;
}

const ProjectsHeader: React.FC<ProjectsHeaderProps> = ({
  onRefresh,
  isCreateOpen,
  setIsCreateOpen
}) => {
  return (
    <div className="flex justify-between items-center">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
        <p className="text-muted-foreground">
          Manage and track all chamber projects in one place.
        </p>
      </div>
      
      <div className="flex space-x-2">
        <Button variant="outline" onClick={onRefresh} size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
        
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button size="sm" variant="blue">
              <PlusCircle className="h-4 w-4 mr-2" />
              New Project
            </Button>
          </DialogTrigger>
        </Dialog>
      </div>
    </div>
  );
};

export default ProjectsHeader;
