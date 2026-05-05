import { useForm } from '@tanstack/react-form'
import { format } from 'date-fns'
import { Field, FieldError, FieldGroup, FieldLabel } from '../ui/field'
import { Input } from '../ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Button } from '../ui/button'
import { useState } from 'react'
import { ChevronDownIcon } from 'lucide-react'
import { Calendar } from '../ui/calendar'
import {
  userPatchSchema,
  type typeUserPatchSchema,
} from '#/server/users/user.schema'
import { useSfFetchUserInfoByUserId } from '#/lib/hooks/user.hooks'
import { useServerFn } from '@tanstack/react-start'
import { sfUpdateUserProfile } from '#/server/users/user.function'
import { toast } from 'sonner'
import { useQueryClient } from '@tanstack/react-query'

export const ProfileUpdater = ({ userId }: { userId: string }) => {
  const queryClient = useQueryClient()
  const [date, setDate] = useState<Date>()
  const {
    data: userInfo,
    isLoading,
    isError,
  } = useSfFetchUserInfoByUserId({ userId })

  const updateProfile = useServerFn(sfUpdateUserProfile)

  const defaultProfile: typeUserPatchSchema = {
    username: userInfo?.username || '',
    dateOfBirth: userInfo?.dateOfBirth || '',
    height: userInfo?.height || 0,
    weight: userInfo?.weight || 0,
  }

  const profileUpdateForm = useForm({
    defaultValues: defaultProfile,
    validators: {
      onChange: userPatchSchema,
    },
    onSubmit: async ({ value }) => {
      console.log(value)
      try {
        await updateProfile({
          data: { userId, profile: value },
        })
        toast.success('profile updated')
        queryClient.invalidateQueries({ queryKey: ['user', userId] })
      } catch (err: any) {
        console.error(err)
        toast.error(err.message)
      }
    },
  })

  if (isLoading) {
    return <div>Loading user....</div>
  }

  if (isError) {
    return <div>Error loading user....</div>
  }

  if (!userInfo) {
    return <div>User was not found!</div>
  }

  return (
    <form
      id="profile-update-form"
      onSubmit={(e) => {
        e.preventDefault()
        profileUpdateForm.handleSubmit()
      }}
      className="space-y-5"
    >
      <FieldGroup>
        <profileUpdateForm.Field
          name="username"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Username</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value ?? ''}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                  placeholder="ex.: Bloop"
                  autoComplete="off"
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            )
          }}
        />

        <profileUpdateForm.Field
          name="dateOfBirth"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Date of birth</FieldLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id={field.name}
                      name={field.name}
                      variant={'outline'}
                      data-empty={!date}
                      className="w-53 justify-between text-left font-normal data-[empty=true]:text-muted-foreground"
                    >
                      {date ? (
                        format(date, 'PPP')
                      ) : (
                        <span>{userInfo.dateOfBirth ?? 'Pick a date'}</span>
                      )}
                      <ChevronDownIcon />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={(selectedDate) => {
                        setDate(selectedDate)
                        field.handleChange(
                          selectedDate
                            ? format(selectedDate, 'yyyy-MM-dd')
                            : '',
                        )
                      }}
                      aria-invalid={isInvalid}
                      defaultMonth={date}
                    />
                  </PopoverContent>
                </Popover>
              </Field>
            )
          }}
        />

        <profileUpdateForm.Field
          name="height"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Height (cm)</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  type="number"
                  step="0.01"
                  value={field.state.value ?? ''}
                  onBlur={field.handleBlur}
                  onChange={(e) => {
                    // Convert to number or set to 0 if empty
                    const value =
                      e.target.value === '' ? 0 : parseFloat(e.target.value)
                    field.handleChange(value)
                  }}
                  aria-invalid={isInvalid}
                  placeholder="e.g., 175.5"
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            )
          }}
        />

        <profileUpdateForm.Field
          name="weight"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Weight (kg)</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  type="number"
                  step="0.01"
                  value={field.state.value ?? ''}
                  onBlur={field.handleBlur}
                  onChange={(e) => {
                    const value =
                      e.target.value === '' ? 0 : parseFloat(e.target.value)
                    field.handleChange(value)
                  }}
                  aria-invalid={isInvalid}
                  placeholder="e.g., 70.2"
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            )
          }}
        />
      </FieldGroup>

      <Button form="profile-update-form" type="submit">
        Update Profile
      </Button>
    </form>
  )
}
