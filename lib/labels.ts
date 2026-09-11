import type { Course, Payment, Status } from '@/app/generated/prisma/client'

export const COURSE_LABELS: Record<Course, string> = {
  algorithms: 'Основы алгоритмизации и программирования',
  webdesign: 'Основы веб-дизайна',
  databases: 'Основы проектирования баз данных',
}

export const PAYMENT_LABELS: Record<Payment, string> = {
  cash: 'Наличными',
  phone_transfer: 'Переводом по номеру телефона',
}

export const VALID_COURSES = Object.keys(COURSE_LABELS) as Course[]
export const VALID_PAYMENTS = Object.keys(PAYMENT_LABELS) as Payment[]

export const STATUS_LABELS: Record<Status, string> = {
  new: 'Новая',
  in_progress: 'Идет обучение',
  completed: 'Обучение завершено',
}

export function formatDate(date: Date): string {
  const day = String(date.getUTCDate()).padStart(2, '0')
  const month = String(date.getUTCMonth() + 1).padStart(2, '0')
  const year = date.getUTCFullYear()
  return `${day}.${month}.${year}`
}
