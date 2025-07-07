
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { addGroupMember, getGroupMembers, updateGroupMember, deleteGroupMember } from '@/services/database';
import { useToast } from '@/hooks/use-toast';

export const useGroupMembers = (groupId: string) => {
  return useQuery({
    queryKey: ['group-members', groupId],
    queryFn: () => getGroupMembers(groupId),
    enabled: !!groupId,
  });
};

export const useAddGroupMember = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: addGroupMember,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['group-members', data.group_id] });
      toast({
        title: "Success",
        description: "Member added successfully!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add member",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateGroupMember = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: any }) => updateGroupMember(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['group-members'] });
      toast({
        title: "Success",
        description: "Member updated successfully!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update member",
        variant: "destructive",
      });
    },
  });
};

export const useDeleteGroupMember = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: deleteGroupMember,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['group-members'] });
      toast({
        title: "Success",
        description: "Member deleted successfully!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete member",
        variant: "destructive",
      });
    },
  });
};
