import { LayoutPage } from '#/components/layout/page'
import { Button } from '#/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import { Empty, EmptyHeader, EmptyTitle } from '#/components/ui/empty'
import { AddExercise } from '#/components/workouts/add-exercise'
import { AddSet } from '#/components/workouts/add-set'
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
    workoutInfo.exercises.map((e) => {
      console.log(e.id)
    })
  }

  return (
    <LayoutPage>
      <Button onClick={() => navigate({ to: '/' })}>Return to home</Button>
      <AddExercise userId={userId} workoutId={workoutId} />

      {workoutInfo?.exercises && workoutInfo.exercises.length > 0 ? (
        <div className="flex flex-col gap-5">
          {workoutInfo.exercises.map((e) => (
            <Card key={e.id}>
              <CardHeader>
                <CardTitle>{e.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <AddSet
                  userId={userId}
                  workoutId={workoutId}
                  exerciseId={e.id}
                />
                <div className="py-5 flex flex-col gap-5">
                  {e.sets.map((s) => (
                    <Card key={s.id} className="p-1">
                      <CardHeader className="p-1">
                        <CardTitle>{s.setNumber}</CardTitle>
                      </CardHeader>
                      <CardContent className="flex justify-between items-center p-1 px-10">
                        <h1>
                          Reps: <span>{s.reps}</span>
                        </h1>
                        <h1>
                          Weight: <span>{s.weight}</span>
                        </h1>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Empty>
          <EmptyHeader>
            <EmptyTitle>No exercises yet</EmptyTitle>
          </EmptyHeader>
        </Empty>
      )}
    </LayoutPage>
  )
}
