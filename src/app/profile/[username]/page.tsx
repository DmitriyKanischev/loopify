import {
  getProfileByUsername,
  getUserLikedPosts,
  getUserPosts,
  isFollowing,
} from '@/actions/profile.action';
import { notFound } from 'next/navigation';
import ProfilePageClient from './ProfilePageClient';

export async function generateMetadata({
  params,
}: {
  params: { username: string };
}) {
  const { username } = await Promise.resolve(params);
  const user = await getProfileByUsername(username);

  if (!user) return;

  return {
    title: `Profile | ${user.name ?? user.username}`,
    description: user.bio || `Check out ${user.username}&apos; profile`,
  };
}

async function ProfilePageServer({ params }: { params: { username: string } }) {
  const { username } = await Promise.resolve(params)
  const user = await getProfileByUsername(username);
  if (!user) return notFound();

  const [posts, likedPosts, isCurrentUserFollowing] = await Promise.all([
    getUserPosts(user.id),
    getUserLikedPosts(user.id),
    isFollowing(user.id),
  ]);
  return (
    <ProfilePageClient
      user={user}
      posts={posts}
      likedPosts={likedPosts}
      isFollowing={isCurrentUserFollowing}
    />
  );
}

export default ProfilePageServer;
