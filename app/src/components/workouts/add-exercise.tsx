import { createWorkoutExerciseSchema } from '#/server/workouts/workout.schema'
import { useForm } from '@tanstack/react-form'
import { Field, FieldLabel, FieldError } from '../ui/field'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useServerFn } from '@tanstack/react-start'
import { sfCreateNewExercise } from '#/server/workouts/workout.function'
import { toast } from 'sonner'

export const AddExercise = ({
  userId,
  workoutId,
}: {
  userId: string
  workoutId: string
}) => {
  const addExercise = useServerFn(sfCreateNewExercise)

  const addExerciseForm = useForm({
    defaultValues: {
      name: '',
    },
    validators: {
      onSubmit: createWorkoutExerciseSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        await addExercise({ data: { userId, workoutId, name: value.name } })
        toast.success('new exercise added: ' + value.name)
      } catch (err: any) {
        console.error(err)
        toast.error(err.message)
      }
    },
  })

  return (
    <form
      id="add-exercise-form"
      onSubmit={(e) => {
        e.preventDefault()
        addExerciseForm.handleSubmit()
      }}
      className="flex gap-2 items-end"
    >
      <addExerciseForm.Field
        name="name"
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
                onChange={(e) => field.handleChange(e.target.value)}
                aria-invalid={isInvalid}
                placeholder="ex.: Chest press"
                autoComplete="off"
              />
              {isInvalid && <FieldError errors={field.state.meta.errors} />}
            </Field>
          )
        }}
      />
      <Button type="submit" form="add-exercise-form">
        Add Exercise
      </Button>
    </form>
  )
}
