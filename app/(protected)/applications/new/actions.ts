'use server'

import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'
import { VALID_COURSES, VALID_PAYMENTS } from '@/lib/labels'
import { DATE_RE } from '@/lib/validation'
import type { Course, Payment } from '@/app/generated/prisma/client'

export interface NewApplicationState {
  fieldErrors?: Record<string, string>
}

export async function createApplication(
  _prevState: NewApplicationState,
  formData: FormData,
): Promise<NewApplicationState> {
  const session = await getSession()
  if (!session) {
    redirect('/login')
  }

  const course = String(formData.get('course') ?? '') as Course
  const startDateRaw = String(formData.get('startDate') ?? '')
  const payment = String(formData.get('payment') ?? '') as Payment

  const fieldErrors: Record<string, string> = {}
  if (!VALID_COURSES.includes(course)) {
    fieldErrors.course = 'Выберите один из предложенных курсов'
  }
  const dateMatch = DATE_RE.exec(startDateRaw)
  if (!dateMatch) {
    fieldErrors.startDate = 'Дата должна быть в формате ДД.ММ.ГГГГ'
  }
  if (!VALID_PAYMENTS.includes(payment)) {
    fieldErrors.payment = 'Выберите способ оплаты'
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { fieldErrors }
  }

  const [, day, month, year] = dateMatch as RegExpExecArray
  const startDate = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)))

  await prisma.application.create({
    data: { userId: session.userId, course, startDate, payment },
  })

  redirect('/applications')
}
