'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createUser,
  deleteUser,
  getUser,
  listUsers,
  updateUser,
  User,
  UserImage,
  UserUpdatePayload,
} from './users';
import { deleteUserImage, uploadUserImage } from './user-images';

export function useUsersQuery(search: string) {
  const query = search.trim();
  return useQuery({
    queryKey: ['users', query],
    queryFn: () => listUsers(query),
  });
}

export function useUserDetailsQuery(userId?: number) {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: () => getUser(userId as number),
    enabled: typeof userId === 'number',
  });
}

export function useUpdateUserMutation(userId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UserUpdatePayload) => updateUser(userId, payload),
    onSuccess: (updatedUser: User) => {
      queryClient.setQueryData(['user', userId], updatedUser);
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

export function useCreateUserMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UserUpdatePayload) => createUser(payload),
    onSuccess: (createdUser: User) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.setQueryData(['user', createdUser.id], createdUser);
    },
  });
}

export function useUploadUserImageMutation(userId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => uploadUserImage(userId, file),
    onSuccess: (newImage: UserImage) => {
      const appendImage = (images?: UserImage[]) => {
        const next = images ? [...images, newImage] : [newImage];
        return next.sort((a, b) => b.displayOrder - a.displayOrder);
      };

      queryClient.setQueryData<User>(['user', userId], (current) =>
        current ? { ...current, images: appendImage(current.images) } : current
      );

      queryClient.setQueryData<User[]>(['users'], (current) =>
        current
          ? current.map((user) =>
              user.id === userId
                ? { ...user, images: appendImage(user.images) }
                : user
            )
          : current
      );

      queryClient.invalidateQueries({ queryKey: ['user', userId] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

export function useDeleteUserImageMutation(userId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (imageId: number) => deleteUserImage(userId, imageId),
    onMutate: async (imageId: number) => {
      await queryClient.cancelQueries({ queryKey: ['user', userId] });
      await queryClient.cancelQueries({ queryKey: ['users'] });

      const previousUser = queryClient.getQueryData<User>(['user', userId]);
      const previousUsers = queryClient.getQueryData<User[]>(['users']);

      const removeImage = (images?: UserImage[]) =>
        images ? images.filter((image) => image.id !== imageId) : images;

      if (previousUser) {
        queryClient.setQueryData<User>(['user', userId], {
          ...previousUser,
          images: removeImage(previousUser.images),
        });
      }

      if (previousUsers) {
        queryClient.setQueryData<User[]>(
          ['users'],
          previousUsers.map((user) =>
            user.id === userId
              ? { ...user, images: removeImage(user.images) }
              : user
          )
        );
      }

      return { previousUser, previousUsers };
    },
    onError: (_error, _imageId, context) => {
      if (context?.previousUser) {
        queryClient.setQueryData(['user', userId], context.previousUser);
      }
      if (context?.previousUsers) {
        queryClient.setQueryData(['users'], context.previousUsers);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', userId] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

export function useDeleteUserMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: number) => deleteUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}
