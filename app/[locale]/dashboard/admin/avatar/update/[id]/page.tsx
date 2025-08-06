'use client';
import { useEffect, useState } from 'react';
import { getAvatarById } from '@/app/[locale]/actions/avatar';
import AvatarForm from '@/components/admin/avatar/AvatarForm';
import { Avatar } from '@/types/avatar.d';
import { Skeleton } from '@/components/ui/skeleton';
import { useParams } from 'next/navigation';

const UpdateAvatarPage = () => {
  const { id } = useParams<{ id: string }>()
  const [avatar, setAvatar] = useState<Avatar | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAvatar = async () => {
      setIsLoading(true);
      try {
        const avatarData = await getAvatarById(id);
        if (avatarData) {
          setAvatar(avatarData);
        } else {
          setError("Avatar not found");
        }
      } catch (err) {
        setError('Failed to fetch avatar.');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchAvatar();
    }
  }, [id]);

  if (isLoading) return <div className="container mx-auto px-4 py-8"><Skeleton className="h-96 w-full" /></div>;
  if (error) return <div className="container mx-auto px-4 py-8 text-red-500">{error}</div>;
  if (!avatar) return <div className="container mx-auto px-4 py-8">Avatar not found.</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Edit Avatar</h1>
      <AvatarForm avatar={avatar} />
    </div>
  );
};

export default UpdateAvatarPage;
