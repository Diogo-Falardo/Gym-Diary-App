import { LayoutPage } from '#/components/layout/page'
import { Button } from '#/components/ui/button'
import { AddExercise } from '#/components/workouts/add-exercise'
import { useSfFullWorkoutInfo } from '#/lib/hooks/workouts.hook'
import { useNavigate } from '@tanstack/react-router'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/workouts/$userId/$workoutId')({
  component: RouteComponent,
})

function RouteComponent() {
  const { userId, workoutId } = Route.useParams()
  const navigate = useNavigate()

  const {
    data: workoutInfo,
    isLoading,
    isError,
  } = useSfFullWorkoutInfo({ userId, workoutId })

  if (isLoading) {
    return <div>Loading workout....</div>
  }

  if (isError) {
    return <div>Error loading workout....</div>
  }

  if (workoutInfo) {
    console.log(workoutInfo)
  }

  return (
    <LayoutPage>
      <Button onClick={() => navigate({ to: '/' })}>Return to home</Button>
      <AddExercise userId={userId} workoutId={workoutId} />
    </LayoutPage>
  )
}
