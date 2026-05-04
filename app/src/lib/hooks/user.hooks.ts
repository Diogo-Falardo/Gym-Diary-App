import { sfFetchUserInfoByUserId } from '#/server/users/user.function'
import { useQuery } from '@tanstack/react-query'

export function useSfFetchUserInfoByUserId({ userId }: { userId: string }) {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: () => sfFetchUserInfoByUserId({ data: { userId } }),
  })
}
