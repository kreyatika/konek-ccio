
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageTransition from '@/components/ui/page-transition';
import ProjectDetailHeader from '@/components/projects/detail/ProjectDetailHeader';
import ProjectDetailContent from '@/components/projects/detail/ProjectDetailContent';
import ProjectComments from '@/components/projects/detail/ProjectComments';
import ProjectFiles from '@/components/projects/detail/ProjectFiles';
import CommitteeMembers from '@/components/projects/detail/CommitteeMembers';
import DeleteProjectButton from '@/components/projects/detail/DeleteProjectButton';
import ProjectMeetings from '@/components/projects/detail/ProjectMeetings';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit2 } from 'lucide-react';
import { useAuth } from '@/contexts/auth';
import { useProjectDetails } from '@/hooks/useProjectDetails';
import { useCommitteeMembers } from '@/hooks/useCommitteeMembers';
import ProjectDetailsLoading from '@/components/projects/detail/ProjectDetailsLoading';
import ProjectDetailsError from '@/components/projects/detail/ProjectDetailsError';
import { useMeetings } from '@/hooks/useMeetings';
import { toast } from 'sonner';
import EditProjectModal from '@/components/projects/detail/EditProjectModal';

const ProjectDetails = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { userProfile } = useAuth();
  
  const { data: project, isLoading, error, editProject } = useProjectDetails(id || '');
  const { data: committeeMembers = [], isLoading: isLoadingCommittee } = useCommitteeMembers(
    project?.committee || ''
  );
  const { addMeeting } = useMeetings();
  
  const handleBack = () => {
    navigate('/projects');
  };
  
  const handleAddMeeting = (meetingData: any) => {
    addMeeting(meetingData);
    toast.success(`Meeting scheduled for project: ${project?.title}`);
  };
  
  if (isLoading) {
    return <ProjectDetailsLoading onBack={handleBack} />;
  }
  
  if (error || !project) {
    return <ProjectDetailsError onBack={handleBack} />;
  }
  
  const isCommitteeMember = userProfile?.committee === project.committee;
  
  return (
    <PageTransition>
      <div className="container px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" size="sm" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Projects
          </Button>
          
          <div className="flex items-center gap-2">
            {(userProfile?.role === 'superadmin' || isCommitteeMember) && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditModalOpen(true)}
              >
                <Edit2 className="h-4 w-4 mr-2" />
                Edit Project
              </Button>
            )}
            {userProfile?.role === 'superadmin' && (
              <DeleteProjectButton 
                projectId={project.id} 
                projectTitle={project.title}
              />
            )}
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <ProjectDetailHeader 
            project={project} 
            allMembers={project.members} 
            committeeMembersCount={committeeMembers.length} 
          />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          <div className="lg:col-span-2 space-y-6">
            <ProjectDetailContent 
              project={project} 
              isCommitteeMember={isCommitteeMember} 
              committeeMembers={committeeMembers}
              onAddMeeting={handleAddMeeting}
            />
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Discussion</h3>
              <ProjectComments projectId={project.id} isCommitteeMember={isCommitteeMember} />
            </div>
          </div>
          
          <div className="space-y-6">
            {/* Added Project Meetings component above ProjectFiles */}
            <ProjectMeetings projectId={project.id} projectTitle={project.title} />
            
            <ProjectFiles projectId={project.id} isCommitteeMember={isCommitteeMember} />
            
            <CommitteeMembers committeeName={project.committee} />
          </div>
        </div>
      </div>

      <EditProjectModal
        project={project}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={(projectId, updatedData) => {
          editProject(projectId, updatedData);
          setIsEditModalOpen(false);
          toast.success('Project updated successfully');
        }}
      />
    </PageTransition>
  );
};

export default ProjectDetails;
