import { useSfGetAllTheWorkoutsFromInternalUserId } from '#/lib/hooks/workouts.hook'
import { useForm } from '@tanstack/react-form'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog'
import { Field, FieldError, FieldLabel } from '../ui/field'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useServerFn } from '@tanstack/react-start'
import { sfCreateNewWorkout } from '#/server/workouts/workout.function'
import { toast } from 'sonner'
import { createWorkoutSchema } from '#/server/workouts/workout.schema'
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '../ui/empty'
import { Card, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { useQueryClient } from '@tanstack/react-query'

export const WorkoutPanel = ({ userId }: { userId: string }) => {
  const {
    data: currentUserWorkouts,
    isLoading,
    isError,
  } = useSfGetAllTheWorkoutsFromInternalUserId({ userId })

  if (isLoading) {
    return <div>Loading workouts....</div>
  }

  if (isError) {
    return <div>Error workouts....</div>
  }

  if (currentUserWorkouts) {
    console.log(currentUserWorkouts)
  }

  return (
    <div className="flex flex-col ">
      <div className="flex justify-end">
        <WorkoutCreate userId={userId} />
      </div>
      <div className="flex flex-col items-center justify-center">
        {currentUserWorkouts && currentUserWorkouts.length > 0 ? (
          <div className="w-full p-2 flex flex-col gap-5">
            {currentUserWorkouts.map((w) => (
              <Card key={w.id} className=" w-full">
                <CardHeader>
                  <CardTitle>{w.name}</CardTitle>
                  <CardDescription>{w.createdAt.toString()}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        ) : (
          <Empty>
            <EmptyHeader>
              <EmptyTitle>No Workouts</EmptyTitle>
              <EmptyDescription>Create your first workout</EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}
      </div>
    </div>
  )
}

const WorkoutCreate = ({ userId }: { userId: string }) => {
  const queryClient = useQueryClient()
  const createWorkout = useServerFn(sfCreateNewWorkout)

  const createWorkoutForm = useForm({
    defaultValues: {
      name: '',
    },
    validators: {
      onSubmit: createWorkoutSchema,
    },
    onSubmit: async ({ value }) => {
      console.log(value, 'workout create form submit')
      try {
        await createWorkout({ data: { userId, name: value.name } })
        queryClient.invalidateQueries({ queryKey: ['workouts', userId] })
        toast.success(`new workout created: ${value.name}`)
      } catch (err: any) {
        console.error(err, 'error while creating workout')
        toast.error(err.message)
      }
    },
  })

  return (
    <Dialog>
      <DialogTrigger>Create new workout</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create new workout</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <form
          id="create-workout-form"
          onSubmit={(e) => {
            e.preventDefault()
            createWorkoutForm.handleSubmit()
          }}
        >
          <createWorkoutForm.Field
            name="name"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Workout name</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value ?? ''}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    placeholder="ex.: Monster Chest"
                    autoComplete="off"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              )
            }}
          />
        </form>
        <Button type="submit" form="create-workout-form">
          Create Workout
        </Button>
      </DialogContent>
    </Dialog>
  )
}
