import { createWorkoutExerciseSetSchema } from '#/server/workouts/workout.schema'
import { useForm } from '@tanstack/react-form'
import { Button } from '../ui/button'
import { Field, FieldError, FieldLabel } from '../ui/field'
import { Input } from '../ui/input'
import { useServerFn } from '@tanstack/react-start'
import { sfCreateNewSet } from '#/server/workouts/workout.function'
import { toast } from 'sonner'
import { useQueryClient } from '@tanstack/react-query'

export const AddSet = ({
  userId,
  workoutId,
  exerciseId,
}: {
  userId: string
  workoutId: string
  exerciseId: string
}) => {
  const queryClient = useQueryClient()
  const addSet = useServerFn(sfCreateNewSet)

  const createNewSetForm = useForm({
    defaultValues: {
      reps: 0,
      weight: 0,
    },
    validators: {
      onChange: createWorkoutExerciseSetSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        await addSet({
          data: { exerciseId, reps: value.reps, weight: value.weight },
        })
        queryClient.invalidateQueries({
          queryKey: ['workout', userId, workoutId],
        })
        toast.success('new set added')
      } catch (err: any) {
        console.error(err)
        toast.error(err.message)
      }
    },
  })

  return (
    <form
      id={`create-new-set-form-${exerciseId}`}
      onSubmit={(e) => {
        e.preventDefault()
        createNewSetForm.handleSubmit()
      }}
      className="flex gap-2 items-end"
    >
      <createNewSetForm.Field
        name="reps"
        children={(field) => {
          const isInvalid =
            field.state.meta.isTouched && !field.state.meta.isValid
          return (
            <Field data-invalid={isInvalid}>
              <FieldLabel htmlFor={field.name}>Exercise name</FieldLabel>
              <Input
                id={field.name}
                name={field.name}
                type="number"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(Number(e.target.value))}
                aria-invalid={isInvalid}
                placeholder="ex.: 12"
                autoComplete="off"
              />
              {isInvalid && <FieldError errors={field.state.meta.errors} />}
            </Field>
          )
        }}
      />
      <createNewSetForm.Field
        name="weight"
        children={(field) => {
          const isInvalid =
            field.state.meta.isTouched && !field.state.meta.isValid
          return (
            <Field data-invalid={isInvalid}>
              <FieldLabel htmlFor={field.name}>Exercise name</FieldLabel>
              <Input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(Number(e.target.value))}
                aria-invalid={isInvalid}
                placeholder="ex.: 25"
                autoComplete="off"
              />
              {isInvalid && <FieldError errors={field.state.meta.errors} />}
            </Field>
          )
        }}
      />
      <Button type="submit" form={`create-new-set-form-${exerciseId}`}>
        add set
      </Button>
    </form>
  )
}
